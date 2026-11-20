import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { person, ticker, stats, work, research, experience, teaching, credentials, journey } from './content.js';

gsap.registerPlugin(ScrollTrigger, SplitText);
const Lanyard = lazy(() => import('./Lanyard.jsx'));

const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canDo3D = typeof window !== 'undefined' && !reduced && window.matchMedia('(min-width: 900px) and (pointer: fine)').matches;

const Arrow = ({ d = 'ne' }) => (
  <svg viewBox="0 0 16 16" className="ico" aria-hidden="true">
    {d === 'ne' ? <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" /> : <path d="M8 3v10M3.5 8.5 8 13l4.5-4.5" />}
  </svg>
);

function StaticBadge() {
  return (
    <div className="badge-static" aria-hidden="true">
      <span className="badge-strap" />
      <div className="badge-card">
        <div className="badge-top"><b>PHD APPLICANT</b><span>FALL 2027 · COMPUTER SCIENCE</span></div>
        <img src={person.photo} alt="" width="160" height="160" />
        <strong>Abhishek<br />Tiwari</strong>
        <em>Cloud &amp; edge systems security</em>
        <div className="badge-foot">abhishek572003.github.io</div>
      </div>
    </div>
  );
}

function Art({ kind }) {
  if (kind === 'ctf') return (
    <div className="art art-ctf" aria-hidden="true">
      <pre>{`$ nc cyberstorm.siesgst 1337
> challenge 04 · web
> hint: check the cookie
$ curl -b "role=admin" /vault
flag{st0rm_ch4s3r_2025}
✓ +300 points · rank #3`}</pre>
    </div>
  );
  if (kind === 'arch') return (
    <svg className="art art-arch" viewBox="0 0 520 300" aria-hidden="true">
      <g className="a-lines">
        <path d="M70 150h70M220 150h60M360 150h60M250 150V70h40M250 150v80h40" />
      </g>
      {[['Users', 30, 130, 80], ['ALB', 140, 130, 80], ['ECS Fargate', 280, 130, 120], ['RDS', 420, 130, 70], ['Cognito', 290, 50, 100], ['CloudWatch', 290, 210, 110]].map(([t, x, y, w]) => (
        <g key={t} className={t === 'ECS Fargate' ? 'a-node hot' : 'a-node'}>
          <rect x={x} y={y} width={w} height="40" rx="10" />
          <text x={x + w / 2} y={y + 25} textAnchor="middle">{t}</text>
        </g>
      ))}
      <text x="30" y="285" className="a-cap">tenant A · tenant B · tenant C</text>
    </svg>
  );
  return (
    <div className="art art-vr" aria-hidden="true">
      <div className="vr-ring r1" /><div className="vr-ring r2" /><div className="vr-ring r3" />
      <span>360°</span>
    </div>
  );
}

function Count({ value, suffix, decimals = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (reduced) { el.textContent = value.toFixed(decimals) + suffix; return; }
    const o = { v: 0 };
    const st = ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => gsap.to(o, { v: value, duration: 1.6, ease: 'expo.out', onUpdate: () => { el.textContent = o.v.toFixed(decimals) + suffix; } }),
    });
    return () => st.kill();
  }, [value, suffix, decimals]);
  return <span ref={ref}>{(0).toFixed(decimals)}{suffix}</span>;
}

