import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { createScene } from './scene.js';
import { person, intro, research, interests, experience, projects, community, education, timeline } from './content.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobileQuery = typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches;

// Scrambles into the final text once, like a value resolving on a terminal.
function Resolve({ text, delay = 0 }) {
  const [out, setOut] = useState(reduced ? text : text.replace(/[^\s·]/g, '·'));
  useEffect(() => {
    if (reduced) return;
    const glyphs = 'abcdefghijklmnopqrstuvwxyz0123456789/:*';
    let raf;
    const start = performance.now();
    const duration = 900;
    const tick = () => {
      const k = (performance.now() - start - delay) / duration;
      if (k >= 1) { setOut(text); return; }
      if (k >= 0) {
        const done = Math.floor(k * text.length);
        setOut(text.split('').map((c, i) => (i < done || c === ' ' || c === '·' ? c : glyphs[(Math.random() * glyphs.length) | 0])).join(''));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const safety = setTimeout(() => setOut(text), delay + duration + 400);
    return () => { cancelAnimationFrame(raf); clearTimeout(safety); };
  }, [text, delay]);
  return <span aria-label={text}><span aria-hidden="true">{out}</span></span>;
}

const Arrow = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" className="ico"><path d="M4 12 12 4M6 4h6v6" /></svg>
);

export default function App() {
  const canvasRef = useRef(null);
  const labelsRef = useRef(null);
  const stageRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    const sceneApi = createScene(canvasRef.current, labelsRef.current, { mobile: mobileQuery, reducedMotion: reduced });

    let lenis;
    if (!reduced) {
      lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
      document.querySelectorAll('a[href^="#"]').forEach((a) =>
        a.addEventListener('click', (e) => { const id = a.getAttribute('href'); if (id.length > 1) { e.preventDefault(); lenis.scrollTo(id, { offset: -10 }); history.replaceState(null, '', id); } })
      );
    }

    const ctx = gsap.context(() => {
      // camera + red path follow the pinned stage
      ScrollTrigger.create({
        trigger: stageRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (st) => {
          const p = st.progress;
          sceneApi.setProgress(gsap.utils.clamp(0, 1, p / 0.62), gsap.utils.clamp(0, 1, (p - 0.38) / 0.2));
        },
      });
      // the model fades out once the reader reaches the written sections
      ScrollTrigger.create({
        trigger: '#content',
        start: 'top 85%',
        end: 'top 15%',
        scrub: true,
        onUpdate: (st) => { gsap.set('.map', { opacity: 1 - st.progress }); },
        onLeave: () => sceneApi.setVisible(false),
        onEnterBack: () => sceneApi.setVisible(true),
      });

      if (!reduced) {
        const split = new SplitText('.hero-name .line', { type: 'chars', charsClass: 'ch' });
        gsap.from(split.chars, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.035, delay: 0.15 });
        gsap.from('.hero-foot > *', { opacity: 0, y: 14, duration: 0.9, ease: 'expo.out', stagger: 0.08, delay: 0.7 });

        gsap.timeline({ scrollTrigger: { trigger: stageRef.current, start: '30% top', end: '50% top', scrub: true } })
          .to('.hero', { opacity: 0, y: -60, ease: 'none' }, 0);
        gsap.fromTo('.q-panel', { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: 'none', scrollTrigger: { trigger: stageRef.current, start: '40% top', end: '55% top', scrub: true } });

        gsap.utils.toArray('.reveal').forEach((el) => {
          gsap.from(el, { opacity: 0, y: 28, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
        });
        gsap.utils.toArray('.sec-title').forEach((el) => {
          const s = new SplitText(el, { type: 'lines', linesClass: 'ln', mask: 'lines' });
          gsap.from(s.lines, { yPercent: 100, duration: 1.1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: el, start: 'top 85%' } });
        });
      }
    }, rootRef);

    const bar = document.querySelector('.bar');
    const onScroll = () => bar.classList.toggle('solid', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const onMove = (e) => sceneApi.setPointer((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1);
    window.addEventListener('pointermove', onMove, { passive: true });

    return () => { ctx.revert(); lenis?.destroy(); window.removeEventListener('pointermove', onMove); window.removeEventListener('scroll', onScroll); sceneApi.dispose(); };
  }, []);

  return (
    <div ref={rootRef}>
      <div className="map" aria-hidden="true">
        <canvas ref={canvasRef} />
        <div className="map-labels" ref={labelsRef} />
      </div>

      <header className="bar">
        <a href="#top" className="bar-name">{person.name}</a>
        <nav aria-label="Sections">
          <a href="#research">Research</a>
          <a href="#work">Work</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
          <a href={person.cv} className="bar-cv">CV <Arrow /></a>
        </nav>
      </header>

      <main id="top">
        <section className="stage" ref={stageRef}>
          <div className="stage-sticky">
            <div className="hero">
              <h1 className="hero-name">
                <span className="line">{person.first}</span>
                <span className="line">{person.last}</span>
              </h1>
              <div className="hero-foot">
                <p className="hero-role"><Resolve text={person.role} delay={500} /></p>
                <p className="hero-status">{person.status} · {person.location}</p>
                <div className="hero-actions">
                  <a className="btn btn-solid" href={`mailto:${person.email}`}>Email me</a>
                  <a className="btn" href={person.cv}>Read the CV <Arrow /></a>
                </div>
              </div>
              <p className="scroll-cue">Scroll: follow one misconfigured path through the system</p>
            </div>

            <div className="q-panel" id="research">
              <p className="q-tag"><span className="dot-red" aria-hidden="true" /> Current study · open research notebook</p>
              <h2 className="q-title">{research.question}</h2>
              <p className="q-context">{research.context}</p>
              <p className="q-caption">The red path in the model is an illustration of the kind of change being measured, not real data.</p>
            </div>
          </div>
        </section>

        <div id="content" className="content">
          <section className="sec notebook">
            <div className="sec-head">
              <h2 className="sec-title">How the study works</h2>
            </div>
            <p className="ctx-mobile">{research.context}</p>
            <ol className="method">
              {research.method.map(([k, t]) => (
                <li key={k} className="reveal"><b>{k}</b><span>{t}</span></li>
              ))}
            </ol>
            <ol className="log">
              {research.log.map((l, i) => (
                <li key={i} className={'reveal' + (l.next ? ' next' : '')}><time>{l.date}</time><span>{l.text}</span></li>
              ))}
            </ol>
            <p className="log-note reveal">{research.note}</p>
          </section>

          <section className="sec about">
            <div className="about-grid">
              <img className="portrait reveal" src={person.photo} alt={`Portrait of ${person.name}`} width="400" height="400" loading="lazy" />
              <p className="about-text reveal">{intro}</p>
            </div>
          </section>

          <section className="sec" id="interests">
            <div className="sec-head"><h2 className="sec-title">What I study, layer by layer</h2></div>
            <ul className="interests">
              {interests.map((it) => (
                <li key={it.title} className="reveal">
                  <span className="layer">{it.layer}</span>
                  <h3>{it.title}</h3>
                  <p>{it.text}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="sec" id="work">
            <div className="sec-head"><h2 className="sec-title">Work</h2></div>
            <ul className="rows">
              {experience.map((e) => (
                <li key={e.role} className="row reveal">
                  <span className="when">{e.when}</span>
                  <div>
                    <h3>{e.role}</h3>
                    <p className="org">{e.org} · {e.place}</p>
                    <p>{e.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="sec" id="projects">
            <div className="sec-head"><h2 className="sec-title">Projects</h2></div>
            <ul className="projects">
              {projects.map((p) => {
                const Tag = p.link ? 'a' : 'div';
                return (
                  <li key={p.name} className="reveal">
                    <Tag className="proj" {...(p.link ? { href: p.link, target: '_blank', rel: 'noreferrer' } : {})}>
                      <span className="proj-year">{p.year}</span>
                      <span className="proj-name">{p.name}{p.link && <Arrow />}</span>
                      <span className="proj-kind">{p.kind}</span>
                      <span className="proj-text">{p.text}</span>
                    </Tag>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="sec" id="community">
            <div className="sec-head"><h2 className="sec-title">Teaching and community</h2></div>
            <ul className="rows">
              {community.map((c) => (
                <li key={c.role} className="row reveal">
                  <span className="when">{c.when}</span>
                  <div>
                    <h3>{c.role}</h3>
                    <p className="org">{c.org}</p>
                    <p>{c.text}</p>
                  </div>
                  {c.figure && <span className="figure"><b>{c.figure}</b>{c.figureLabel}</span>}
                </li>
              ))}
            </ul>
          </section>

          <section className="sec" id="education">
            <div className="sec-head"><h2 className="sec-title">Education</h2></div>
            <div className="edu reveal">
              <span className="when">{education.when}</span>
              <div>
                <h3>{education.degree}</h3>
                <p className="org">{education.school}</p>
                <p>{education.spec}</p>
                <p className="edu-grade"><b>{education.grade}</b> · {education.trend}</p>
                <p className="muted">{education.coursework}</p>
                <ul className="certs">{education.certs.map((c) => <li key={c}>{c}</li>)}</ul>
              </div>
            </div>
          </section>

          <section className="sec" id="timeline">
            <div className="sec-head"><h2 className="sec-title">Timeline</h2></div>
            <ol className="tl">
              {timeline.map(([y, t, now], i) => (
                <li key={i} className={'reveal' + (now ? ' now' : '')}>
                  <span className="tl-y">{i === 0 || timeline[i - 1][0] !== y ? y : ''}</span>
                  <span className="tl-t">{t}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="sec close" id="contact">
            <h2 className="close-title sec-title">If this overlaps with your lab or team, I would like to hear from you.</h2>
            <a className="close-mail" href={`mailto:${person.email}`}>{person.email}</a>
            <div className="close-links">
              <a href={person.cv}>CV (PDF) <Arrow /></a>
              <a href={person.github}>GitHub <Arrow /></a>
              <a href={person.linkedin}>LinkedIn <Arrow /></a>
            </div>
            <p className="now-line"><span className="dot-live" aria-hidden="true" /> Now: {person.now}</p>
          </section>

          <footer className="foot">© 2026 {person.name} · {person.location}</footer>
        </div>
      </main>
    </div>
  );
}
