import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import GridCurtainTransition from './components/GridCurtainTransition';

gsap.registerPlugin(ScrollTrigger);

/* ── Types ─────────────────────────────────────────────── */
interface Project {
  num: string; title: string; category: string; highlight: string;
  metrics: string[]; desc: string; year: string; tech: string[];
}
interface ResearchItem {
  title: string; journal: string; status: string; citations: string;
  desc: string; year: string; coAuthors?: string; impactFactor?: string;
}
interface KaggleItem {
  competition: string; rank: string; rankPct: number; type: string;
  desc: string; metrics: string[]; year: string; ongoing?: boolean;
}
interface CommunityItem {
  role: string; detail: string; desc: string; impact: string[]; year: string;
}

/* ── Neural Network Canvas ─────────────────────────────── */
function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animFrame: number;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const nodes = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });
      nodes.forEach((a, i) => {
        nodes.slice(i + 1).forEach(b => {
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99,102,241,${(1 - d / 130) * 0.35})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        });
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99,102,241,0.6)'; ctx.fill();
      });
      animFrame = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animFrame); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="neural-canvas" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} />;
}

/* ── Animated Counter ──────────────────────────────────── */
function Counter({ to, prefix = '', suffix = '' }: { to: number; prefix?: string; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0; const step = to / 60;
        const t = setInterval(() => {
          start = Math.min(start + step, to);
          setVal(Math.round(start));
          if (start >= to) clearInterval(t);
        }, 16);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

export default function App() {
  const [selectedProject, setSelectedProject]   = useState<Project | null>(null);
  const [selectedResearch, setSelectedResearch] = useState<ResearchItem | null>(null);
  const [selectedKaggle,   setSelectedKaggle]   = useState<KaggleItem | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityItem | null>(null);
  const [introComplete, setIntroComplete]       = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /* ── Data ───────────────────────────────────────────── */
  const projects: Project[] = [
    {
      num: '01', title: 'C-TRUST — Clinical Trial Risk Intelligence',
      category: 'Multi-Agent AI · Healthcare',
      highlight: 'Novartis NEST 2.0 · National Semifinalist, Top 30',
      metrics: ['7 AI Agents', '~300ms latency', '331 tests', '23 studies'],
      desc: 'Enterprise-grade multi-agent AI system built for Novartis clinical trial operations. C-TRUST deploys 7 specialized AI agents with weighted consensus voting to analyze data quality across 23 concurrent clinical studies at ~300ms latency. A Guardian meta-agent monitors cross-agent consistency and system integrity in real time. Production-ready with multi-layer caching, comprehensive error handling, and full OpenAPI docs via FastAPI.',
      year: '2024', tech: ['Python','FastAPI','LightGBM','Multi-Agent AI','Hypothesis','React'],
    },
    {
      num: '02', title: 'Cricket Scouting Intelligence System',
      category: 'Sports Analytics · Data Science',
      highlight: 'Rajasthan Royals SuperRR · Rank 4 / 7,599 Teams',
      metrics: ['602,992 records', '84 features', '9 archetypes', 'Top 40 players'],
      desc: 'Data-driven player scouting system for Rajasthan Royals to identify India\'s next national cricketers before selectors do. Analyzed 602,992 ball-by-ball records across 3,738 uncapped Indian players to produce a ranked Top 40 with capping likelihood scores, player archetype profiles, and auction strategy recommendations.',
      year: '2024', tech: ['Python','LightGBM','K-Means','Pandas','Plotly','SciPy'],
    },
    {
      num: '03', title: 'Smart Product Attribute Extraction',
      category: 'Competitive ML · Multimodal',
      highlight: 'Amazon ML Challenge 2025 · Top 8% / 10,000+ Teams',
      metrics: ['SMAPE: 38.4%', '1,742 features', '75K products', 'Semi-supervised'],
      desc: 'End-to-end multimodal ML pipeline for product attribute extraction at scale. Fused text features (TF-IDF + SVD), EfficientNetB0 image embeddings, and rule-based extraction into a unified 1,742-feature dataset. Applied semi-supervised pseudo-labeling to reduce SMAPE from 44.9% to 38.4%.',
      year: '2025', tech: ['PyTorch','XGBoost','LightGBM','EfficientNetB0','Python','TF-IDF'],
    },
    {
      num: '04', title: 'SHL Assessment Recommendation Engine',
      category: 'GenAI · NLP',
      highlight: 'RAG Pipeline · Production-Ready · Company Validated',
      metrics: ['MAP@3: 0.87', 'Recall: 0.91', '<100ms latency', '2,500+ assessments'],
      desc: 'Production-ready RAG system enabling natural language querying over SHL\'s psychometric assessment catalog. Scraped and indexed 2,500+ assessments using sentence-transformer embeddings with FAISS vector indexing. Deployed as a full-stack app with Streamlit frontend and FastAPI backend, achieving sub-100ms retrieval latency.',
      year: '2024', tech: ['Python','FAISS','LangChain','FastAPI','Streamlit','Sentence-Transformers'],
    },
  ];

  const experience = [
    {
      period: 'Jul — Oct 2025', role: 'AI Engineer Intern',
      company: 'CloudCredits', location: 'Remote',
      points: [
        'Built and deployed financial risk assessment models (XGBoost, Random Forest) on <strong>5M+ transaction records</strong>, achieving <strong>89% accuracy</strong> and reducing false positives by 34% in live production.',
        'Conducted EDA on <strong>3.2M customer records</strong>; derived 12 domain-specific risk indicators that improved credit scoring precision by <strong>27%</strong> and reduced default prediction errors by 18%.',
      ],
    },
    {
      period: 'Nov — Dec 2024', role: 'AI Engineer Intern',
      company: 'AICTE', location: 'Remote',
      points: [
        'Fine-tuned <strong>LLaMA 2-7B</strong> on 50K domain-specific Q&A pairs using LoRA adapters, improving answer accuracy from 72% to <strong>91%</strong> with sub-2 second inference latency.',
        'Built an automated content processing pipeline that ingested and structured <strong>200+ hours of technical curricula</strong> into machine-readable Q&A datasets, reducing manual curation effort by over 60%.',
      ],
    },
  ];

  const hackathons = [
    {
      title: 'SuperRR Selector Hackathon', rank: 'Rank 4 / 7,599 Teams', emoji: '🥇',
      detail: 'Rajasthan Royals (IPL Franchise) — Sports Analytics / AI-ML',
      prize: 'Solo Submission', tier: 'gold',
      videos: [
        { label: 'Part 1', url: 'https://youtu.be/HuvrKN8uJZ4?si=1e1VP7TPTDH7e77v' },
        { label: 'Part 2', url: 'https://youtu.be/OJjg-OFGErg?si=MbqqYENRdhHaWBfp' },
      ],
    },
    {
      title: 'Smart India Hackathon 2024', rank: 'All India Rank 2 (Runner-Up)', emoji: '🥈',
      detail: 'Government of India — Ministry of Justice / 49,000+ Teams',
      prize: 'Team Submission', tier: 'silver', videos: [],
    },
    {
      title: 'Amazon ML Challenge 2025', rank: 'Top 8% / 10,000+ Teams', emoji: '🏅',
      detail: 'Unstop (Amazon) — Multimodal ML / Product Attribute Extraction',
      prize: 'Solo Submission', tier: 'bronze', videos: [],
    },
    {
      title: 'Novartis NEST 2.0', rank: 'National Semifinalist — Top 30', emoji: '🏅',
      detail: 'Novartis (Global Pharma) — Healthcare AI',
      prize: 'Team Submission', tier: 'bronze', videos: [],
    },
  ];

  const researchData: ResearchItem[] = [
    {
      title: 'Predicting Problematic Internet Use in Children: A Novel Methodology Leveraging QWK and Advanced Multi-Modal Feature Engineering',
      journal: 'Journal of Artificial Intelligence Research (JAIR)',
      status: 'Under Peer Review', citations: 'First Author',
      desc: 'Novel approach to predicting PIU severity in adolescents using multi-modal feature fusion from accelerometer, fitness, and behavioral data. Proposes a QWK-optimized ensemble methodology achieving state-of-the-art performance on the Child Mind Institute dataset.',
      year: '2025',
      coAuthors: 'Bishal Roy (First Author), Pranjali Bahalkar (Co-author)',
      impactFactor: 'High Impact',
    },
    {
      title: 'Real-Time Indian Sign Language Translation System Using Deep Learning and Avatar-Based Visualization',
      journal: 'Pattern Recognition (Elsevier) — IF: 7.5+ · MS: PR-D-25-08963',
      status: 'Under Peer Review', citations: 'Co-author',
      desc: 'Deep learning pipeline for real-time ISL-to-text and text-to-ISL translation with avatar-based visualization for accessibility. Built on the Mudra platform developed during Smart India Hackathon 2024.',
      year: '2025',
      coAuthors: 'Gaurav Masand (Lead), Bishal Roy (Co-author) + Team',
      impactFactor: '7.5+',
    },
  ];

  const kaggleData: KaggleItem[] = [
    {
      competition: 'BirdCLEF 2026', rank: 'Top 10%', rankPct: 90, year: 'Ongoing', ongoing: true,
      type: 'Bioacoustics AI',
      desc: '234-species bird audio classification using Google Perch v2 bioacoustic embeddings with Bayesian prior fusion.',
      metrics: ['ROC-AUC: 0.910', '234 species', 'Bioacoustics'],
    },

    {
      competition: 'Child Mind Institute — PIU', rank: 'Top 33%', rankPct: 67, year: '2024',
      type: 'Mental Health AI',
      desc: 'Predicted PIU severity in adolescents from wrist accelerometer data using ensemble methods with Optuna optimization.',
      metrics: ['QWK: 0.485', 'Ensemble', 'Multi-modal'],
    },
    {
      competition: 'RSNA Intracranial Aneurysm', rank: 'Top 33%', rankPct: 67, year: '2024',
      type: 'Medical Imaging',
      desc: 'Intracranial aneurysm detection from CT angiography scans using deep learning.',
      metrics: ['Medical AI', 'CT Scans', 'Detection'],
    },
  ];

  const communityData: CommunityItem[] = [
    {
      role: 'GDG — AI/ML Co-Lead (Google Developer Groups)',
      detail: '8 GenAI workshops · 400+ developers · 92% satisfaction',
      desc: 'Co-organized and delivered 8 technical workshops on GenAI, LLMs, and RAG systems to 400+ developers. Topics: LLM fine-tuning, RAG pipeline architecture, prompt engineering, AI product building.',
      impact: ['400+ devs trained', '92% satisfaction', '8 workshops', 'GenAI & RAG'],
      year: '2024',
    },
    {
      role: 'Competitive Programming & SQL',
      detail: 'HackerRank Gold Badge — SQL Advanced Certified',
      desc: 'HackerRank Gold Badge in SQL (Advanced Certified). Active on LeetCode and StrataScratch focusing on ML interview preparation and algorithmic problem solving.',
      impact: ['Gold Badge SQL', 'Advanced Certified', 'LeetCode Active', 'ML Prep'],
      year: '2024',
    },
  ];

  const skills = [
    { category: 'Languages & Core', items: ['Python', 'SQL (HackerRank Gold)', 'C++'] },
    { category: 'ML / DL', items: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'XGBoost', 'LightGBM', 'CatBoost', 'Ensemble Methods', 'Optuna'] },
    { category: 'GenAI & LLMs', items: ['LangChain', 'RAG Pipelines', 'LoRA / QLoRA', 'Prompt Engineering', 'FAISS', 'ChromaDB', 'HuggingFace', 'Multi-Agent Systems', 'LLaMA', 'Mistral'] },
    { category: 'MLOps & Deploy', items: ['FastAPI', 'Docker', 'Git', 'CI/CD', 'MLflow', 'Weights & Biases', 'Streamlit', 'REST APIs'] },
    { category: 'Data Engineering', items: ['Pandas', 'NumPy', 'Feature Engineering', 'Statistical Analysis', 'EDA', 'Plotly', 'PySpark'] },
  ];

  /* ── Intersection observer for timeline/fade-up ───────── */
  useEffect(() => {
    if (!introComplete) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.15 });
    document.querySelectorAll('.timeline-item, .fade-up').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [introComplete]);

  /* ── Lenis + GSAP ─────────────────────────────────────── */
  useEffect(() => {
    if (!introComplete) return;
    const lenis = new Lenis({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);

    gsap.set('.hero-line', { yPercent: 100 });
    gsap.to('.hero-line', { yPercent: 0, duration: 1.2, stagger: 0.1, ease: 'power4.out', delay: 0.3 });

    document.querySelectorAll('.bento-card').forEach((el, i) => {
      gsap.fromTo(el, { opacity: 0, y: 30, scale: 0.95 }, {
        opacity: 1, y: 0, scale: 1, duration: 0.7, delay: 0.5 + i * 0.08,
        ease: 'power3.out',
      });
    });

    document.querySelectorAll('.project-card').forEach((el, i) => {
      gsap.fromTo(el, { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 0.7, delay: i * 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });

    document.querySelectorAll('.hackathon-card').forEach((el, i) => {
      gsap.fromTo(el, { opacity: 0, y: 60 }, {
        opacity: 1, y: 0, duration: 0.8, delay: i * 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.hackathons-grid', start: 'top 80%' },
      });
    });

    document.querySelectorAll('.kaggle-item').forEach((el, i) => {
      gsap.fromTo(el, { opacity: 0, x: -30 }, {
        opacity: 1, x: 0, duration: 0.6, delay: i * 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });

    document.querySelectorAll('.research-card').forEach((el, i) => {
      gsap.fromTo(el, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.7, delay: i * 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });

    document.querySelectorAll('.skill-row').forEach((el, i) => {
      gsap.fromTo(el, { opacity: 0, x: -20 }, {
        opacity: 1, x: 0, duration: 0.5, delay: i * 0.07, ease: 'power3.out',
        scrollTrigger: { trigger: '.skills-list', start: 'top 80%' },
      });
    });

    return () => { lenis.destroy(); ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, [introComplete]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSelectedProject(null); setSelectedResearch(null); setSelectedKaggle(null); setSelectedCommunity(null); }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  /* ── Render ───────────────────────────────────────────── */
  return (
    <>
      <GridCurtainTransition onComplete={() => setIntroComplete(true)} />

      {/* ── Project Side Panel ─ */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="side-panel" onClick={e => e.stopPropagation()}>
            <div className="panel-header">
              <div>
                <div className="panel-category">{selectedProject.category}</div>
                <div className="panel-year">{selectedProject.year}</div>
              </div>
              <button className="panel-close" onClick={() => setSelectedProject(null)}>✕</button>
            </div>
            <div className="panel-body">
              <h2 className="panel-title">{selectedProject.title}</h2>
              <div className="panel-highlight">⚡ {selectedProject.highlight}</div>
              <p className="panel-desc">{selectedProject.desc}</p>
              <div>
                <div className="panel-section-label">Key Metrics</div>
                <div className="panel-metrics">
                  {selectedProject.metrics.map((m, i) => <span key={i} className="panel-metric">{m}</span>)}
                </div>
              </div>
              <div>
                <div className="panel-section-label">Technologies</div>
                <div className="panel-tech">
                  {selectedProject.tech.map((t, i) => <span key={i} className="panel-tech-item">{t}</span>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Research Side Panel ─ */}
      {selectedResearch && (
        <div className="modal-overlay" onClick={() => setSelectedResearch(null)}>
          <div className="side-panel" onClick={e => e.stopPropagation()}>
            <div className="panel-header">
              <div>
                <div className="panel-category">Research Paper</div>
                <div className="panel-year">{selectedResearch.year}</div>
              </div>
              <button className="panel-close" onClick={() => setSelectedResearch(null)}>✕</button>
            </div>
            <div className="panel-body">
              <h2 className="panel-title">{selectedResearch.title}</h2>
              <div className="panel-highlight">📄 {selectedResearch.status}</div>
              <div className="panel-journal">{selectedResearch.journal}</div>
              <p className="panel-desc">{selectedResearch.desc}</p>
              <div>
                <div className="panel-section-label">Authors</div>
                <div className="panel-coauthors">
                  {selectedResearch.coAuthors?.split(',').map((a, i) => (
                    <span key={i} className={`panel-tech-item${i===0?' research-author-chip first':' research-author-chip'}`}>{a.trim()}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="panel-section-label">Info</div>
                <div className="panel-metrics">
                  <span className="panel-metric">{selectedResearch.citations}</span>
                  {selectedResearch.impactFactor && <span className="panel-metric">IF: {selectedResearch.impactFactor}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Kaggle Side Panel ─ */}
      {selectedKaggle && (
        <div className="modal-overlay" onClick={() => setSelectedKaggle(null)}>
          <div className="side-panel" onClick={e => e.stopPropagation()}>
            <div className="panel-header">
              <div>
                <div className="panel-category">{selectedKaggle.type}</div>
                <div className="panel-year">{selectedKaggle.year}</div>
              </div>
              <button className="panel-close" onClick={() => setSelectedKaggle(null)}>✕</button>
            </div>
            <div className="panel-body">
              <h2 className="panel-title">{selectedKaggle.competition}</h2>
              <div className="panel-highlight">🏆 {selectedKaggle.rank}</div>
              <p className="panel-desc">{selectedKaggle.desc}</p>
              <div>
                <div className="panel-section-label">Key Metrics</div>
                <div className="panel-metrics">
                  {selectedKaggle.metrics.map((m, i) => <span key={i} className="panel-metric">{m}</span>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Community Side Panel ─ */}
      {selectedCommunity && (
        <div className="modal-overlay" onClick={() => setSelectedCommunity(null)}>
          <div className="side-panel" onClick={e => e.stopPropagation()}>
            <div className="panel-header">
              <div>
                <div className="panel-category">Community & Leadership</div>
                <div className="panel-year">{selectedCommunity.year}</div>
              </div>
              <button className="panel-close" onClick={() => setSelectedCommunity(null)}>✕</button>
            </div>
            <div className="panel-body">
              <h2 className="panel-title">{selectedCommunity.role}</h2>
              <div className="panel-highlight">💡 {selectedCommunity.detail}</div>
              <p className="panel-desc">{selectedCommunity.desc}</p>
              <div>
                <div className="panel-section-label">Impact</div>
                <div className="panel-metrics">
                  {selectedCommunity.impact.map((m, i) => <span key={i} className="panel-metric">{m}</span>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={containerRef} className="main">

        {/* ── Nav ─────────────────────────────────────────── */}
        <nav className="nav">
          <span className="nav-logo">Bishal <span>Roy</span></span>
          <div className="nav-links">
            <a href="#work">Work</a>
            <a href="#experience">Experience</a>
            <a href="#achievements">Achievements</a>
            <a href="#research">Research</a>
            <a href="#contact">Contact</a>
            <a href="mailto:roybishal9989@gmail.com" className="nav-cta">Hire Me →</a>
          </div>
        </nav>

        {/* ── Hero ────────────────────────────────────────── */}
        <section className="hero">
          <NeuralCanvas />

          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              AI Engineer · ML Researcher · Open to Work
            </div>

            <h1 className="hero-title">
              <div className="overflow-hidden"><span className="hero-line">Building</span></div>
              <div className="overflow-hidden"><span className="hero-line gradient-text">Intelligent</span></div>
              <div className="overflow-hidden"><span className="hero-line">Systems.</span></div>
            </h1>

            <p className="hero-bio">
              Final-year AI & Data Science undergrad turning complex data into production-grade ML systems.
              From 7-agent clinical AI platforms to Top 8% National finishes — I ship work that scales.
            </p>

            <div className="hero-stats-row">
              <div className="hero-stat">
                <div className="hero-stat-num"><span>AIR 2</span></div>
                <div className="hero-stat-label">Smart India Hackathon</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">Top <span>8%</span></div>
                <div className="hero-stat-label">Amazon ML Challenge</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num"><span>5M+</span></div>
                <div className="hero-stat-label">Records Processed</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num"><span>2</span></div>
                <div className="hero-stat-label">Research Papers</div>
              </div>
            </div>

            <div className="hero-actions">
              <a href="#work" className="btn-primary">View Work →</a>
              <a href="mailto:roybishal9989@gmail.com" className="btn-secondary">Get in Touch</a>
            </div>

            <div className="hero-socials">
              <a href="https://www.linkedin.com/in/bishal-roy-5410b5257/" target="_blank" rel="noopener noreferrer" className="hero-social-link">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://github.com/roybishal362" target="_blank" rel="noopener noreferrer" className="hero-social-link">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="mailto:roybishal9989@gmail.com" className="hero-social-link">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </a>
            </div>
          </div>

          {/* Bento Achievement Grid */}
          <div className="hero-right">
            <div className="bento-grid">
              <div className="bento-card wide">
                <div className="bento-badge">🏆 Best Achievement</div>
                <div className="bento-metric">AIR 2</div>
                <div className="bento-title">Smart India Hackathon 2024 — National Runner-Up</div>
                <div className="bento-desc">Government of India · 49,000+ teams nationwide</div>
                <div className="bento-meta">
                  <span className="bento-meta-item">49K+ Teams</span>
                  <span className="bento-meta-item">National Scope</span>
                  <span className="bento-meta-item">2024</span>
                </div>
              </div>

              <div className="bento-card cyan-accent">
                <div className="bento-badge">🎯 Hackathon</div>
                <div className="bento-metric">Top 8%</div>
                <div className="bento-title">Amazon ML Challenge</div>
                <div className="bento-desc">10,000+ teams</div>
                <div className="bento-meta"><span className="bento-meta-item">2025</span></div>
              </div>

              <div className="bento-card">
                <div className="bento-badge">🏏 Sports AI</div>
                <div className="bento-metric">Rank 4</div>
                <div className="bento-title">Rajasthan Royals SuperRR</div>
                <div className="bento-desc">7,599 teams</div>
                <div className="bento-meta"><span className="bento-meta-item">Solo</span></div>
              </div>

              <div className="bento-card green-accent">
                <div className="bento-badge">🟢 Live</div>
                <div className="bento-metric">Top 10%</div>
                <div className="bento-title">BirdCLEF 2026</div>
                <div className="bento-desc">ROC-AUC: 0.910 · Ongoing</div>
              </div>

              <div className="bento-card amber-accent">
                <div className="bento-badge">💊 Healthcare</div>
                <div className="bento-metric">Top 30</div>
                <div className="bento-title">Novartis NEST 2.0</div>
                <div className="bento-desc">National Semifinalist</div>
              </div>

              <div className="bento-card cyan-accent">
                <div className="bento-badge">📄 Research</div>
                <div className="bento-metric">2</div>
                <div className="bento-title">Papers Under Review</div>
                <div className="bento-desc">JAIR + Pattern Recognition (Elsevier, IF 7.5+)</div>
              </div>
            </div>
          </div>

          <div className="scroll-indicator">Scroll Down</div>
        </section>

        {/* ── About ───────────────────────────────────────── */}
        <section id="about" className="about-section">
          <div className="about-avatar-wrap">
            <div className="about-photo-inner">
              <img
                src="/bishal.png"
                alt="Bishal Roy"
                className="about-photo"
              />
              <div className="about-photo-overlay">
                <div className="about-status-badge">
                  <span className="about-status-dot" />
                  Available for Hire
                </div>
              </div>
            </div>
            <div className="about-avatar-caption">
              <div className="about-caption-name">Bishal Roy</div>
              <div className="about-caption-loc">📍 Pune, India · Graduating May 2026</div>
            </div>
          </div>

          <div className="about-right">
            <div>
              <div className="section-label">About Me</div>
              <h2 className="about-headline">Architecting <span className="hl">Intelligent</span><br />Systems at Scale</h2>
            </div>

            <p className="about-bio">
              I'm a final-year B.E. student in <strong>Artificial Intelligence & Data Science</strong> at Dr. D.Y. Patil Institute of Technology, Pune (CGPA: 9.25). I build AI systems that go beyond notebooks — from a{' '}
              <strong>multi-agent clinical trial intelligence platform</strong> processing 23 concurrent studies at 300ms latency, to a cricket scouting engine that analyzed 602,992 ball-by-ball records and ranked{' '}
              <strong>4th out of 7,599 teams</strong> for Rajasthan Royals.
            </p>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-num"><Counter to={5} suffix="M+" /></div>
                <div className="stat-label">Records Processed</div>
              </div>
              <div className="stat-card">
                <div className="stat-num"><Counter to={97} suffix="%" /></div>
                <div className="stat-label">LLM Fine-tune Accuracy</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">Top <Counter to={8} suffix="%" /></div>
                <div className="stat-label">Amazon ML Challenge</div>
              </div>
              <div className="stat-card">
                <div className="stat-num"><Counter to={49} suffix="K+" /></div>
                <div className="stat-label">Teams Beaten (SIH)</div>
              </div>
            </div>

            <div className="edu-card">
              <div className="edu-degree">B.E. in Artificial Intelligence & Data Science</div>
              <div className="edu-school">Dr. D. Y. Patil Institute of Technology, Pune</div>
              <div className="edu-meta">
                <span className="edu-cgpa">CGPA: 9.25 / 10</span>
                <span className="edu-period">Nov 2022 — May 2026</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Skills Marquee ──────────────────────────────── */}
        <div className="skills-marquee">
          <div className="skills-marquee-row">
            <div className="skills-track skills-track-left">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="skills-text-group">
                  {['Python', 'PyTorch', 'TensorFlow', 'LangChain', 'RAG', 'XGBoost', 'LightGBM', 'FAISS', 'FastAPI', 'Docker', 'HuggingFace', 'LLaMA', 'Optuna', 'Multi-Agent AI', 'SQL'].map((s, j) => (
                    <><span key={j}>{s}</span><span className="skills-dot">•</span></>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="skills-marquee-row logos-row">
            <div className="skills-track skills-track-right">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="skills-logo-group">
                  {[
                    ['python','Python'],['pytorch','PyTorch'],['tensorflow','TensorFlow'],
                    ['scikitlearn','Scikit-learn'],['pandas','Pandas'],['numpy','NumPy'],
                    ['fastapi','FastAPI'],['docker','Docker'],['amazonwebservices','AWS'],
                    ['git','Git'],['jupyter','Jupyter'],['kaggle','Kaggle'],
                    ['streamlit','Streamlit'],['postgresql','PostgreSQL'],['mongodb','MongoDB'],
                  ].map(([icon, alt]) => (
                    <img key={icon} src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${icon}/${icon}-original.svg`} alt={alt} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Work / Projects ─────────────────────────────── */}
        <section id="work" className="work-section">
          <div className="section-label">Selected Work</div>
          <h2 className="section-title">
            Projects that <span className="accent">Ship</span>
          </h2>

          <div className="projects-grid">
            {projects.map((p, i) => (
              <div key={i} className="project-card" onClick={() => setSelectedProject(p)}>
                <div className="project-card-top">
                  <span className="project-num">{p.num}</span>
                  <span className="project-year">{p.year}</span>
                </div>
                <h3 className="project-title">{p.title}</h3>
                <span className="project-highlight">{p.highlight}</span>
                <div className="project-metrics">
                  {p.metrics.map((m, j) => <span key={j} className="metric-tag">{m}</span>)}
                </div>
                <div className="project-tech">
                  {p.tech.slice(0, 4).map((t, j) => <span key={j} className="tech-pill">{t}</span>)}
                  {p.tech.length > 4 && <span className="tech-pill">+{p.tech.length - 4}</span>}
                </div>
                <span className="project-arrow">↗</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Experience Timeline ──────────────────────────── */}
        <section id="experience" className="experience-section">
          <div className="section-label">Experience</div>
          <h2 className="section-title">Where I've <span className="accent">Worked</span></h2>

          <div className="timeline">
            {experience.map((e, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-dot" />
                <div className="exp-period-tag">{e.period}</div>
                <h3 className="exp-role">{e.role}</h3>
                <div className="exp-company-wrap">
                  <span className="exp-company">{e.company}</span>
                  <span className="exp-location">{e.location}</span>
                </div>
                <ul className="exp-points">
                  {e.points.map((pt, j) => (
                    <li key={j} dangerouslySetInnerHTML={{ __html: pt }} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── Hackathons ───────────────────────────────────── */}
        <section id="achievements" className="hackathons-section">
          <div className="section-label">Competition Record</div>
          <h2 className="section-title">Hackathon <span className="accent">Wins</span></h2>

          <div className="hackathons-grid">
            {hackathons.map((h, i) => (
              <div key={i} className={`hackathon-card ${h.tier}`}>
                <div className="hackathon-card-glow">
                  <div className="hackathon-rank-badge">{h.emoji}</div>
                  <div className="hackathon-rank-text">{h.rank}</div>
                  <h3 className="hackathon-title">{h.title}</h3>
                  <p className="hackathon-detail">{h.detail}</p>
                  <div className="hackathon-footer">
                    <span className="hackathon-prize">{h.prize}</span>
                    {h.videos && h.videos.length > 0 && (
                      <div className="hackathon-videos">
                        {h.videos.map((v, j) => (
                          <a key={j} href={v.url} target="_blank" rel="noopener noreferrer" className="hackathon-video-link">
                            ▶ {v.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Research ─────────────────────────────────────── */}
        <section id="research" className="research-section">
          <div className="section-label">Publications</div>
          <h2 className="section-title">Research <span className="accent">Papers</span></h2>

          <div className="research-grid">
            {researchData.map((r, i) => (
              <div key={i} className="research-card" onClick={() => setSelectedResearch(r)}>
                <div className="research-status">
                  <span className="research-status-dot" /> {r.status}
                </div>
                <h3 className="research-title">{r.title}</h3>
                <p className="research-journal">{r.journal}</p>
                <div className="research-footer">
                  <span className={`research-author-chip ${r.citations === 'First Author' ? 'first' : ''}`}>{r.citations}</span>
                  <span className="research-author-chip">{r.year}</span>
                  {r.impactFactor && <span className="research-author-chip">IF: {r.impactFactor}</span>}
                  <span className="item-arrow">→</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Kaggle ───────────────────────────────────────── */}
        <section className="kaggle-section">
          <div className="section-label">Competitive ML</div>
          <h2 className="section-title">Kaggle <span className="accent-cyan">Record</span></h2>

          <div className="kaggle-list">
            {kaggleData.map((k, i) => (
              <div key={i} className="kaggle-item" onClick={() => setSelectedKaggle(k)}>
                <div className="kaggle-rank-wrap">
                  <div className={`kaggle-rank${k.ongoing ? ' ongoing' : ''}`}>{k.rank}</div>
                  <div className="kaggle-bar"><div className="kaggle-bar-fill" style={{ width: `${k.rankPct}%` }} /></div>
                </div>
                <div className="kaggle-info">
                  <h3>{k.competition}</h3>
                  <span className={`kaggle-type${k.ongoing ? ' ongoing-tag' : ''}`}>
                    {k.ongoing ? '🟢 LIVE — ' : ''}{k.type}
                  </span>
                </div>
                <span className="item-arrow">→</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Community ────────────────────────────────────── */}
        <section className="community-section">
          <div className="section-label">Leadership</div>
          <h2 className="section-title">Community <span className="accent">Impact</span></h2>

          <div className="community-grid">
            {communityData.map((c, i) => (
              <div key={i} className="community-card" onClick={() => setSelectedCommunity(c)}>
                <h3>{c.role}</h3>
                <p>{c.detail}</p>
                <div className="community-impacts">
                  {c.impact.map((imp, j) => <span key={j} className="impact-chip">{imp}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Skills ───────────────────────────────────────── */}
        <section id="skills" className="skills-section">
          <div className="section-label">Tech Stack</div>
          <h2 className="section-title">Technical <span className="accent">Skills</span></h2>

          <div className="skills-list">
            {skills.map((s, i) => (
              <div key={i} className="skill-row">
                <span className="skill-category">{s.category}</span>
                <div className="skill-items">
                  {s.items.map((item, j) => <span key={j} className="skill-item">{item}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer ───────────────────────────────────────── */}
        <footer id="contact" className="footer">
          <div className="marquee-strip">
            <div className="marquee-inner">
              {[...Array(4)].map((_, i) => (
                <span key={i} className="marquee-text">
                  AI Engineer <span className="marquee-sep">·</span>
                  ML Researcher <span className="marquee-sep">·</span>
                  Open to Work <span className="marquee-sep">·</span>
                  Graduating May 2026 <span className="marquee-sep">—</span>
                </span>
              ))}
            </div>
          </div>

          <div className="footer-cta">
            <div>
              <div className="footer-cta-label">Let's Collaborate</div>
              <h2 className="footer-cta-title">
                Open to <span className="hl">AI Engineer</span>,<br />
                Applied ML & Data Science roles
              </h2>
              <p className="footer-cta-sub">Joining Interview Kickstart June 2026 · Pursuing Master's in AI/ML abroad</p>
            </div>
            <div className="footer-contacts">
              <a href="mailto:roybishal9989@gmail.com" className="footer-contact-link">
                <span className="footer-contact-label">Email</span>
                <span className="footer-contact-value">roybishal9989@gmail.com</span>
              </a>
              <a href="https://github.com/roybishal362" target="_blank" rel="noopener noreferrer" className="footer-contact-link">
                <span className="footer-contact-label">GitHub</span>
                <span className="footer-contact-value">github.com/roybishal362</span>
              </a>
              <a href="https://www.linkedin.com/in/bishal-roy-5410b5257/" target="_blank" rel="noopener noreferrer" className="footer-contact-link">
                <span className="footer-contact-label">LinkedIn</span>
                <span className="footer-contact-value">linkedin.com/in/bishal-roy</span>
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 Bishal Roy — AI & ML Engineer</span>
            <div className="footer-links">
              <a href="https://www.linkedin.com/in/bishal-roy-5410b5257/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://github.com/roybishal362" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="mailto:roybishal9989@gmail.com">Email</a>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
