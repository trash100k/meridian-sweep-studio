// PLACEHOLDER: OpenClaw / external lead retrieval endpoint.
//
// To enable:
//  1. Add a `LEADS_API_KEY` secret in Lovable Cloud (any random string).
//  2. Delete the `// PLACEHOLDER GUARD` block below.
//  3. Hit:
//       GET /api/public/leads
//       Authorization: Bearer <LEADS_API_KEY>
//     Optional query params:
//       ?since=2025-01-01T00:00:00Z   (ISO timestamp)
//       ?limit=100                    (1–500, default 100)
//       ?include_phone=1              (otherwise phone is masked)
import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/public/leads")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // PLACEHOLDER GUARD — remove this block to enable the endpoint.
        if (!process.env.LEADS_API_KEY) {
          return Response.json(
            {
              status: "placeholder",
              message:
                "Leads endpoint is scaffolded but disabled. Add LEADS_API_KEY secret to enable.",
            },
            { status: 501 },
          );
        }

        const auth = request.headers.get("authorization") ?? "";
        const expected = `Bearer ${process.env.LEADS_API_KEY}`;
        if (auth !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }

        const url = new URL(request.url);
        const since = url.searchParams.get("since");
        const limitRaw = Number(url.searchParams.get("limit") ?? "100");
        const limit = Math.min(500, Math.max(1, Number.isFinite(limitRaw) ? limitRaw : 100));
        const includePhone = url.searchParams.get("include_phone") === "1";

        let query = supabaseAdmin
          .from("leads")
          .select(
            "id, created_at, zip, address, lat, lng, phone, soil_grade, soil_payload, property_payload, satellite_url",
          )
          .order("created_at", { ascending: false })
          .limit(limit);

        if (since) {
          const d = new Date(since);
          if (!Number.isNaN(d.getTime())) {
            query = query.gte("created_at", d.toISOString());
          }
        }

        const { data, error } = await query;
        if (error) {
          return Response.json({ error: error.message }, { status: 500 });
        }

        const rows = (data ?? []).map((row) => ({
          ...row,
          phone: includePhone
            ? row.phone
            : row.phone
              ? `***${row.phone.slice(-4)}`
              : null,
        }));

        return Response.json({ count: rows.length, leads: rows });
      },
    },
  },
});
