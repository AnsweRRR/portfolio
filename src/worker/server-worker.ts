import { createClient } from "@supabase/supabase-js";
import TuyaMessageSubscribeWebsocket from "../tuya-sdk/index.ts";
import { TuyaRegionConfigEnum } from "../tuya-sdk/config.ts";
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
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
    const client = new TuyaMessageSubscribeWebsocket({
        accessId: process.env.VITE_TUYA_CLIENT_ID!,
        accessKey: process.env.VITE_TUYA_SECRET!,
        url: tuyaMessageRegionUrl(),
        env: TuyaMessageSubscribeWebsocket.env.PROD,
        maxRetryTimes: 100,
    });

    client.open(() => {
        console.log("[tuya-ws] open");
    });

    client.close((code, reason) => {
        console.log('[tuya-ws] close', code, reason.toString());
    });

    client.message(async (_ws, message) => {
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
                    console.error("Supabase error:", error);
                } else {
                    console.log("[insert]", dp.code, dp.value);
                }
            }
        } catch (err) {
            console.error("Processing error:", err);
        }
    });

    client.reconnect(() => {
        console.log("[tuya-ws] reconnect");
    });

    client.error((_ws, err) => {
        console.error("[tuya-ws] error", err);
    });

    client.start();
}

start();
