import CryptoJS from 'crypto-js';
import crypto from 'node:crypto';
import { Buffer } from 'node:buffer';

export type JsonObject = Record<string, unknown>;

export function getTopicUrl(websocketUrl: string, accessId: string, env: string, query: string): string {
  return `${websocketUrl}ws/v2/consumer/persistent/${accessId}/out/${env}/${accessId}-sub${query}`;
}

export function buildQuery(query: Record<string, number | string>): string {
  return Object.keys(query)
    .map((key) => `${key}=${encodeURIComponent(query[key])}`)
    .join('&');
}

export function buildPassword(accessId: string, accessKey: string): string {
  const key = CryptoJS.MD5(accessKey).toString();
  return CryptoJS.MD5(`${accessId}${key}`).toString().slice(8, 24);
}

export function decrypt(data: string, accessKey: string, encryptyModel: string): JsonObject | '' {
  if (encryptyModel === 'aes_gcm') {
    return decryptByGCM(data, accessKey);
  }

  return decryptByECB(data, accessKey);
}

export function decryptByECB(data: string, accessKey: string): JsonObject | '' {
  try {
    const realKey = CryptoJS.enc.Utf8.parse(accessKey.substring(8, 24));
    const json = CryptoJS.AES.decrypt(data, realKey, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    const dataStr = CryptoJS.enc.Utf8.stringify(json).toString();
    return JSON.parse(dataStr);
  } catch {
    return '';
  }
}

export function decryptByGCM(data: string, accessKey: string): JsonObject | '' {
  try {
    const bData = Buffer.from(data, 'base64');
    const iv = bData.subarray(0, 12);
    const tag = bData.subarray(bData.length - 16);
    const cipherData = bData.subarray(12, bData.length - 16);
    const decipher = crypto.createDecipheriv('aes-128-gcm', accessKey.substring(8, 24), iv);
    decipher.setAuthTag(tag);
    let dataStr = decipher.update(cipherData, undefined, 'utf8');
    dataStr += decipher.final('utf8');
    return JSON.parse(dataStr);
  } catch {
    return '';
  }
}

export function encrypt(data: unknown, accessKey: string): string {
  try {
    const realKey = CryptoJS.enc.Utf8.parse(accessKey.substring(8, 24));
    const realData = JSON.stringify(data);
    const retData = CryptoJS.AES.encrypt(realData, realKey, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
    return retData;
  } catch {
    return '';
  }
}
