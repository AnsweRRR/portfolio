import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import TuyaMessageSubscribeWebsocket from "./tuya-sdk/index.js";
import { TuyaRegionConfigEnum } from "./tuya-sdk/config.js";
import {
  markConnected,
  markDisconnected,
  markError,
  markInsert,
  markMessage,
  startHealthServer,
} from "./health.js";

// quiet: no .env file in the container (the env vars come from outside), so the
// dotenv startup banner would just be noise in the log.
dotenv.config({ quiet: true });

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    // A missing env var is the most common startup failure in a container — better
    // to fail with a clear message than with an obscure error from the Supabase client.
    console.error(`[worker] Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}

const supabase = createClient(
  requireEnv("SUPABASE_URL"),
  requireEnv("SUPABASE_SECRET_KEY"),
);

const RELEVANT_CODES = new Set([
  "battery_percentage",
  "humidity_value",
  "temp_current",
]);

type TuyaPayloadData = {
  bizData?: {
    properties?: unknown;
  };
};

function tuyaMessageRegionUrl(): TuyaRegionConfigEnum {
  const r = (process.env.TUYA_MSG_REGION ?? "EU").toUpperCase();
  const map: Record<string, TuyaRegionConfigEnum | undefined> = {
    CN: TuyaRegionConfigEnum.CN,
    US: TuyaRegionConfigEnum.US,
    EU: TuyaRegionConfigEnum.EU,
    IN: TuyaRegionConfigEnum.IN,
  };
  return map[r] ?? TuyaRegionConfigEnum.EU;
}

function start() {
  const healthServer = startHealthServer();

  const client = new TuyaMessageSubscribeWebsocket({
    accessId: requireEnv("TUYA_CLIENT_ID"),
    accessKey: requireEnv("TUYA_SECRET"),
    url: tuyaMessageRegionUrl(),
    env: TuyaMessageSubscribeWebsocket.env.PROD,
    maxRetryTimes: 100,
  });

  client.open(() => {
    markConnected();
    console.log("[tuya-ws] open");
  });

  client.close((code, reason) => {
    markDisconnected();
    console.log("[tuya-ws] close", code, reason.toString());
  });

  client.message(async (_ws, message) => {
    markMessage();

    try {
      const messageId =
        "messageId" in message && typeof message.messageId === "string"
          ? message.messageId
          : undefined;

      if (messageId) {
        client.ackMessage(messageId);
      }

      const props = (message.payload?.data as TuyaPayloadData | undefined)
        ?.bizData?.properties;

      if (!Array.isArray(props)) return;

      for (const dp of props) {
        if (!RELEVANT_CODES.has(dp.code)) continue;

        const { error } = await supabase.from(dp.code).insert([
          {
            code: dp.code,
            dpid: dp.dpId,
            time: dp.time,
            value: dp.value,
          },
        ]);

        if (error) {
          markError(error);
          console.error("Supabase error:", error);
        } else {
          markInsert();
          console.log("[insert]", dp.code, dp.value);
        }
      }
    } catch (err) {
      markError(err);
      console.error("Processing error:", err);
    }
  });

  client.reconnect(() => {
    markConnected();
    console.log("[tuya-ws] reconnect");
  });

  client.error((_ws, err) => {
    markError(err);
    console.error("[tuya-ws] error", err);
  });

  client.start();

  // `docker compose down`/`restart` sends SIGTERM; without this, SIGKILL
  // follows 10 seconds later.
  const shutdown = (signal: string) => {
    console.log(`[worker] ${signal} received, shutting down`);
    healthServer.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 5000).unref();
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

start();
