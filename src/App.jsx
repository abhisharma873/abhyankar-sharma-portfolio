import { useEffect, useRef, useState } from 'react'
import { initScene } from './scene.js'

const EMAIL = 'abhisharma873@gmail.com'
const LINKEDIN = 'https://www.linkedin.com/in/abhyankarsharma/'
const GITHUB = 'https://github.com/abhisharma873'
const SITE = 'https://abhyankarsharma.com'
const PAPER = 'https://anubooks.com/view?file=3673&session_id=voyager-vol-xiv-2023'
const RESUME = '/Abhyankar-Sharma-Resume.pdf'

/* ---------- hooks ---------- */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.14 }
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function useCounter(target, suffix = '', start) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const dur = 1400, t0 = performance.now()
        const tick = (now) => {
          const p = Math.min((now - t0) / dur, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          setVal(Math.round(eased * target))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
        io.disconnect()
      }
    }, { threshold: 0.5 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [target])
  return [ref, `${val}${suffix}`]
}

/* ---------- chrome ---------- */
function Progress() {
  const [w, setW] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight)
      setW(scrolled * 100)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return <div className="progress" style={{ width: `${w}%` }} />
}

function CursorGlow() {
  const ref = useRef(null)
  useEffect(() => {
    const onMove = (e) => {
      if (ref.current) {
        ref.current.style.left = e.clientX + 'px'
        ref.current.style.top = e.clientY + 'px'
      }
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
  return <div className="cursor-glow" ref={ref} />
}

function MagneticButton({ children, className, ...props }) {
  const ref = useRef(null)
  const onMove = (e) => {
    const el = ref.current
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left - r.width / 2
    const y = e.clientY - r.top - r.height / 2
    el.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`
  }
  const onLeave = () => { if (ref.current) ref.current.style.transform = '' }
  return (
    <a ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave} {...props}>
      {children}
    </a>
  )
}

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const links = [['about', 'About'], ['experience', 'Experience'], ['work', 'Work'], ['research', 'Research'], ['skills', 'Skills']]
  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="#top" className="brand"><span className="mk">AS</span>Abhyankar Sharma</a>
        <button className="nav-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? '×' : '≡'}</button>
        <div className={`nav-links ${open ? 'open' : ''}`}>
          {links.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}
          <a className="nav-cta" href="#contact" onClick={() => setOpen(false)}>Contact</a>
        </div>
      </div>
    </nav>
  )
}

/* ---------- sections ---------- */
function Hero() {
  const canvasRef = useRef(null)
  useEffect(() => {
    if (!canvasRef.current) return
    return initScene(canvasRef.current)
  }, [])
  return (
    <header className="hero" id="top">
      <div className="hero-canvas" ref={canvasRef} />
      <div className="hero-fade" />
      <div className="hero-content">
        <div className="wrap">
          <div className="hero-eyebrow eyebrow reveal in">Available for full time roles · Boston</div>
          <h1 className="reveal in d1"><span className="grad">Abhyankar Sharma</span></h1>
          <div className="hero-roles reveal in d2">
            <span>Software Engineer</span>
            <span>Full Stack Developer</span>
            <span>MBA in Business Analytics and Finance</span>
          </div>
          <p className="hero-sub reveal in d2">
            Building scalable products with engineering precision and business strategy.
          </p>
          <div className="hero-cta reveal in d3">
            <MagneticButton className="btn btn-primary" href="#work">View Projects</MagneticButton>
            <MagneticButton className="btn btn-glass" href={RESUME} download>Download Resume</MagneticButton>
            <MagneticButton className="btn btn-glass" href="#contact">Contact Me</MagneticButton>
          </div>
        </div>
      </div>
      <div className="hero-scroll">Scroll<span className="line" /></div>
    </header>
  )
}

function Stat({ n, s, l, raw }) {
  const [ref, val] = useCounter(n, s)
  return (
    <div className="stat">
      <div className="stat-n" ref={ref}>{raw || val}</div>
      <div className="stat-l">{l}</div>
    </div>
  )
}

function Stats() {
  const items = [
    { n: 3, s: '+', l: 'Years of experience' },
    { n: 5, s: '+', l: 'Products and ventures' },
    { n: 1, s: '', l: 'Published research paper' },
    { n: 0, s: '', l: 'MBA candidate, Hult', raw: '2026' },
    { n: 4, s: '', l: 'Fortune 500 clients' },
  ]
  return (
    <div className="stats">
      <div className="stats-grid">
        {items.map((it) => <Stat key={it.l} {...it} />)}
      </div>
    </div>
  )
}

function About() {
  const photoRef = useRef(null)
  const onMove = (e) => {
    const el = photoRef.current
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`
  }
  const onLeave = () => { if (photoRef.current) photoRef.current.style.transform = '' }
  const pills = ['Full Stack Development', 'AI and LLMs', 'Product Thinking', 'Data Analytics', 'Research', 'Entrepreneurship']
  return (
    <section className="section" id="about">
      <div className="wrap">
        <div className="about">
          <div className="about-photo reveal" onMouseMove={onMove} onMouseLeave={onLeave}>
            <div className="photo-glow" />
            <div className="photo-stack" ref={photoRef}>
              <img src="/headshot.jpg" alt="Abhyankar Sharma" loading="lazy" width="600" height="600" />
              <div className="photo-badge"><span className="pulse" />Boston, MA</div>
            </div>
          </div>
          <div className="about-body">
            <div className="eyebrow reveal">About</div>
            <h2 className="section-title reveal d1">Engineering precision,<br /><span className="dim">business strategy.</span></h2>
            <div className="reveal d2">
              <p style={{ marginTop: 28 }}>
                I am a software engineer with <b>3+ years</b> delivering production software for Fortune 500
                clients, now completing an <b>MBA in Business Analytics and Finance</b> at Hult International
                Business School in Boston (Sep 2025 – Aug 2026).
              </p>
              <p>
                I hold a <b>B.Tech from DIT University (2016 – 2020)</b>, and I build where full stack development
                meets product and business thinking. I work with React, Node.js and TypeScript, apply <b>AI and data analytics</b>
                to real problems, and have founded and shipped ventures, including one recognized at the Hult Prize.
              </p>
              <div className="about-pills">
                {pills.map((p) => <span className="pill" key={p}>{p}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Experience() {
  const rows = [
    {
      when: 'Sep 2025 – Aug 2026', now: true, where: 'Boston, MA',
      role: 'MBA, Business Analytics and Finance', co: 'Hult International Business School',
      desc: 'Graduate study across business analytics, finance and fintech, applied through live consulting and venture projects alongside hands on product building.',
      tags: ['Analytics', 'Finance', 'Fintech', 'Strategy'],
    },
    {
      when: '2016 – 2020', where: 'Dehradun, India',
      role: 'B.Tech, Computer Science', co: 'DIT University',
      desc: 'Graduated with a B.Tech in Computer Science from DIT University, building a strong foundation in algorithms, software engineering and analytics.',
      tags: ['Computer Science', 'Algorithms', 'Analytics'],
    },
    {
      when: 'Jul 2021 to Jul 2024', where: 'Noida, India',
      role: 'Software Engineer', co: 'Wipro Technologies',
      desc: 'Delivered software for Fortune 500 clients including PepsiCo, Morgan Stanley and Mylan. Owned technical delivery across the full development lifecycle, from build through deployment, on client facing engineering teams.',
      tags: ['Full Stack', 'Enterprise', 'Fortune 500'],
    },
    {
      when: 'Apprenticeship', where: 'Remote',
      role: 'Full Stack Apprentice', co: 'Pesto Tech',
      desc: 'Completed an intensive full stack apprenticeship across the JavaScript ecosystem, strengthening React, Node.js, API design and modern web fundamentals through project based work.',
      tags: ['React', 'Node.js', 'JavaScript'],
    },
    {
      when: 'Jun 2018 to Sep 2018', where: 'Remote, Meerut, India',
      role: 'Data Analyst Intern', co: 'Amorin',
      desc: 'Analyzed datasets and built reporting to support business decisions during a summer internship, an early step into data driven problem solving.',
      tags: ['Data Analysis', 'Reporting'],
    },
  ]
  return (
    <section className="section" id="experience">
      <div className="wrap">
        <div className="eyebrow reveal">Experience</div>
        <h2 className="section-title reveal d1">A path through code<br /><span className="dim">and business.</span></h2>
        <div className="timeline">
          {rows.map((r) => (
            <div className="tl-item reveal" key={r.role}>
              <div className="tl-when">
                <span className={r.now ? 'now' : ''}>{r.when}</span>
                <span className="tl-where">{r.where}</span>
              </div>
              <div>
                <div className="tl-role">{r.role}</div>
                <div className="tl-co">{r.co}</div>
                <p className="tl-desc">{r.desc}</p>
                <div className="tl-tags">{r.tags.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Card({ p, i, size }) {
  const ref = useRef(null)
  const onMove = (e) => {
    const el = ref.current
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <div className={`card ${size}`} ref={ref} onMouseMove={onMove}>
      <div className="card-top">
        <span className="card-badge">{p.badge}</span>
        <span className="card-num">{String(i + 1).padStart(2, '0')}</span>
      </div>
      <h3>{p.name}</h3>
      <p>{p.desc}</p>
      <div className="card-foot">
        <div className="card-tags">{p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
        {p.link
          ? <a className="card-link" href={p.link} target="_blank" rel="noreferrer">{p.label} →</a>
          : <span className="card-link muted">{p.label}</span>}
      </div>
    </div>
  )
}

function Work() {
  const projects = [
    { name: 'Helvra', badge: 'Hult Prize · 2nd', size: 'card-lg', desc: 'A B2B solar energy marketplace connecting commercial buyers with suppliers. Co-founded and placed 2nd at the Hult Prize at Hult Boston.', tags: ['Marketplace', 'Clean energy', 'B2B'], link: null, label: 'Recognized' },
    { name: 'HultCup', badge: 'Live', size: 'card-md', desc: 'A realtime World Cup prediction platform with live scoring and leaderboards, built and deployed with React and Supabase.', tags: ['React', 'Supabase', 'Realtime'], link: 'https://hultcup.com', label: 'hultcup.com' },
    { name: 'Text Summarizer', badge: 'NLP', size: 'card-md', desc: 'A text summarization project using NLP that shortens long content into concise summaries with transformer-based models.', tags: ['NLP', 'Text summarization', 'AI'], link: null, label: 'Demo on request' },
    { name: 'ResumeTarget', badge: 'AI SaaS', size: 'card-sm', desc: 'An AI powered resume optimization tool that tailors and ATS checks resumes against job descriptions, built on the Anthropic API.', tags: ['Anthropic API', 'SaaS'], link: null, label: 'Demo on request' },
    { name: 'KitaKapital', badge: 'Fintech', size: 'card-sm', desc: 'A Philippines focused embedded lending platform demo with a credit scoring model, built in React and TypeScript on Vercel.', tags: ['React', 'TypeScript'], link: null, label: 'Demo on request' },
    { name: 'Lumina', badge: 'Founder', size: 'card-sm', desc: 'An Ayurvedic skincare venture. Brand, product and go to market built from the ground up.', tags: ['D2C', 'Brand'], link: null, label: 'Case study on request' },
  ]
  return (
    <section className="section" id="work">
      <div className="wrap">
        <div className="proj-head">
          <div>
            <div className="eyebrow reveal">Selected work</div>
            <h2 className="section-title reveal d1">Products and ventures<br /><span className="dim">I have shipped.</span></h2>
          </div>
          <a className="btn btn-glass reveal d2" href={GITHUB} target="_blank" rel="noreferrer">GitHub →</a>
        </div>
        <div className="proj-grid reveal d1">
          {projects.map((p, i) => <Card key={p.name} p={p} i={i} size={p.size} />)}
        </div>
      </div>
    </section>
  )
}

function Research() {
  return (
    <section className="section" id="research">
      <div className="wrap">
        <div className="research reveal">
          <div className="research-grid">
            <div className="research-card research-paper">
              <div className="eyebrow">Published research</div>
              <h3>Voyager paper</h3>
              <p>
                I have published research featured in Voyager Vol. XIV (Anu Books). This is a separate academic output,
                distinct from awards and venture recognition.
              </p>
              <MagneticButton className="btn btn-glass" href={PAPER} target="_blank" rel="noreferrer">Read the paper →</MagneticButton>
            </div>
            <div className="research-card research-award">
              <div className="eyebrow">Award recognition</div>
              <h3>Hult Prize certificate</h3>
              <p>
                This certificate is Hult Prize recognition for Helvra, and it is not the published research paper.
              </p>
              <div className="research-img">
                <img src="/hult-prize-certificate.jpeg" alt="Hult Prize recognition certificate for Helvra" loading="lazy" />
              </div>
              <div className="research-caption">Hult Prize recognition certificate for Helvra.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Skills() {
  const groups = [
    ['Frontend', ['React', 'TypeScript', 'JavaScript', 'HTML and CSS', 'Vite']],
    ['Backend', ['Node.js', 'Express', 'REST APIs', 'Authentication']],
    ['AI', ['Anthropic API', 'LLM integration', 'Prompt design', 'NLP']],
    ['Databases', ['PostgreSQL', 'MySQL', 'Supabase', 'SQL']],
    ['Cloud and Tools', ['Vercel', 'Git', 'Power BI', 'Tableau']],
    ['Business', ['Product strategy', 'Financial modeling', 'Go to market', 'Analytics']],
  ]
  return (
    <section className="section" id="skills">
      <div className="wrap">
        <div className="eyebrow reveal">Capabilities</div>
        <h2 className="section-title reveal d1">A full stack of<br /><span className="dim">technical and business skills.</span></h2>
        <div className="skills-grid">
          {groups.map(([title, items]) => (
            <div className="skill-group reveal" key={title}>
              <h4><span className="dot" />{title}</h4>
              <div className="skill-pills">{items.map((s) => <span key={s}>{s}</span>)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section className="section" id="contact">
      <div className="wrap">
        <div className="contact-card reveal">
          <div className="eyebrow" style={{ justifyContent: 'center', display: 'inline-flex' }}>Get in touch</div>
          <h2 style={{ marginTop: 20 }}>Let us build<br /><span className="grad">something great.</span></h2>
          <p>Open to full time software engineering and analytics roles. The fastest way to reach me is email.</p>
          <div className="contact-links">
            <MagneticButton className="btn btn-primary" href={`mailto:${EMAIL}`}>Email me</MagneticButton>
            <MagneticButton className="btn btn-glass" href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn</MagneticButton>
            <MagneticButton className="btn btn-glass" href={GITHUB} target="_blank" rel="noreferrer">GitHub</MagneticButton>
            <MagneticButton className="btn btn-glass" href={RESUME} download>Resume</MagneticButton>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span>© {new Date().getFullYear()} Abhyankar Sharma</span>
        <div className="footer-soc">
          <a href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={GITHUB} target="_blank" rel="noreferrer">GitHub</a>
          <a href={`mailto:${EMAIL}`}>Email</a>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  useReveal()
  return (
    <>
      <Progress />
      <CursorGlow />
      <Nav />
      <Hero />
      <Stats />
      <About />
      <Experience />
      <Work />
      <Research />
      <Skills />
      <Contact />
      <Footer />
    </>
  )
}
