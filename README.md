# Abhyankar Sharma, personal website

A premium, minimal, cinematic portfolio. Dark mode, real WebGL depth in the hero
(floating glass panels with mouse parallax), animated counters, magnetic buttons,
blur reveal animations, and a bento project grid. Built with React, Vite and Three.js.

## Structure
- `src/App.jsx` all content and page sections
- `src/scene.js` the Three.js floating glass hero scene
- `src/index.css` the full design system
- `public/` headshot, certificate, favicon, resume PDF

## Run locally
Requires Node.js 18 or newer.

```bash
npm install
npm run dev      # http://localhost:5173
```

## Deploy to Vercel (free)
1. Push this folder to a new GitHub repo, or drag the folder into Vercel.
2. vercel.com, Add New Project, import the repo.
3. Vercel auto-detects Vite. Click Deploy.

## Point abhyankarsharma.com at it
1. Buy the domain if you have not (Namecheap, Cloudflare, GoDaddy, and so on).
2. Vercel, Project, Settings, Domains, add `abhyankarsharma.com`.
3. Add the DNS records Vercel shows you at your registrar. Live in minutes.

## Editing content
- Resume: replace `public/Abhyankar-Sharma-Resume.pdf` (keep the filename).
- Photo: replace `public/headshot.jpg`.
- Text, links, projects, skills, stats: all near the top of `src/App.jsx`.

## Tuning the 3D hero
Everything lives in `src/scene.js`:
- Panel positions and sizes: the `defs` array.
- Glass look: the `glassMat` material settings.
- Particle count: the `N` constant.
- Parallax strength: the `group.rotation` and `camera.position` lines in `animate()`.
- Honors the operating system "reduce motion" setting automatically.

## Performance and accessibility
- Lazy loaded images, semantic structure, keyboard focusable links.
- Person schema (JSON-LD), Open Graph and Twitter meta for SEO and link previews.
- Reduced motion respected, content stays visible without animation.

## To update when you can
- Add live demo links for ResumeTarget, Lumina and KitaKapital (now "on request").
- Swap in a higher resolution headshot if you get one.
