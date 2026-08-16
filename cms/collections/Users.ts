import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    // Admin-only collection: no public read, only authenticated admins manage it.
    read: ({ req: { user } }) => Boolean(user),
  },
  fields: [],
};
