import * as migration_20260816_104121 from './20260816_104121';

export const migrations = [
  {
    up: migration_20260816_104121.up,
    down: migration_20260816_104121.down,
    name: '20260816_104121'
  },
];
