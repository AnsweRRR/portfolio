/**
 * Az `api` és `worker` szolgáltatás self-contained bundle-jét állítja elő esbuilddel.
 *
 * Miért bundle: a runtime image-be így egyetlen .cjs fájl kerül — nincs benne
 * node_modules, pnpm és tsx sem. Ezzel eltűnik a Pi-n eddig szükséges
 * `pnpm install --ignore-workspace --lockfile-dir=..` workaround (pnpm/pnpm#7208),
 * és a worker `tsx`-devDependency csapdája is (a `start` script runtime-ban hívta
 * azt, ami csak devDependency volt).
 *
 * Használat:
 *   node scripts/build-bundles.mjs              # mindkettő
 *   node scripts/build-bundles.mjs --only=api   # csak az egyik
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
    // CJS szándékosan: a `ws` try/catch-ben hívja a `require('bufferutil')`-t.
    // CJS-nél a hiányzó external csendben elnyelődik, ESM-nél a top-level import
    // már betöltéskor hibát dobna.
    format: 'cjs',
    // Opcionális natív gyorsítók a `ws`-hez. Nem telepítjük őket, a `ws` elvan
    // nélkülük — de a bundlernek tudnia kell, hogy ne próbálja feloldani.
    external: ['bufferutil', 'utf-8-validate'],
    sourcemap: true,
    minify: false,
    legalComments: 'none',
    logLevel: 'info',
  });

  console.log(`[bundle] ${target.name} -> ${target.outfile} (${Date.now() - start}ms)`);
}
