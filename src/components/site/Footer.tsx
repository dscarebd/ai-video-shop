import { Link } from "react-router-dom";
import { Instagram, Youtube, Mail, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-border/60 mt-32 bg-mesh">
      <div className="container py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2 max-w-md">
          <div className="font-display text-3xl mb-3">EditFlow<span className="text-accent">.</span>Studio</div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            A boutique cinematic studio for creators and brands who care about every frame.
          </p>
          <div className="flex items-center gap-3 mt-6">
            {[Instagram, Youtube, Twitter, Mail].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-colors">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-accent mb-4">Studio</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/services" className="hover:text-foreground">Services</Link></li>
            <li><Link to="/projects" className="hover:text-foreground">Projects</Link></li>
            <li><Link to="/team" className="hover:text-foreground">Team</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-accent mb-4">Reach us</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>hello@editflowstudio.shop</li>
            <li>+1 (415) 555-0100</li>
            <li>Worldwide · Remote-first</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} EditFlow Studio. All rights reserved.</div>
          <div>editflowstudio.shop · Crafted with care</div>
        </div>
      </div>
    </footer>
  );
}