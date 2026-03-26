import EventEmitter from 'node:events';
import { Buffer } from 'node:buffer';
import WebSocket, { type RawData } from 'ws';

import { TUYA_PASULAR_ENV, getTuyaEnvConfig, TuyaRegionConfigEnum } from './config';
import { buildPassword, buildQuery, decrypt, type JsonObject, getTopicUrl } from './utils';

type LoggerLevel = 'INFO' | 'ERROR';

interface IConfig {
  accessId: string;
  accessKey: string;
  env: TUYA_PASULAR_ENV;
  url: TuyaRegionConfigEnum;

  timeout?: number;
  maxRetryTimes?: number;
  retryTimeout?: number;
  logger?: (level: LoggerLevel, ...args: unknown[]) => void;
}

interface DecodedPayload extends JsonObject {
  data?: unknown;
}

interface ParsedMessage {
  payload: DecodedPayload;
  [key: string]: unknown;
}

class TuyaMessageSubscribeWebsocket {
  static readonly URL = TuyaRegionConfigEnum;
  static readonly env = TUYA_PASULAR_ENV;

  static readonly data = 'TUYA_DATA';
  static readonly error = 'TUYA_ERROR';
  static readonly open = 'TUYA_OPEN';
  static readonly close = 'TUYA_CLOSE';
  static readonly reconnect = 'TUYA_RECONNECT';
  static readonly ping = 'TUYA_PING';
  static readonly pong = 'TUYA_PONG';

  private config: IConfig;
  private server?: WebSocket;
  private timer?: NodeJS.Timeout;
  private retryTimes = 0;
  private readonly event: EventEmitter;

  constructor(config: IConfig) {
    this.config = {
      retryTimeout: 1000,
      maxRetryTimes: 100,
      timeout: 30000,
      logger: (level, ...args) => {
        if (level === 'ERROR') {
          console.error(...args);
          return;
        }

        console.info(...args);
      },
      ...config,
    };
    this.event = new EventEmitter();
  }

  public start(): void {
    this.server = this._connect();
  }

  public open(cb: (ws: WebSocket | undefined) => void): void {
    this.event.on(TuyaMessageSubscribeWebsocket.open, cb);
  }

  public message(cb: (ws: WebSocket | undefined, message: ParsedMessage) => void): void {
    this.event.on(TuyaMessageSubscribeWebsocket.data, cb);
  }

  public ping(cb: (ws: WebSocket | undefined) => void): void {
    this.event.on(TuyaMessageSubscribeWebsocket.ping, cb);
  }

  public pong(cb: (ws: WebSocket | undefined) => void): void {
    this.event.on(TuyaMessageSubscribeWebsocket.pong, cb);
  }

  public reconnect(cb: (ws: WebSocket | undefined) => void): void {
    this.event.on(TuyaMessageSubscribeWebsocket.reconnect, cb);
  }

  public ackMessage(messageId: string): void {
    if (!this.server || this.server.readyState !== WebSocket.OPEN) {
      return;
    }

    this.server.send(JSON.stringify({ messageId }));
  }

  public error(cb: (ws: WebSocket | undefined, error: unknown) => void): void {
    this.event.on(TuyaMessageSubscribeWebsocket.error, cb);
  }

  public close(cb: (code: number, reason: Buffer) => void): void {
    this.event.on(TuyaMessageSubscribeWebsocket.close, cb);
  }

  private _reconnect(): void {
    if (this.config.maxRetryTimes && this.retryTimes < this.config.maxRetryTimes) {
      setTimeout(() => {
        this.retryTimes++;
        this._connect(false);
      }, this.config.retryTimeout);
    }
  }

  private _connect(isInit = true): WebSocket {
    const { accessId, accessKey, env, url } = this.config;
    const topicUrl = getTopicUrl(
      url,
      accessId,
      getTuyaEnvConfig(env).value,
      `?${buildQuery({ subscriptionType: 'Failover', ackTimeoutMillis: 30000 })}`,
    );
    const password = buildPassword(accessId, accessKey);
    this.server = new WebSocket(topicUrl, {
      rejectUnauthorized: false,
      headers: { username: accessId, password },
    });
    this.subOpen(this.server, isInit);
    this.subMessage(this.server);
    this.subPing(this.server);
    this.subPong(this.server);
    this.subError(this.server);
    this.subClose(this.server);
    return this.server;
  }

  private subOpen(server: WebSocket, isInit = true): void {
    server.on('open', () => {
      if (server.readyState === WebSocket.OPEN) {
        this.retryTimes = 0;
      }
      this.keepAlive(server);
      this.event.emit(
        isInit ? TuyaMessageSubscribeWebsocket.open : TuyaMessageSubscribeWebsocket.reconnect,
        this.server,
      );
    });
  }

  private subPing(server: WebSocket): void {
    server.on('ping', () => {
      this.event.emit(TuyaMessageSubscribeWebsocket.ping, this.server);
      this.keepAlive(server);
      server.pong(this.config.accessId);
    });
  }

  private subPong(server: WebSocket): void {
    server.on('pong', () => {
      this.keepAlive(server);
      this.event.emit(TuyaMessageSubscribeWebsocket.pong, this.server);
    });
  }

  private subMessage(server: WebSocket): void {
    server.on('message', (data: RawData) => {
      try {
        this.keepAlive(server);
        const obj = this.handleMessage(data);
        // this.logger('INFO', 'the real message data:', obj);
        this.event.emit(TuyaMessageSubscribeWebsocket.data, this.server, obj);
      } catch (error) {
        this.logger('ERROR', error);
        this.event.emit(TuyaMessageSubscribeWebsocket.error, this.server, error);
      }
    });
  }

  private subClose(server: WebSocket): void {
    server.on('close', (code: number, reason: Buffer) => {
      this._reconnect();
      this.clearKeepAlive();
      this.event.emit(TuyaMessageSubscribeWebsocket.close, code, reason);
    });
  }

  private subError(server: WebSocket): void {
    server.on('error', (error: Error) => {
      this.event.emit(TuyaMessageSubscribeWebsocket.error, this.server, error);
    });
  }

  private clearKeepAlive(): void {
    if (!this.timer) {
      return;
    }

    clearTimeout(this.timer);
    this.timer = undefined;
  }

  private keepAlive(server: WebSocket): void {
    this.clearKeepAlive();
    const timeout = this.config.timeout ?? 30000;
    this.timer = setTimeout(() => {
      server.ping(this.config.accessId);
    }, timeout);
  }

  private handleMessage(data: RawData): ParsedMessage {
    const payloadText = data.toString();
    const parsed = JSON.parse(payloadText) as {
      payload: string;
      properties?: { em?: string };
      [key: string]: unknown;
    };
    const { payload, properties, ...others } = parsed;
    const encryptyModel = properties?.em ?? '';
    const pStr = Buffer.from(payload, 'base64').toString('utf-8');
    const pJson = JSON.parse(pStr);
    if (typeof pJson.data === 'string') {
      pJson.data = decrypt(pJson.data, this.config.accessKey, encryptyModel);
    }
    return { payload: pJson, ...others };
  }

  private logger(level: LoggerLevel, ...info: unknown[]): void {
    const realInfo = `${Date.now()} `;
    this.config.logger?.(level, realInfo, ...info);
  }
}

export default TuyaMessageSubscribeWebsocket;
