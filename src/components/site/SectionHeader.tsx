import { Reveal } from "./Reveal";

export function SectionHeader({
  eyebrow, title, subtitle, align = "left",
}: { eyebrow?: string; title: string; subtitle?: string; align?: "left" | "center" }) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <Reveal>
          <div className="text-xs uppercase tracking-[0.4em] text-accent mb-4">{eyebrow}</div>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className="font-display text-4xl md:text-6xl leading-[1.05]">{title}</h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.12}>
          <p className="mt-5 text-muted-foreground text-base md:text-lg leading-relaxed">{subtitle}</p>
        </Reveal>
      )}
    </div>
  );
}