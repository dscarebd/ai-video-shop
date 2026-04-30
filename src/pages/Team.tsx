import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { resolveImageUrl } from "@/lib/assetUrl";

type Member = { id: string; name: string; slug: string; photo_url: string | null; role: string };

export default function Team() {
  const [items, setItems] = useState<Member[]>([]);
  useEffect(() => {
    supabase.from("team_members").select("id,name,slug,photo_url,role").order("sort_order").then(({ data }) => setItems((data ?? []) as Member[]));
  }, []);

  return (
    <div className="pt-32 pb-32">
      <section className="container">
        <SectionHeader align="center" eyebrow="The Studio" title="The people behind every cut." subtitle="A small, sharp team of editors, colorists, designers, and sound engineers — obsessed with craft." />
      </section>

      <section className="container mt-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((m, i) => (
            <Reveal key={m.id} delay={(i % 3) * 0.08}>
              <Link to={`/team/${m.slug}`} className="group block bg-card border border-border rounded-2xl overflow-hidden hover:border-accent/60 transition-all shadow-elegant relative">
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img src={resolveImageUrl(m.photo_url)} alt={m.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/70 backdrop-blur-md flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    <ArrowUpRight size={16} />
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-accent">{m.role}</div>
                  <h3 className="font-display text-2xl mt-2 group-hover:text-accent transition-colors">{m.name}</h3>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}