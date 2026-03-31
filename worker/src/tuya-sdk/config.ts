export enum TuyaRegionConfigEnum {
  CN = "wss://mqe.tuyacn.com:8285/",
  US = "wss://mqe.tuyaus.com:8285/",
  EU = "wss://mqe.tuyaeu.com:8285/",
  IN = "wss://mqe.tuyain.com:8285/",
}

export enum TUYA_PASULAR_ENV {
  PROD = "prod",
  TEST = "test",
}

export interface TuyaEnvItem {
  name: TUYA_PASULAR_ENV;
  value: "event" | "event-test";
  desc: string;
}

export const TuyaEnvConfig: Record<TUYA_PASULAR_ENV, TuyaEnvItem> = Object.freeze({
  [TUYA_PASULAR_ENV.PROD]: {
    name: TUYA_PASULAR_ENV.PROD,
    value: "event",
    desc: "online environment",
  },
  [TUYA_PASULAR_ENV.TEST]: {
    name: TUYA_PASULAR_ENV.TEST,
    value: "event-test",
    desc: "test environment",
  },
});

export function getTuyaEnvConfig(env: TUYA_PASULAR_ENV): TuyaEnvItem {
  return TuyaEnvConfig[env];
}
