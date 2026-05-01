import { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Phone, Star, ArrowLeft, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Reveal } from "@/components/site/Reveal";
import { resolveImageUrl } from "@/lib/assetUrl";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type Member = { id: string; name: string; slug: string; photo_url: string | null; role: string; bio: string; email: string; phone: string; address: string };
type Skill = { id: string; skill_name: string; level: number };
type Review = { id: string; author_name: string; author_role: string; content: string; rating: number };
type Faq = { id: string; question: string; answer: string };

export default function TeamMember() {
  const { slug } = useParams<{ slug: string }>();
  const [member, setMember] = useState<Member | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    (async () => {
      const { data: m } = await supabase.from("team_members").select("*").eq("slug", slug).maybeSingle();
      if (!m) {
        // Check redirects
        const { data: red } = await supabase.from("slug_redirects").select("new_slug").eq("old_slug", slug).maybeSingle();
        if (red?.new_slug) { setRedirectTo(red.new_slug); return; }
        setMember(null); setLoading(false); return;
      }
      setMember(m as Member);
      const [{ data: sk }, { data: rv }, { data: fq }] = await Promise.all([
        supabase.from("team_skills").select("*").eq("member_id", m.id).order("sort_order"),
        supabase.from("reviews").select("*").eq("scope", "member").eq("member_id", m.id).order("sort_order"),
        supabase.from("faqs").select("*").eq("scope", "member").eq("member_id", m.id).order("sort_order"),
      ]);
      setSkills((sk ?? []) as Skill[]);
      setReviews((rv ?? []) as Review[]);
      setFaqs((fq ?? []) as Faq[]);
      setLoading(false);
    })();
  }, [slug]);

  if (redirectTo) return <Navigate to={`/team/${redirectTo}`} replace />;
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  if (!member) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="font-display text-4xl">Member not found</h1>
      <Link to="/team" className="text-accent">Back to team</Link>
    </div>
  );

  return (
    <div className="pt-32 pb-32">
      <section className="container">
        <Link to="/team" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent"><ArrowLeft size={14} /> All team</Link>
        <div className="mt-10 grid lg:grid-cols-[5fr_7fr] gap-12 items-start">
          <Reveal>
            <div className="relative">
              <div className="absolute -inset-4 bg-aurora opacity-60 blur-2xl -z-10 rounded-3xl" />
              <img src={resolveImageUrl(member.photo_url)} alt={member.name} className="w-full rounded-3xl object-cover aspect-[4/5] border border-border shadow-royal" />
            </div>
          </Reveal>
          <div>
            <Reveal>
              <div className="text-xs uppercase tracking-[0.4em] text-accent">{member.role}</div>
              <h1 className="font-display text-5xl md:text-7xl mt-3">{member.name}</h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">{member.bio}</p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-8 grid sm:grid-cols-2 gap-3">
                {member.email && (
                  <a href={`mailto:${member.email}`} className="group flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-accent/50 transition-colors">
                    <Mail size={16} className="text-accent" />
                    <span className="text-sm">{member.email}</span>
                  </a>
                )}
                {member.phone && (
                  <a href={`tel:${member.phone}`} className="group flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-accent/50 transition-colors">
                    <Phone size={16} className="text-accent" />
                    <span className="text-sm">{member.phone}</span>
                  </a>
                )}
                {member.address && (
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(member.address)}`} target="_blank" rel="noreferrer" className="group flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-accent/50 transition-colors sm:col-span-2">
                    <MapPin size={16} className="text-accent shrink-0" />
                    <span className="text-sm">{member.address}</span>
                  </a>
                )}
              </div>
            </Reveal>

          </div>
        </div>

        {skills.length > 0 && (
          <Reveal delay={0.25}>
            <div className="mt-20 w-full">
              <h3 className="text-xs uppercase tracking-[0.3em] text-accent mb-8">Craft</h3>
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                {skills.map((s, i) => (
                  <div key={s.id}>
                    <div className="flex justify-between text-sm mb-2"><span>{s.skill_name}</span><span className="text-muted-foreground">{s.level}%</span></div>
                    <div className="h-1.5 rounded-full bg-border overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${s.level}%` }} viewport={{ once: true }} transition={{ duration: 1.2, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }} className="h-full bg-gradient-to-r from-accent to-magenta" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </section>

      {reviews.length > 0 && (
        <section className="container mt-32">
          <h2 className="font-display text-3xl md:text-4xl mb-10">What clients say about {member.name.split(" ")[0]}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {reviews.slice(0, 2).map((r, i) => (
              <Reveal key={r.id} delay={i * 0.08}>
                <div className="p-8 bg-card border border-border rounded-2xl h-full">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: r.rating }).map((_, k) => <Star key={k} size={14} className="fill-accent text-accent" />)}
                  </div>
                  <p className="font-display italic text-lg leading-relaxed">"{r.content}"</p>
                  <div className="mt-5 pt-5 border-t border-border/60 text-sm">
                    <div>{member.name}</div>
                    <div className="text-muted-foreground text-xs">{member.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="container mt-32 max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl mb-10">FAQ</h2>
          <Accordion type="single" collapsible>
            {faqs.map(f => (
              <AccordionItem key={f.id} value={f.id} className="border-border">
                <AccordionTrigger className="font-display text-left text-lg hover:text-accent">{f.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}
    </div>
  );
}