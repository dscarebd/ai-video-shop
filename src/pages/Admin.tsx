import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Plus, Save } from "lucide-react";

type Member = { id: string; name: string; slug: string; photo_url: string | null; role: string; bio: string; email: string; phone: string; address: string; sort_order: number };
type Skill = { id: string; member_id: string; skill_name: string; level: number };
type Review = { id: string; scope: string; member_id: string | null; author_name: string; author_role: string; rating: number; content: string };
type Faq = { id: string; scope: string; member_id: string | null; question: string; answer: string };
type Submission = { id: string; name: string; email: string; service: string; message: string; created_at: string };

const tabs = ["Team", "Reviews", "FAQ", "Inbox"] as const;
type Tab = typeof tabs[number];

export default function Admin() {
  const [tab, setTab] = useState<Tab>("Team");
  return (
    <div className="min-h-screen bg-background text-foreground pt-10 pb-20">
      <div className="container">
        <div className="flex items-baseline justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.4em] text-accent">Studio Control</div>
            <h1 className="font-display text-4xl mt-2">Admin Panel</h1>
            <p className="text-sm text-muted-foreground mt-1">Hidden URL only · share carefully</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-full text-sm border ${tab === t ? "bg-accent text-accent-foreground border-accent" : "border-border hover:border-accent/50"}`}>{t}</button>
            ))}
          </div>
        </div>

        <div className="mt-10">
          {tab === "Team" && <TeamAdmin />}
          {tab === "Reviews" && <ReviewsAdmin />}
          {tab === "FAQ" && <FaqsAdmin />}
          {tab === "Inbox" && <InboxAdmin />}
        </div>
      </div>
    </div>
  );
}

function TeamAdmin() {
  const [members, setMembers] = useState<Member[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editing, setEditing] = useState<Partial<Member> | null>(null);

  async function load() {
    const [{ data: m }, { data: s }] = await Promise.all([
      supabase.from("team_members").select("*").order("sort_order"),
      supabase.from("team_skills").select("*").order("sort_order"),
    ]);
    setMembers((m ?? []) as Member[]);
    setSkills((s ?? []) as Skill[]);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing) return;
    if (editing.id) {
      const { id, ...rest } = editing;
      const { error } = await supabase.from("team_members").update(rest as any).eq("id", id!);
      if (error) return toast.error(error.message);
    } else {
      const payload = { name: editing.name ?? "New member", role: editing.role ?? "", bio: editing.bio ?? "", email: editing.email ?? "", phone: editing.phone ?? "", address: editing.address ?? "", photo_url: editing.photo_url ?? null, sort_order: members.length + 1, slug: "tmp" };
      const { error } = await supabase.from("team_members").insert(payload as any);
      if (error) return toast.error(error.message);
    }
    toast.success("Saved");
    setEditing(null); load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this member?")) return;
    const { error } = await supabase.from("team_members").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  }

  async function addSkill(memberId: string) {
    const skill_name = prompt("Skill name?"); if (!skill_name) return;
    const lvl = Number(prompt("Level (0-100)?", "80")) || 80;
    const { error } = await supabase.from("team_skills").insert({ member_id: memberId, skill_name, level: lvl, sort_order: skills.filter(s=>s.member_id===memberId).length+1 } as any);
    if (error) return toast.error(error.message);
    load();
  }
  async function removeSkill(id: string) {
    await supabase.from("team_skills").delete().eq("id", id);
    load();
  }

  return (
    <div className="space-y-6">
      <button onClick={() => setEditing({})} className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-accent-foreground rounded-full"><Plus size={14} /> Add member</button>

      {editing && (
        <div className="p-6 bg-card border border-accent/40 rounded-2xl space-y-3">
          <div className="font-display text-2xl">{editing.id ? "Edit member" : "New member"}</div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Input label="Name (URL auto-updates)" value={editing.name ?? ""} onChange={v => setEditing(e => ({ ...e!, name: v }))} />
            <Input label="Role" value={editing.role ?? ""} onChange={v => setEditing(e => ({ ...e!, role: v }))} />
            <Input label="Email" value={editing.email ?? ""} onChange={v => setEditing(e => ({ ...e!, email: v }))} />
            <Input label="Phone" value={editing.phone ?? ""} onChange={v => setEditing(e => ({ ...e!, phone: v }))} />
            <Input label="Photo URL" value={editing.photo_url ?? ""} onChange={v => setEditing(e => ({ ...e!, photo_url: v }))} />
            <Input label="Sort order" value={String(editing.sort_order ?? 0)} onChange={v => setEditing(e => ({ ...e!, sort_order: Number(v) || 0 }))} />
          </div>
          <Input label="Address" value={editing.address ?? ""} onChange={v => setEditing(e => ({ ...e!, address: v }))} />
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Bio</label>
            <textarea rows={4} value={editing.bio ?? ""} onChange={e => setEditing(x => ({ ...x!, bio: e.target.value }))} className="w-full mt-2 bg-background border border-border rounded-xl p-3" />
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-accent-foreground rounded-full"><Save size={14} /> Save</button>
            <button onClick={() => setEditing(null)} className="px-5 py-2.5 border border-border rounded-full">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        {members.map(m => {
          const ms = skills.filter(s => s.member_id === m.id);
          return (
            <div key={m.id} className="p-5 bg-card border border-border rounded-2xl">
              <div className="flex items-start gap-4">
                {m.photo_url && <img src={m.photo_url.startsWith('/src/')?'':m.photo_url} alt="" className="w-16 h-16 rounded-xl object-cover bg-muted" />}
                <div className="flex-1">
                  <div className="font-display text-xl">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.role}</div>
                  <div className="text-xs text-accent mt-1">/team/{m.slug}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(m)} className="text-xs px-3 py-1.5 border border-border rounded-full">Edit</button>
                  <button onClick={() => remove(m.id)} className="text-xs px-3 py-1.5 border border-destructive/40 text-destructive rounded-full"><Trash2 size={12} /></button>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2 flex items-center justify-between">
                  Skills
                  <button onClick={() => addSkill(m.id)} className="text-accent normal-case tracking-normal">+ Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ms.map(s => (
                    <span key={s.id} className="inline-flex items-center gap-2 px-3 py-1 bg-background border border-border rounded-full text-xs">
                      {s.skill_name} · {s.level}%
                      <button onClick={() => removeSkill(s.id)} className="text-destructive">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReviewsAdmin() {
  const [items, setItems] = useState<Review[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [draft, setDraft] = useState<Partial<Review>>({ scope: "global", rating: 5, author_name: "", author_role: "", content: "", member_id: null });

  async function load() {
    const [{ data: r }, { data: m }] = await Promise.all([
      supabase.from("reviews").select("*").order("created_at", { ascending: false }),
      supabase.from("team_members").select("*").order("sort_order"),
    ]);
    setItems((r ?? []) as Review[]);
    setMembers((m ?? []) as Member[]);
  }
  useEffect(() => { load(); }, []);

  async function add() {
    if (!draft.author_name || !draft.content) return toast.error("Author and content required");
    const payload: any = { scope: draft.scope, member_id: draft.scope === "member" ? draft.member_id : null, author_name: draft.author_name, author_role: draft.author_role ?? "", rating: draft.rating ?? 5, content: draft.content };
    const { error } = await supabase.from("reviews").insert(payload);
    if (error) return toast.error(error.message);
    setDraft({ scope: "global", rating: 5, author_name: "", author_role: "", content: "", member_id: null });
    load();
  }
  async function remove(id: string) { await supabase.from("reviews").delete().eq("id", id); load(); }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-card border border-border rounded-2xl space-y-3">
        <div className="font-display text-2xl">Add a review</div>
        <div className="grid sm:grid-cols-3 gap-3">
          <select className="bg-background border border-border rounded-xl p-3" value={draft.scope} onChange={e => setDraft(d => ({ ...d, scope: e.target.value }))}>
            <option value="global">Global (site-wide)</option>
            <option value="member">Per team member</option>
          </select>
          {draft.scope === "member" && (
            <select className="bg-background border border-border rounded-xl p-3" value={draft.member_id ?? ""} onChange={e => setDraft(d => ({ ...d, member_id: e.target.value }))}>
              <option value="">Choose member…</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          )}
          <select className="bg-background border border-border rounded-xl p-3" value={draft.rating} onChange={e => setDraft(d => ({ ...d, rating: Number(e.target.value) }))}>
            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ★</option>)}
          </select>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Input label="Author name" value={draft.author_name ?? ""} onChange={v => setDraft(d => ({ ...d, author_name: v }))} />
          <Input label="Author role" value={draft.author_role ?? ""} onChange={v => setDraft(d => ({ ...d, author_role: v }))} />
        </div>
        <textarea rows={3} placeholder="Review content" value={draft.content ?? ""} onChange={e => setDraft(d => ({ ...d, content: e.target.value }))} className="w-full bg-background border border-border rounded-xl p-3" />
        <button onClick={add} className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-accent-foreground rounded-full"><Plus size={14} /> Add review</button>
      </div>

      <div className="space-y-3">
        {items.map(r => (
          <div key={r.id} className="p-5 bg-card border border-border rounded-2xl flex items-start gap-4">
            <div className="flex-1">
              <div className="text-xs text-accent uppercase tracking-[0.3em]">{r.scope === "global" ? "Global" : members.find(m=>m.id===r.member_id)?.name ?? "Member"} · {r.rating}★</div>
              <div className="font-display text-lg mt-1">{r.author_name} <span className="text-xs text-muted-foreground">— {r.author_role}</span></div>
              <p className="text-sm text-muted-foreground mt-1">{r.content}</p>
            </div>
            <button onClick={() => remove(r.id)} className="text-xs px-3 py-1.5 border border-destructive/40 text-destructive rounded-full"><Trash2 size={12} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function FaqsAdmin() {
  const [items, setItems] = useState<Faq[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [draft, setDraft] = useState<Partial<Faq>>({ scope: "global", question: "", answer: "", member_id: null });

  async function load() {
    const [{ data: f }, { data: m }] = await Promise.all([
      supabase.from("faqs").select("*").order("sort_order"),
      supabase.from("team_members").select("*").order("sort_order"),
    ]);
    setItems((f ?? []) as Faq[]); setMembers((m ?? []) as Member[]);
  }
  useEffect(() => { load(); }, []);

  async function add() {
    if (!draft.question || !draft.answer) return toast.error("Question and answer required");
    const payload: any = { scope: draft.scope, member_id: draft.scope === "member" ? draft.member_id : null, question: draft.question, answer: draft.answer, sort_order: items.length + 1 };
    const { error } = await supabase.from("faqs").insert(payload);
    if (error) return toast.error(error.message);
    setDraft({ scope: "global", question: "", answer: "", member_id: null }); load();
  }
  async function remove(id: string) { await supabase.from("faqs").delete().eq("id", id); load(); }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-card border border-border rounded-2xl space-y-3">
        <div className="font-display text-2xl">Add a FAQ</div>
        <div className="grid sm:grid-cols-2 gap-3">
          <select className="bg-background border border-border rounded-xl p-3" value={draft.scope} onChange={e => setDraft(d => ({ ...d, scope: e.target.value }))}>
            <option value="global">Global (site-wide)</option>
            <option value="member">Per team member</option>
          </select>
          {draft.scope === "member" && (
            <select className="bg-background border border-border rounded-xl p-3" value={draft.member_id ?? ""} onChange={e => setDraft(d => ({ ...d, member_id: e.target.value }))}>
              <option value="">Choose member…</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          )}
        </div>
        <Input label="Question" value={draft.question ?? ""} onChange={v => setDraft(d => ({ ...d, question: v }))} />
        <textarea rows={3} placeholder="Answer" value={draft.answer ?? ""} onChange={e => setDraft(d => ({ ...d, answer: e.target.value }))} className="w-full bg-background border border-border rounded-xl p-3" />
        <button onClick={add} className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-accent-foreground rounded-full"><Plus size={14} /> Add FAQ</button>
      </div>
      <div className="space-y-3">
        {items.map(f => (
          <div key={f.id} className="p-5 bg-card border border-border rounded-2xl flex items-start gap-4">
            <div className="flex-1">
              <div className="text-xs text-accent uppercase tracking-[0.3em]">{f.scope === "global" ? "Global" : members.find(m=>m.id===f.member_id)?.name ?? "Member"}</div>
              <div className="font-display text-lg mt-1">{f.question}</div>
              <p className="text-sm text-muted-foreground mt-1">{f.answer}</p>
            </div>
            <button onClick={() => remove(f.id)} className="text-xs px-3 py-1.5 border border-destructive/40 text-destructive rounded-full"><Trash2 size={12} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function InboxAdmin() {
  const [items, setItems] = useState<Submission[]>([]);
  async function load() {
    const { data } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
    setItems((data ?? []) as Submission[]);
  }
  useEffect(() => { load(); }, []);
  async function remove(id: string) { await supabase.from("contact_submissions").delete().eq("id", id); load(); }

  if (items.length === 0) return <div className="text-muted-foreground">No messages yet.</div>;

  return (
    <div className="space-y-3">
      {items.map(s => (
        <div key={s.id} className="p-5 bg-card border border-border rounded-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-display text-lg">{s.name} <span className="text-xs text-muted-foreground">— {s.email}</span></div>
              <div className="text-xs text-accent mt-1">{s.service || "No service selected"} · {new Date(s.created_at).toLocaleString()}</div>
              <p className="mt-3 text-sm">{s.message}</p>
            </div>
            <button onClick={() => remove(s.id)} className="text-xs px-3 py-1.5 border border-destructive/40 text-destructive rounded-full"><Trash2 size={12} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">{label}</div>
      <input value={value} onChange={e => onChange(e.target.value)} className="w-full bg-background border border-border rounded-xl p-3 text-sm" />
    </label>
  );
}