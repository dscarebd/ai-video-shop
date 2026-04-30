import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { resolveImageUrl } from "@/lib/assetUrl";

type Project = { id: string; title: string; category: string; thumbnail_url: string | null; description: string; client: string };

export default function Projects() {
  const [items, setItems] = useState<Project[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [open, setOpen] = useState<Project | null>(null);

  useEffect(() => {
    supabase.from("projects").select("*").order("sort_order").then(({ data }) => setItems((data ?? []) as Project[]));
  }, []);

  const cats = useMemo(() => ["All", ...Array.from(new Set(items.map(i => i.category)))], [items]);
  const filtered = filter === "All" ? items : items.filter(i => i.category === filter);

  return (
    <div className="pt-32 pb-32">
      <section className="container">
        <SectionHeader align="center" eyebrow="Selected Work" title="Cuts from across the world." subtitle="Editorial, brand, wedding, and creator work — handpicked from our archive." />
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {cats.map(c => (
            <button key={c} onClick={() => setFilter(c)} className={`px-5 py-2 rounded-full text-sm transition-all border ${filter === c ? "bg-accent text-accent-foreground border-accent" : "border-border text-muted-foreground hover:text-foreground hover:border-accent/40"}`}>{c}</button>
          ))}
        </div>
      </section>

      <section className="container mt-12">
        <div className="grid md:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.button
                layout
                key={p.id}
                onClick={() => setOpen(p)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
                className="group text-left relative overflow-hidden rounded-2xl aspect-video bg-card"
              >
                <img src={resolveImageUrl(p.thumbnail_url)} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-accent">{p.category}</div>
                  <div className="font-display text-xl mt-1">{p.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{p.client}</div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </section>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)} className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="max-w-4xl w-full bg-card border border-border rounded-3xl overflow-hidden">
              <div className="aspect-video relative">
                <img src={resolveImageUrl(open.thumbnail_url)} alt={open.title} className="w-full h-full object-cover" />
                <button onClick={() => setOpen(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"><X size={18} /></button>
              </div>
              <div className="p-8">
                <div className="text-[10px] uppercase tracking-[0.3em] text-accent">{open.category}</div>
                <h3 className="font-display text-3xl mt-2">{open.title}</h3>
                <div className="text-sm text-muted-foreground mt-1">For {open.client}</div>
                <p className="mt-5 text-foreground/80 leading-relaxed">{open.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}