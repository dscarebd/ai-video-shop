
-- Helper: slugify function
CREATE OR REPLACE FUNCTION public.slugify(input text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT trim(both '-' from regexp_replace(lower(coalesce(input, '')), '[^a-z0-9]+', '-', 'g'));
$$;

-- team_members
CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  photo_url text,
  role text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- team_skills
CREATE TABLE public.team_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  skill_name text NOT NULL,
  level int NOT NULL DEFAULT 80 CHECK (level >= 0 AND level <= 100),
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- reviews
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope text NOT NULL DEFAULT 'global' CHECK (scope IN ('global','member')),
  member_id uuid REFERENCES public.team_members(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  author_role text NOT NULL DEFAULT '',
  rating int NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  content text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- faqs
CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope text NOT NULL DEFAULT 'global' CHECK (scope IN ('global','member')),
  member_id uuid REFERENCES public.team_members(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- services
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text,
  tier text NOT NULL DEFAULT 'Standard',
  price_label text NOT NULL DEFAULT '',
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- projects
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'YouTube',
  thumbnail_url text,
  description text NOT NULL DEFAULT '',
  client text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- contact_submissions
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  service text NOT NULL DEFAULT '',
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- slug_redirects
CREATE TABLE public.slug_redirects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  old_slug text NOT NULL UNIQUE,
  new_slug text NOT NULL,
  member_id uuid REFERENCES public.team_members(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Trigger: auto-populate slug from name on insert/update; preserve old slug
CREATE OR REPLACE FUNCTION public.handle_team_member_slug()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_slug text;
  candidate text;
  counter int := 1;
BEGIN
  base_slug := public.slugify(NEW.name);
  IF base_slug = '' THEN
    base_slug := 'member';
  END IF;

  IF TG_OP = 'INSERT' THEN
    candidate := base_slug;
    WHILE EXISTS (SELECT 1 FROM public.team_members WHERE slug = candidate) LOOP
      counter := counter + 1;
      candidate := base_slug || '-' || counter;
    END LOOP;
    NEW.slug := candidate;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.name IS DISTINCT FROM OLD.name THEN
      candidate := base_slug;
      WHILE EXISTS (SELECT 1 FROM public.team_members WHERE slug = candidate AND id <> NEW.id) LOOP
        counter := counter + 1;
        candidate := base_slug || '-' || counter;
      END LOOP;
      IF candidate <> OLD.slug THEN
        -- store redirect from old slug to new slug
        INSERT INTO public.slug_redirects (old_slug, new_slug, member_id)
        VALUES (OLD.slug, candidate, NEW.id)
        ON CONFLICT (old_slug) DO UPDATE SET new_slug = EXCLUDED.new_slug;
        -- update any existing redirects pointing to the old slug to point to the new one
        UPDATE public.slug_redirects SET new_slug = candidate WHERE new_slug = OLD.slug;
        NEW.slug := candidate;
      END IF;
    END IF;
    NEW.updated_at := now();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_team_members_slug
BEFORE INSERT OR UPDATE ON public.team_members
FOR EACH ROW EXECUTE FUNCTION public.handle_team_member_slug();

-- RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slug_redirects ENABLE ROW LEVEL SECURITY;

-- Public read for site content
CREATE POLICY "Public read team_members" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Public read team_skills" ON public.team_skills FOR SELECT USING (true);
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Public read faqs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Public read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public read slug_redirects" ON public.slug_redirects FOR SELECT USING (true);

-- Public write (admin is URL-gated only, per user choice)
CREATE POLICY "Public write team_members ins" ON public.team_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Public write team_members upd" ON public.team_members FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public write team_members del" ON public.team_members FOR DELETE USING (true);

CREATE POLICY "Public write team_skills ins" ON public.team_skills FOR INSERT WITH CHECK (true);
CREATE POLICY "Public write team_skills upd" ON public.team_skills FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public write team_skills del" ON public.team_skills FOR DELETE USING (true);

CREATE POLICY "Public write reviews ins" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public write reviews upd" ON public.reviews FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public write reviews del" ON public.reviews FOR DELETE USING (true);

CREATE POLICY "Public write faqs ins" ON public.faqs FOR INSERT WITH CHECK (true);
CREATE POLICY "Public write faqs upd" ON public.faqs FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public write faqs del" ON public.faqs FOR DELETE USING (true);

CREATE POLICY "Public write services ins" ON public.services FOR INSERT WITH CHECK (true);
CREATE POLICY "Public write services upd" ON public.services FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public write services del" ON public.services FOR DELETE USING (true);

CREATE POLICY "Public write projects ins" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Public write projects upd" ON public.projects FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public write projects del" ON public.projects FOR DELETE USING (true);

-- contact_submissions: anyone can insert; reads/updates/deletes also open (admin URL gate)
CREATE POLICY "Anyone submit contact" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read contact" ON public.contact_submissions FOR SELECT USING (true);
CREATE POLICY "Public delete contact" ON public.contact_submissions FOR DELETE USING (true);