export default function App() {
  const root = useRef(null);
  const [badgeReady, setBadgeReady] = useState(false);

  useEffect(() => {
    let lenis;
    if (!reduced) {
      lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      const raf = (t) => lenis.raf(t * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length > 1) { e.preventDefault(); lenis.scrollTo(id, { offset: -20 }); history.replaceState(null, '', id); }
      }));
    }

    const ctx = gsap.context(() => {
      // header changes contrast to match the band underneath
      document.querySelectorAll('[data-theme]').forEach((sec) => {
        ScrollTrigger.create({
          trigger: sec, start: 'top 40px', end: 'bottom 40px',
          onToggle: (s) => s.isActive && document.documentElement.setAttribute('data-nav', sec.dataset.theme),
        });
      });
      if (reduced) return;

      const h = new SplitText('.hero-title', { type: 'lines,words', linesClass: 'hl', mask: 'lines' });
      gsap.from(h.words, { yPercent: 115, duration: 1.15, ease: 'expo.out', stagger: 0.045, delay: 0.1 });
      gsap.from('.hero-sub > *', { opacity: 0, y: 18, duration: 1, ease: 'expo.out', stagger: 0.08, delay: 0.55 });

      // ticker speeds up with scroll velocity
      const tl = gsap.to('.ticker-track', { xPercent: -50, ease: 'none', duration: 28, repeat: -1 });
      ScrollTrigger.create({
        onUpdate: (s) => { const v = Math.min(Math.abs(s.getVelocity()) / 400, 5); gsap.to(tl, { timeScale: 1 + v, duration: 0.3, overwrite: true }); gsap.to(tl, { timeScale: 1, duration: 1, delay: 0.3 }); },
      });

      gsap.utils.toArray('.rise').forEach((el) => gsap.from(el, { y: 40, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } }));
      gsap.utils.toArray('.big-title').forEach((el) => {
        const s = new SplitText(el, { type: 'lines', linesClass: 'hl', mask: 'lines' });
        gsap.from(s.lines, { yPercent: 105, duration: 1.1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: el, start: 'top 88%' } });
      });
      gsap.utils.toArray('.card-media img').forEach((img) => gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: img, scrub: true } }));
      gsap.from('.polaroid', { y: 80, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: '.polaroids', start: 'top 85%' } });
      gsap.from('.j-item', { y: 30, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger: '.journey-list', start: 'top 85%' } });
    }, root);

    // magnetic buttons
    const mags = [...document.querySelectorAll('.magnet')];
    const onMove = (e) => mags.forEach((m) => {
      const r = m.getBoundingClientRect(); const x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2);
      const near = Math.hypot(x, y) < 110;
      gsap.to(m, { x: near ? x * 0.22 : 0, y: near ? y * 0.3 : 0, duration: 0.5, ease: 'expo.out' });
    });
    if (!reduced) window.addEventListener('pointermove', onMove, { passive: true });

    return () => { ctx.revert(); lenis?.destroy(); window.removeEventListener('pointermove', onMove); };
  }, []);

  return (
    <div ref={root}>
      <a className="skip" href="#work">Skip to work</a>
      <header className="nav">
        <a href="#top" className="nav-mark" aria-label="Back to top">AT</a>
        <nav aria-label="Sections">
          <a href="#work">Work</a>
          <a href="#research">Research</a>
          <a href="#teaching">Teaching</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="nav-cv" href={person.cv}>CV <Arrow /></a>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero" data-theme="blue">
          <div className="hero-copy">
            <p className="chip"><span className="live" aria-hidden="true" />{person.status}</p>
            <h1 className="hero-title">
              {person.headline.map((l, i) => <span key={i} className={i === 3 ? 'hl-last' : ''}>{l} </span>)}
            </h1>
            <div className="hero-sub">
              <p>{person.intro}</p>
              <div className="hero-actions">
                <a className="btn btn-lime magnet" href={`mailto:${person.email}`}>Email me</a>
                <a className="btn btn-ghost magnet" href={person.cv}>Read my CV <Arrow /></a>
              </div>
              <ul className="hero-links">
                <li><a href={person.github}>GitHub <Arrow /></a></li>
                <li><a href={person.linkedin}>LinkedIn <Arrow /></a></li>
                <li><span>{person.location}</span></li>
              </ul>
            </div>
          </div>
          <div className="hero-badge">
            {canDo3D ? (
              <>
                {!badgeReady && <StaticBadge />}
                <div className={'lanyard' + (badgeReady ? ' on' : '')}>
                  <Suspense fallback={null}><Lanyard photo={person.photo} onReady={() => setBadgeReady(true)} /></Suspense>
                </div>
                <p className="drag-hint">drag the badge</p>
              </>
            ) : <StaticBadge />}
          </div>
        </section>

        {/* TICKER */}
        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            {[0, 1].map((k) => <div key={k} className="ticker-row">{ticker.map((t) => <span key={t + k}>{t}<i>✳</i></span>)}</div>)}
          </div>
        </div>

        {/* STATS */}
        <section className="stats" data-theme="paper" aria-label="In numbers">
          {stats.map((s) => (
            <div key={s.label} className="stat rise">
              <b><Count value={s.value} suffix={s.suffix} decimals={s.decimals} /></b>
              <span>{s.label}</span>
            </div>
          ))}
        </section>

        {/* WORK */}
        <section className="work" id="work" data-theme="paper">
          <div className="sec-top">
            <h2 className="big-title">Selected work</h2>
            <p className="sec-note rise">Things I built, shipped or led. Click any card to see it live or read the code.</p>
          </div>
          <div className="work-grid">
            {work.map((w, i) => {
              const primary = w.links?.[0]?.[1];
              return (
                <article key={w.name} className={`card rise c${i}` + (w.tall ? ' tall' : '')}>
                  <a className="card-media" href={primary || undefined} target={primary ? '_blank' : undefined} rel="noreferrer" tabIndex={primary ? 0 : -1} aria-label={primary ? `Open ${w.name}` : undefined}>
                    {w.img ? (
                      <div className={w.tall ? 'photo' : 'browser'}>
                        {!w.tall && <div className="browser-bar"><i /><i /><i /><span>{new URL(primary).host}</span></div>}
                        <img src={w.img} alt={`${w.name} screenshot`} loading="lazy" />
                      </div>
                    ) : <Art kind={w.art} />}
                  </a>
                  <div className="card-body">
                    <div className="card-meta"><span className="tag">{w.tag}</span><span>{w.year}</span></div>
                    <h3>{w.name}</h3>
                    <p>{w.what}</p>
                    <ul className="stack">{w.stack.map((s) => <li key={s}>{s}</li>)}</ul>
                    {w.links && <div className="card-links">{w.links.map(([t, u]) => <a key={u} href={u} target="_blank" rel="noreferrer">{t} <Arrow /></a>)}</div>}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* RESEARCH */}
        <section className="research" id="research" data-theme="lime">
          <h2 className="big-title">{research.title}</h2>
          <div className="research-grid">
            <div>
              <p className="research-lead rise">{research.lead}</p>
              <ul className="areas rise">{research.areas.map((a) => <li key={a}>{a}</li>)}</ul>
            </div>
            <aside className="now-card rise">
              <p className="now-label"><span className="live dark" aria-hidden="true" />{research.now.label}</p>
              <p className="now-text">{research.now.text}</p>
              <p className="now-status">{research.now.status}</p>
            </aside>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section className="exp" id="experience" data-theme="paper">
          <h2 className="big-title">Experience</h2>
          <ol className="exp-list">
            {experience.map((e) => {
              const Org = e.url ? 'a' : 'span';
              return (
                <li key={e.role} className="exp-row rise">
                  <span className="exp-when">{e.when}</span>
                  <div className="exp-main">
                    <h3>{e.role}</h3>
                    <Org className="exp-org" {...(e.url ? { href: e.url, target: '_blank', rel: 'noreferrer' } : {})}>{e.org}{e.url && <Arrow />}</Org>
                  </div>
                  <p>{e.text}</p>
                </li>
              );
            })}
          </ol>
        </section>

        {/* TEACHING */}
        <section className="teach" id="teaching" data-theme="ink">
          <div className="teach-top">
            <h2 className="big-title">{teaching.title}</h2>
            <p className="rise">{teaching.text}</p>
          </div>
          <div className="polaroids">
            {teaching.photos.map((p, i) => (
              <a key={p.img} className={'polaroid p' + i} href={p.href} target="_blank" rel="noreferrer">
                <img src={p.img} alt={p.caption} loading="lazy" />
                <span>{p.caption} <Arrow /></span>
              </a>
            ))}
          </div>
          <ul className="roles">
            {teaching.roles.map((r) => (
              <li key={r.role} className="rise">
                <span className="exp-when">{r.when}</span>
                <a href={r.href} target="_blank" rel="noreferrer"><h3>{r.role} <Arrow /></h3></a>
                <span className="role-org">{r.org}</span>
                <p>{r.text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* CREDENTIALS */}
        <section className="creds" id="education" data-theme="paper">
          <h2 className="big-title">Education &amp; certifications</h2>
          <div className="creds-grid">
            <a className="degree rise" href={credentials.degree.url} target="_blank" rel="noreferrer">
              <span className="exp-when">{credentials.degree.when}</span>
              <h3>{credentials.degree.title}</h3>
              <p className="deg-sub">{credentials.degree.sub}</p>
              <p className="deg-school">{credentials.degree.school} <Arrow /></p>
              <p className="deg-grade">{credentials.degree.grade}</p>
              <p className="deg-proj">{credentials.degree.project}</p>
            </a>
            <ul className="cert-list">
              {credentials.certs.map((c) => (
                <li key={c.name} className="cert rise">
                  <span className="cert-by">{c.by} · {c.year}</span>
                  <h3>{c.name}</h3>
                  {c.href && <a href={c.href} target="_blank" rel="noreferrer">{c.verify} <Arrow /></a>}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* JOURNEY */}
        <section className="journey" data-theme="blue">
          <h2 className="big-title">The road so far</h2>
          <ol className="journey-list">
            {journey.map(([y, t], i) => (
              <li key={y} className={'j-item' + (i === journey.length - 1 ? ' next' : '')}>
                <span className="j-year">{y}</span>
                <span className="j-dot" aria-hidden="true" />
                <p>{t}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* CONTACT */}
        <section className="contact" id="contact" data-theme="ink">
          <div className="contact-inner">
          <p className="chip chip-dark"><span className="live" aria-hidden="true" />Open to Ph.D. positions and cloud / security roles</p>
          <h2 className="contact-title big-title">Let’s talk.</h2>
          <a className="contact-mail magnet" href={`mailto:${person.email}`}>{person.email}</a>
          <div className="contact-links">
            <a className="btn btn-lime magnet" href={person.cv}>Download CV <Arrow d="down" /></a>
            <a className="btn btn-ghost-light magnet" href={person.github}>GitHub <Arrow /></a>
            <a className="btn btn-ghost-light magnet" href={person.linkedin}>LinkedIn <Arrow /></a>
          </div>
          </div>
          <footer className="foot">
            <span>© 2026 {person.name}</span>
            <span>Made with React, Three.js and GSAP · hosted free on GitHub Pages</span>
          </footer>
        </section>
      </main>
    </div>
  );
}
