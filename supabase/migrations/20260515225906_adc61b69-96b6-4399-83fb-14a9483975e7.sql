CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  zip TEXT NOT NULL,
  address TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  phone TEXT,
  soil_grade TEXT,
  soil_payload JSONB,
  property_payload JSONB,
  satellite_url TEXT
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a lead (anon insert)
CREATE POLICY "Anyone can insert leads"
  ON public.leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow updating own lead by id (used for phone attach right after insert)
CREATE POLICY "Anyone can update leads"
  ON public.leads FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- No public select; reads happen server-side via service role
CREATE INDEX leads_created_at_idx ON public.leads (created_at DESC);
CREATE INDEX leads_zip_idx ON public.leads (zip);