import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play, Star, Sparkles, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/hero-bg.jpg";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { resolveImageUrl } from "@/lib/assetUrl";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type Service = { id: string; title: string; description: string; image_url: string | null; tier: string; price_label: string };
type Project = { id: string; title: string; category: string; thumbnail_url: string | null; description: string; client: string };
type Review = { id: string; author_name: string; author_role: string; content: string; rating: number };
type Faq = { id: string; question: string; answer: string };

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  useEffect(() => {
    (async () => {
      const [s, p, r, f] = await Promise.all([
        supabase.from("services").select("*").order("sort_order").limit(3),
        supabase.from("projects").select("*").order("sort_order").limit(6),
        supabase.from("reviews").select("*").eq("scope", "global").order("sort_order"),
        supabase.from("faqs").select("*").eq("scope", "global").order("sort_order"),
      ]);
      setServices((s.data ?? []) as Service[]);
      setProjects((p.data ?? []) as Project[]);
      setReviews((r.data ?? []) as Review[]);
      setFaqs((f.data ?? []) as Faq[]);
    })();
  }, []);

  return (
    <div>
      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-end overflow-hidden grain">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 -z-10">
          <img src={heroBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
          <div className="absolute inset-0 bg-aurora opacity-80" />
        </motion.div>

        {/* Floating accents */}
        <div className="absolute top-32 right-20 w-72 h-72 rounded-full bg-magenta/20 blur-3xl animate-drift -z-10" />
        <div className="absolute bottom-40 left-10 w-96 h-96 rounded-full bg-accent/10 blur-3xl animate-drift -z-10" style={{ animationDelay: "-7s" }} />

        <div className="container relative z-10 pb-32 pt-40">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-background/30 backdrop-blur-md mb-8">
              <Sparkles size={14} className="text-accent" />
              <span className="text-xs tracking-[0.3em] uppercase text-foreground/80">A cinematic edit boutique</span>
            </div>
          </Reveal>

          <h1 className="font-display text-6xl md:text-8xl lg:text-[8.5rem] leading-[0.95] max-w-6xl">
            {"Stories,".split("").map((c, i) => (
              <motion.span key={i} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.04, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="inline-block">{c === " " ? "\u00A0" : c}</motion.span>
            ))}
            <br />
            <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.8 }} className="italic text-gradient-gold">cut to feel.</motion.span>
          </h1>

          <Reveal delay={0.9}>
            <p className="mt-8 max-w-xl text-lg text-foreground/75 leading-relaxed">
              EditFlow Studio crafts cinematic edits for creators, brands, and storytellers worldwide. Premium color, motion, and sound — delivered like a boutique.
            </p>
          </Reveal>

          <Reveal delay={1.05}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/services" className="group inline-flex items-center gap-3 px-7 py-4 bg-accent text-accent-foreground rounded-full font-medium shadow-gold hover:scale-[1.02] transition-transform">
                Browse the studio shop
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/projects" className="group inline-flex items-center gap-3 px-7 py-4 border border-foreground/20 rounded-full hover:border-accent/60 transition-colors">
                <Play size={16} /> Watch the reel
              </Link>
            </div>
          </Reveal>
        </div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-foreground/50">
          <ChevronDown />
        </motion.div>
      </section>

      {/* STATS */}
      <section className="border-y border-border/60 bg-card/40">
        <div className="container grid grid-cols-2 md:grid-cols-4 divide-x divide-border/60">
          {[
            { n: "1,200+", l: "Projects delivered" },
            { n: "48hr", l: "Avg turnaround" },
            { n: "30+", l: "Countries served" },
            { n: "4.9/5", l: "Client rating" },
          ].map((s, i) => (
            <Reveal key={s.l} delay={i * 0.08}>
              <div className="px-6 py-12 text-center">
                <div className="font-display text-4xl md:text-5xl text-gradient-gold">{s.n}</div>
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mt-2">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SERVICES preview — shop style */}
      <section className="container py-32">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
          <SectionHeader eyebrow="The Shop" title="Pick a service. Ship the story." subtitle="Each service is a productized edit experience — clear scope, premium delivery, no surprises." />
          <Reveal delay={0.2}>
            <Link to="/services" className="text-sm uppercase tracking-[0.3em] text-accent hover:text-accent/80 inline-flex items-center gap-2">
              Full catalog <ArrowRight size={14} />
            </Link>
          </Reveal>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((svc, i) => (
            <Reveal key={svc.id} delay={i * 0.1}>
              <Link to="/services" className="group block bg-card border border-border rounded-2xl overflow-hidden hover:border-accent/60 transition-all hover:-translate-y-1 shadow-elegant">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img src={resolveImageUrl(svc.image_url)} alt={svc.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-background/80 backdrop-blur-md text-[10px] uppercase tracking-[0.2em] text-accent border border-accent/30">{svc.tier}</div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl mb-2">{svc.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{svc.description}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-accent text-sm">{svc.price_label}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-foreground/70 group-hover:text-accent transition-colors">Add to project <ArrowRight size={12} /></span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PROJECTS strip */}
      <section className="container py-20">
        <SectionHeader eyebrow="Selected Work" title="Recent cuts from the floor." />
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {projects.slice(0, 6).map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.08}>
              <Link to="/projects" className="group block relative overflow-hidden rounded-2xl aspect-video">
                <img src={resolveImageUrl(p.thumbnail_url)} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-accent">{p.category}</div>
                  <div className="font-display text-xl mt-1">{p.title}</div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-60 -z-10" />
        <div className="container">
          <SectionHeader align="center" eyebrow="Loved by clients" title="Words from the cutting room floor." />
          <div className="mt-16 grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {reviews.map((r, i) => (
              <Reveal key={r.id} delay={i * 0.08}>
                <div className="p-8 rounded-2xl bg-card/80 backdrop-blur-md border border-border h-full">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: r.rating }).map((_, k) => (
                      <Star key={k} size={14} className="fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-lg leading-relaxed font-display italic">"{r.content}"</p>
                  <div className="mt-6 pt-6 border-t border-border/60">
                    <div className="font-medium">{r.author_name}</div>
                    <div className="text-xs text-muted-foreground">{r.author_role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="py-12 border-y border-border/60 overflow-hidden">
        <div className="marquee gap-16">
          {[...Array(2)].map((_, dup) => (
            <div key={dup} className="flex items-center gap-16 px-8">
              {["Wanderlight", "Halo Audio", "Northwind", "PulseFit", "Saffron Table", "Aurora Films", "Mira Patel", "BrightWave"].map((b) => (
                <span key={b + dup} className="font-display text-2xl text-foreground/40 hover:text-accent transition-colors whitespace-nowrap">{b}</span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-32 grid md:grid-cols-2 gap-16 items-start">
        <SectionHeader eyebrow="Questions" title="Everything you wanted to ask." subtitle="Still wondering? Drop us a message — we reply within a business day." />
        <Reveal delay={0.15}>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f) => (
              <AccordionItem key={f.id} value={f.id} className="border-border">
                <AccordionTrigger className="font-display text-left text-lg hover:text-accent">{f.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="container pb-32">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-accent/30 p-12 md:p-20 text-center bg-mesh">
            <div className="absolute inset-0 bg-aurora opacity-50 -z-0" />
            <div className="relative z-10">
              <h2 className="font-display text-4xl md:text-6xl">Have footage? <span className="italic text-gradient-gold">Let's cut.</span></h2>
              <p className="mt-5 max-w-xl mx-auto text-muted-foreground">Tell us about your project. We'll come back with a creative direction and a quote within 24 hours.</p>
              <Link to="/contact" className="mt-8 inline-flex items-center gap-3 px-8 py-4 bg-accent text-accent-foreground rounded-full shadow-gold hover:scale-[1.02] transition-transform">
                Start a project <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}