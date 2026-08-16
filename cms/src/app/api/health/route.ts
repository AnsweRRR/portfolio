// This route lives outside the (payload) route group, so payload.config.ts's
// `cors` option never applies to it — Docker's healthcheck (same-origin, from
// inside the container) never needed CORS headers, but the frontend's
// browser-side availability check does, so this responds with them directly.
export function GET() {
  return new Response('ok', {
    status: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
  });
}
