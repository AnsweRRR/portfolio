import path from 'node:path';
import { withPayload } from '@payloadcms/next/withPayload';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Traces + copies only the node_modules subset actually needed at runtime —
  // the Next.js equivalent of the esbuild "no node_modules" bundling used for
  // the other Docker images in this repo. See cms/Dockerfile.
  output: 'standalone',
  // In a pnpm workspace, the shared node_modules/.pnpm store lives at the repo
  // root, one level above this app — without this, Next's tracer resolves
  // relative to cms/ instead and can miss root-hoisted store files.
  outputFileTracingRoot: path.join(process.cwd(), '..'),
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
