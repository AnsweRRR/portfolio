import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';

import { Posts } from './collections/Posts';
import { Categories } from './collections/Categories';
import { Media } from './collections/Media';
import { Users } from './collections/Users';

const frontendOrigins = [
  'https://pogranyitamas.com',
  'https://www.pogranyitamas.com',
  // Local Vite dev server, so `pnpm dev:all` can hit this CMS during development.
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost',
];

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  secret: process.env.PAYLOAD_SECRET!,
  admin: {
    user: Users.slug,
  },
  collections: [Posts, Categories, Media, Users],
  editor: lexicalEditor({}),
  localization: {
    locales: ['en', 'hu', 'de'],
    defaultLocale: 'en',
    fallback: true,
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
    // Dedicated schema so Payload's tables never collide with the existing
    // Tuya/weather tables already living in this Supabase Postgres instance.
    schemaName: process.env.PAYLOAD_DB_SCHEMA || 'payload',
  }),
  plugins: [
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET!,
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION || 'auto',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
        // Supabase Storage's S3-compatible endpoint requires path-style URLs.
        forcePathStyle: true,
      },
    }),
  ],
  cors: frontendOrigins,
  csrf: frontendOrigins,
  typescript: {
    outputFile: './payload-types.ts',
  },
});
