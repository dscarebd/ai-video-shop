import { useEffect, useState } from "react";
import { z } from "zod";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Valid email required").max(200),
  service: z.string().trim().max(100),
  message: z.string().trim().min(5, "Tell us a bit more").max(2000),
});

type Service = { id: string; title: string };

export default function Contact() {
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.from("services").select("id,title").order("sort_order").then(({ data }) => setServices((data ?? []) as Service[]));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("contact_submissions").insert([parsed.data]);
    setSubmitting(false);
    if (error) { toast.error("Could not send. Try again."); return; }
    toast.success("Message received. We'll reply within a business day.");
    setForm({ name: "", email: "", service: "", message: "" });
  }

  return (
    <div className="pt-32 pb-32">
      <section className="container">
        <SectionHeader align="center" eyebrow="Say hello" title="Let's make something cinematic." subtitle="Share what you're building. We typically respond within a business day." />
      </section>

      <section className="container mt-20 grid lg:grid-cols-[5fr_7fr] gap-12">
        <Reveal>
          <div className="space-y-6">
            <div className="p-6 bg-card border border-border rounded-2xl">
              <Mail className="text-accent mb-3" />
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Email</div>
              <a href="mailto:hello@editflowstudio.shop" className="font-display text-xl hover:text-accent">hello@editflowstudio.shop</a>
            </div>
            <div className="p-6 bg-card border border-border rounded-2xl">
              <Phone className="text-accent mb-3" />
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Phone</div>
              <a href="tel:+14155550100" className="font-display text-xl hover:text-accent">+1 (415) 555-0100</a>
            </div>
            <div className="p-6 bg-card border border-border rounded-2xl">
              <MapPin className="text-accent mb-3" />
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Studio</div>
              <div className="font-display text-xl">Worldwide · Remote-first</div>
              <div className="text-sm text-muted-foreground mt-1">Hubs in Lisbon · NYC · Tokyo</div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={onSubmit} className="bg-card border border-border rounded-3xl p-8 md:p-10 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Your name">
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="form-input" placeholder="Jane Cooper" />
              </Field>
              <Field label="Email">
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="form-input" placeholder="jane@brand.com" />
              </Field>
            </div>
            <Field label="Service of interest">
              <select value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} className="form-input">
                <option value="">Choose a service…</option>
                {services.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                <option value="Other">Something else</option>
              </select>
            </Field>
            <Field label="Tell us about your project">
              <textarea rows={6} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="form-input resize-none" placeholder="Footage, deadlines, vibes…" />
            </Field>
            <button disabled={submitting} className="inline-flex items-center gap-3 px-7 py-4 bg-accent text-accent-foreground rounded-full shadow-gold disabled:opacity-60 hover:scale-[1.01] transition-transform">
              {submitting ? "Sending…" : "Send message"} <Send size={16} />
            </button>
          </form>
        </Reveal>
      </section>

      <style>{`
        .form-input {
          width: 100%;
          background: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          border-radius: 0.75rem;
          padding: 0.85rem 1rem;
          color: hsl(var(--foreground));
          font-size: 0.95rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .form-input:focus { outline: none; border-color: hsl(var(--accent)); box-shadow: 0 0 0 3px hsl(var(--accent) / 0.15); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">{label}</div>
      {children}
    </label>
  );
}