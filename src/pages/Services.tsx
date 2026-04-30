import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { resolveImageUrl } from "@/lib/assetUrl";

type Service = {
  id: string; title: string; description: string; image_url: string | null;
  tier: string; price_label: string; features: string[];
};

export default function Services() {
  const [items, setItems] = useState<Service[]>([]);
  useEffect(() => {
    supabase.from("services").select("*").order("sort_order").then(({ data }) => {
      setItems((data ?? []).map((d: any) => ({ ...d, features: Array.isArray(d.features) ? d.features : [] })));
    });
  }, []);

  return (
    <div className="pt-32 pb-32">
      <section className="container">
        <SectionHeader align="center" eyebrow="The Studio Shop" title="Productized edits, premium delivery." subtitle="Every service is a tight, scoped product. Pick what fits, we do the rest." />
      </section>

      <section className="container mt-20 grid md:grid-cols-2 gap-8">
        {items.map((svc, i) => (
          <Reveal key={svc.id} delay={(i % 2) * 0.1}>
            <article className="group bg-card border border-border rounded-3xl overflow-hidden hover:border-accent/50 transition-all shadow-elegant">
              <div className="aspect-[16/9] overflow-hidden relative">
                <img src={resolveImageUrl(svc.image_url)} alt={svc.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur-md text-[10px] uppercase tracking-[0.3em] text-accent border border-accent/30">{svc.tier}</div>
              </div>
              <div className="p-8">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-3xl">{svc.title}</h3>
                  <span className="text-accent whitespace-nowrap">{svc.price_label}</span>
                </div>
                <p className="mt-3 text-muted-foreground">{svc.description}</p>
                <ul className="mt-6 space-y-2">
                  {svc.features.map((f, k) => (
                    <li key={k} className="flex items-center gap-3 text-sm">
                      <span className="w-5 h-5 rounded-full bg-accent/15 text-accent flex items-center justify-center"><Check size={12} /></span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full border border-accent/40 hover:bg-accent hover:text-accent-foreground transition-colors">
                  Book this service <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </section>
    </div>
  );
}