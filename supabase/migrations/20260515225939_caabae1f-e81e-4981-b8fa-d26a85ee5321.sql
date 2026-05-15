DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
DROP POLICY IF EXISTS "Anyone can update leads" ON public.leads;
-- No public policies = no anon access. All writes go through server functions
-- using the service-role client (supabaseAdmin), which bypasses RLS.