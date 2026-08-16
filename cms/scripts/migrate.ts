// Runs pending Postgres migrations against DATABASE_URI, using Payload's Local
// API rather than the `payload` CLI binary directly — this keeps working from
// the standalone Next.js output, which doesn't trace in CLI-only entry points.
// Invoked as a CI step (full node_modules, via `pnpm --filter portfolio-cms migrate`)
// before the Pi's containers are restarted with the new image — see deploy.yml.
//
// Skips Payload's dev-mode schema auto-push (which would otherwise also try,
// and fail the same way, against a schema that doesn't exist yet).
process.env.PAYLOAD_MIGRATING = 'true';

// Unlike `next dev`/`next build` (which load .env automatically), a plain tsx
// script doesn't — without this, DATABASE_URI/PAYLOAD_SECRET/etc. are all undefined.
import 'dotenv/config';
import { getPayload } from 'payload';
import config from '../payload.config';

const run = async () => {
  const payload = await getPayload({ config });

  // Postgres doesn't create a schema just because a migration references it —
  // `CREATE TABLE "payload"."x"` fails with "schema does not exist" against a
  // brand-new database. This is idempotent, so it's safe on every run.
  const schemaName = process.env.PAYLOAD_DB_SCHEMA || 'payload';
  await payload.db.execute({
    drizzle: payload.db.drizzle,
    raw: `CREATE SCHEMA IF NOT EXISTS "${schemaName}"`,
  });

  await payload.db.migrate();
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
