// PLACEHOLDER: OpenClaw / external stats endpoint.
// Same activation steps as /api/public/leads — set LEADS_API_KEY and delete
// the PLACEHOLDER GUARD block below.
import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/public/stats")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // PLACEHOLDER GUARD — remove this block to enable the endpoint.
        if (!process.env.LEADS_API_KEY) {
          return Response.json(
            {
              status: "placeholder",
              message:
                "Stats endpoint is scaffolded but disabled. Add LEADS_API_KEY secret to enable.",
            },
            { status: 501 },
          );
        }

        const auth = request.headers.get("authorization") ?? "";
        const expected = `Bearer ${process.env.LEADS_API_KEY}`;
        if (auth !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { data, error } = await supabaseAdmin
          .from("leads")
          .select("zip, soil_grade, phone, created_at")
          .limit(5000);
        if (error) {
          return Response.json({ error: error.message }, { status: 500 });
        }

        const rows = data ?? [];
        const total = rows.length;
        const withPhone = rows.filter((r) => !!r.phone).length;
        const last7 = rows.filter(
          (r) => Date.now() - new Date(r.created_at).getTime() < 7 * 86400_000,
        ).length;

        const byGrade: Record<string, number> = {};
        for (const r of rows) {
          const g = r.soil_grade ?? "?";
          byGrade[g] = (byGrade[g] ?? 0) + 1;
        }

        const byZip: Record<string, number> = {};
        for (const r of rows) byZip[r.zip] = (byZip[r.zip] ?? 0) + 1;
        const topZips = Object.entries(byZip)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([zip, count]) => ({ zip, count }));

        return Response.json({
          total,
          last7,
          withPhone,
          conversionRate: total > 0 ? Math.round((withPhone / total) * 100) / 100 : 0,
          byGrade,
          topZips,
        });
      },
    },
  },
});
