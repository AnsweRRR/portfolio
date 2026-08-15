/**
 * Produces a self-contained bundle of the `api` and `worker` services with esbuild.
 *
 * Why bundle: this gets a single .cjs file into the runtime image — no
 * node_modules, pnpm, or tsx in it. This removes the previously needed
 * `pnpm install --ignore-workspace --lockfile-dir=..` workaround on the Pi (pnpm/pnpm#7208),
 * as well as the worker's `tsx`-devDependency trap (the `start` script called it
 * at runtime, even though it was only a devDependency).
 *
 * Usage:
 *   node scripts/build-bundles.mjs              # both
 *   node scripts/build-bundles.mjs --only=api   # just one
 */
import { build } from 'esbuild';

const TARGETS = [
  { name: 'api', entry: 'server/index.ts', outfile: 'out/api.cjs' },
  { name: 'worker', entry: 'worker/src/server-worker.ts', outfile: 'out/worker.cjs' },
];

const only = process.argv
  .find((arg) => arg.startsWith('--only='))
  ?.slice('--only='.length);

const selected = only ? TARGETS.filter((t) => t.name === only) : TARGETS;

if (selected.length === 0) {
  console.error(
    `Unknown target "${only}". Available: ${TARGETS.map((t) => t.name).join(', ')}`,
  );
  process.exit(1);
}

for (const target of selected) {
  const start = Date.now();

  await build({
    entryPoints: [target.entry],
    outfile: target.outfile,
    bundle: true,
    platform: 'node',
    target: 'node22',
    // CJS deliberately: `ws` calls `require('bufferutil')` in a try/catch.
    // With CJS, the missing external is silently swallowed; with ESM, the top-level import
    // would throw at load time already.
    format: 'cjs',
    // Optional native accelerators for `ws`. We don't install them; `ws` works fine
    // without them — but the bundler needs to know not to try to resolve them.
    external: ['bufferutil', 'utf-8-validate'],
    sourcemap: true,
    minify: false,
    legalComments: 'none',
    logLevel: 'info',
  });

  console.log(`[bundle] ${target.name} -> ${target.outfile} (${Date.now() - start}ms)`);
}
