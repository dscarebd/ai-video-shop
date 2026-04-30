
# EditFlowStudio.shop — Cinematic Video Editing Agency

A fully animated, international (English) video editing agency website with a "premium shop" vibe — deep royal blue + gold + magenta accents, smooth cinematic motion, and AI-generated imagery throughout. Includes a hidden admin panel for editing team members without login.

## Visual Direction

- **Style:** Cinematic premium — deep royal blue (#0B1437), rich gold (#D4AF37), magenta accent (#E5326B), cream (#F5F1E8), near-black (#070912)
- **Typography:** Playfair Display (display serif) + Inter (body sans)
- **Motion:** Smooth fade + slide reveals, parallax, animated gradient mesh backgrounds, marquee logo strips, gold shimmer on hover, scroll-triggered scene transitions
- **Vibe:** Boutique studio meets premium online shop — service "cards" feel like products, project cards like showcase items, gold badges, "Add to project" style CTAs

## Pages

### 1. Home
- Hero: animated gradient mesh + cinematic AI-generated reel preview, big serif headline, dual CTA
- Stats strip (projects delivered, hours edited, happy clients)
- Services preview grid (3 cards)
- Featured projects carousel
- Global reviews section (animated testimonial slider)
- Global FAQ accordion
- Brand logos marquee
- CTA banner → Contact

### 2. Services
Service cards laid out like products in a shop (image, title, price-style tier, description, "Book this service" button). Categories: YouTube editing, Wedding films, Reels/Shorts, Color grading, Motion graphics, Corporate.

### 3. Projects
Filterable gallery (All / YouTube / Wedding / Corporate / Shorts). AI-generated thumbnails. Click → lightbox with details.

### 4. Team
- Grid of team member cards (AI-generated portraits, name, role, gold-accented hover)
- Click a card → individual profile page at `/team/<auto-slug-from-name>` showing: photo, role, bio, skills (animated bars), contact (email, phone), per-member reviews, per-member FAQ
- When admin renames a member, the slug auto-updates and the old slug 301-redirects to the new one

### 5. Contact
- Animated contact form (name, email, service, message) → saved to database
- Studio info, email, phone, social links
- Map-style decorative section

## Admin Panel (hidden, no login)

Accessible only via secret URL: `/studio-control-7k2x9m` (unguessable). No link from anywhere on the site.

**Capabilities:**
- Add / edit / delete team members: name, photo, role, skills, phone, email, bio
- Manage per-member reviews (add/edit/delete)
- Manage per-member FAQ (add/edit/delete)
- Manage global reviews and global FAQ
- View contact form submissions
- When a name changes → URL slug auto-regenerates → old slug stored in a redirects table so old links keep working

## Data Model (Lovable Cloud)

- `team_members` — id, name, slug, photo_url, role, bio, email, phone, sort_order
- `team_skills` — id, member_id, skill_name, level (0-100)
- `reviews` — id, scope ('global' | 'member'), member_id (nullable), author_name, author_role, rating, content
- `faqs` — id, scope ('global' | 'member'), member_id (nullable), question, answer, sort_order
- `services` — id, title, description, image_url, tier, price_label, sort_order
- `projects` — id, title, category, thumbnail_url, description
- `contact_submissions` — id, name, email, service, message, created_at
- `slug_redirects` — id, old_slug, new_slug, member_id (auto-populated by DB trigger when team_members.slug changes)

## AI-Generated Assets

Generated upfront with Nano Banana and stored in `public/`:
- 6 cinematic team portraits
- 6 service hero images
- 8 project thumbnails
- Hero reel still + abstract texture/gradient backgrounds

## Technical Notes

- React + Vite + Tailwind + shadcn/ui + React Router
- Lovable Cloud for database + storage (team photos uploaded from admin)
- Framer Motion for page/scene animations
- Slug generation via DB trigger; old slugs preserved in `slug_redirects`; React Router catches old slug → 301-style redirect to new
- Admin route is a single hidden URL — guarded only by URL obscurity per your choice (note: anyone who learns the URL can edit data)

## Security Note (your choice acknowledged)

You chose hidden-URL admin with no password. This means anyone who discovers `/studio-control-7k2x9m` can edit/delete all content. This will be flagged in security scans. You can add a password later anytime by asking.
