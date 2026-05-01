import { Reveal } from "@/components/site/Reveal";

export default function Privacy() {
  return (
    <section className="container py-32 max-w-3xl">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">Legal</p>
        <h1 className="font-display text-5xl md:text-6xl mb-8">Privacy Policy</h1>
      </Reveal>

      <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
        <Reveal>
          <p className="text-sm">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        </Reveal>

        <Reveal>
          <h2 className="font-display text-2xl text-foreground mt-10 mb-3">1. Introduction</h2>
          <p>
            EditFlow Studio ("we", "us", "our") respects your privacy. This Privacy Policy explains
            how we collect, use, and protect information when you visit editflowstudio.shop or
            engage our services.
          </p>
        </Reveal>

        <Reveal>
          <h2 className="font-display text-2xl text-foreground mt-10 mb-3">2. Information We Collect</h2>
          <p>
            When you submit our contact form, we collect your name, email address, the service
            you're interested in, and any message you provide. We may also collect basic technical
            information such as browser type and pages visited via standard analytics.
          </p>
        </Reveal>

        <Reveal>
          <h2 className="font-display text-2xl text-foreground mt-10 mb-3">3. How We Use Your Information</h2>
          <p>
            We use the information you share to respond to inquiries, deliver requested services,
            improve our website, and communicate updates about projects you've engaged us for. We
            do not sell your personal data.
          </p>
        </Reveal>

        <Reveal>
          <h2 className="font-display text-2xl text-foreground mt-10 mb-3">4. Data Storage & Security</h2>
          <p>
            Your data is stored on secure cloud infrastructure with industry-standard encryption.
            Access is restricted to authorized team members who need it to serve you.
          </p>
        </Reveal>

        <Reveal>
          <h2 className="font-display text-2xl text-foreground mt-10 mb-3">5. Cookies</h2>
          <p>
            We use minimal cookies necessary for site functionality and anonymous analytics. You
            can disable cookies in your browser at any time.
          </p>
        </Reveal>

        <Reveal>
          <h2 className="font-display text-2xl text-foreground mt-10 mb-3">6. Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of your personal data at any
            time by emailing us. We'll respond within a reasonable timeframe.
          </p>
        </Reveal>

        <Reveal>
          <h2 className="font-display text-2xl text-foreground mt-10 mb-3">7. Third-Party Services</h2>
          <p>
            We may use trusted third-party tools (hosting, analytics, email delivery). These
            providers are bound by their own privacy policies and only process data necessary to
            provide their service.
          </p>
        </Reveal>

        <Reveal>
          <h2 className="font-display text-2xl text-foreground mt-10 mb-3">8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy occasionally. The "Last updated" date above reflects
            the most recent revision.
          </p>
        </Reveal>

        <Reveal>
          <h2 className="font-display text-2xl text-foreground mt-10 mb-3">9. Contact</h2>
          <p>
            For privacy questions, reach out at{" "}
            <a href="mailto:hello@editflowstudio.shop" className="text-accent hover:underline">
              hello@editflowstudio.shop
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}