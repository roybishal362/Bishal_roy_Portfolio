// ---------------------------------------------------------------------------
// Bishal Roy — knowledge base. Sourced from the real project repos + résumé.
// This is the single source of truth for the AI chat AND the project pages.
// Keep it TRUE and interview-defensible.
// ---------------------------------------------------------------------------

export const PROFILE = {
  name: "Bishal Roy",
  role: "Applied ML / AI Engineer",
  location: "Pune, India — open to remote (India + international)",
  email: "roybishal9989@gmail.com",
  phone: "+91 97651 08054",
  github: "https://github.com/roybishal362",
  linkedin: "https://www.linkedin.com/in/bishal-roy-5410b5257/",
  education:
    "B.E. in Artificial Intelligence & Data Science, Dr. D. Y. Patil Institute of Technology, Pune — graduated, aggregate CGPA 8.99/10 across all 8 semesters (9.55/10 in the final semester)",
  summary:
    "Applied ML / AI Engineer who specialises in production Generative AI — multi-agent systems, retrieval-augmented generation (RAG), and LLM fine-tuning. Ships grounded, cited, low-latency systems, not demos. Signature: making AI that refuses to hallucinate.",
};

// Semester-wise CGPA (B.E. AI & Data Science, DYPIT Pune). Aggregate 8.99/10.
export const SEMESTER_CGPA: { sem: string; year: string; cgpa: string }[] = [
  { sem: "I", year: "1st year", cgpa: "9.00" },
  { sem: "II", year: "1st year", cgpa: "8.66" },
  { sem: "III", year: "2nd year", cgpa: "8.82" },
  { sem: "IV", year: "2nd year", cgpa: "8.89" },
  { sem: "V", year: "3rd year", cgpa: "8.48" },
  { sem: "VI", year: "3rd year", cgpa: "8.90" },
  { sem: "VII", year: "4th year", cgpa: "9.25" },
  { sem: "VIII", year: "4th year", cgpa: "9.55" },
];

export interface Metric { label: string; value: string; }
export interface ProjectLinks { repo?: string; demo?: string; video?: string; api?: string; bot?: string; }

export interface Project {
  id: string;
  name: string;
  tagline: string;
  event: string;
  year: string;
  accent: string; // per-project theme hue
  tags: string[];
  stack: string[];
  problem: string;
  approach: string;
  architecture: string;
  highlights: string[];
  metrics: Metric[];
  links: ProjectLinks;
  image?: string;  // real screenshot/hero pulled from the project's own repo
}

export const PROJECTS: Project[] = [
  {
    id: "kakehashi",
    name: "Kakehashi",
    tagline: "An AI that guides Indian workers to Japan — grounded, cited, scam-proof.",
    event: "FAR AWAY 2026 Hackathon (International) · Solo build",
    year: "2026",
    accent: "#FF6B6B",
    tags: ["Multi-Agent", "RAG", "Groq", "Next.js"],
    stack: ["Python 3.12", "FastAPI", "Next.js", "TypeScript", "BM25 RAG", "Groq (gpt-oss-120b)", "Fernet AES-128", "Server-Sent Events", "GitHub Actions"],
    problem:
      "India and Japan agreed to move 50,000 skilled Indian workers to Japan over five years. Workers face a maze of visas, tests, employers and costs — and scam middlemen exploit the information gap.",
    approach:
      "Kakehashi turns a resume/profile into a personalised, citation-backed migration plan. An LLM Router picks the visa pathway (SSW / Engineer / Specialist); six specialist agents (Pathway, Jobs, Procedure, Prep, Journey, Synthesis) build the plan; a BM25 RAG layer grounds every claim in official SSW / MOFA sources; a verification layer refuses to fabricate and labels anything it can't source.",
    architecture:
      "Next.js on Vercel + FastAPI on Render with Server-Sent Events streaming a live agent timeline. Groq gpt-oss-120b with automatic key failover, Fernet AES-128 PII encryption, live jobs via the JSearch API, and a 22-test CI pipeline.",
    highlights: [
      "Grounded-vs-ungrounded evaluation documented in a reproducible PROOF.md.",
      "Live job matching ranked by candidate fit; salary + cost estimation.",
      "Multilingual (English / Hindi / Japanese) with an encrypted PDF 'Migration Dossier' export.",
      "Honest degradation — cached data is transparently labelled when live APIs are down.",
    ],
    metrics: [
      { label: "grounded accuracy", value: "51% vs 4%" },
      { label: "hallucinations", value: "0 vs 69" },
      { label: "official facts tested", value: "22" },
      { label: "specialist agents", value: "6" },
    ],
    links: {
      repo: "https://github.com/roybishal362/Kakehashi",
      demo: "https://kakehashi-4e1v.vercel.app/",
      video: "https://youtu.be/OtaC-AKZvlE",
      api: "https://far-away-hackthon.onrender.com",
    },
    image: "/projects/kakehashi.webp",
  },
  {
    id: "c-trust",
    name: "C-TRUST",
    tagline: "Seven agents that watch clinical-trial data quality — and one that referees them.",
    event: "Novartis NEST 2.0 Hackathon · National Semifinalist (Top 30)",
    year: "2025",
    accent: "#4C8DFF",
    tags: ["Multi-Agent", "FastAPI", "Property-based Testing"],
    stack: ["Python 3.10", "FastAPI", "Pandas", "Pydantic", "Groq", "React 18", "TypeScript", "Vite", "Recharts", "Hypothesis"],
    problem:
      "Clinical trials generate fragmented data across EDC, SAE dashboards, coding and query systems. Quality issues stay hidden until they hit regulatory submissions or patient safety, and teams must watch 20+ concurrent studies at once.",
    approach:
      "Seven specialist agents each score one risk dimension and combine through weighted consensus — the Safety & Compliance agent carries 3.0x weight, Query and Completeness 1.5x, others 1.2x — and they abstain gracefully when data is insufficient rather than guessing. A Guardian meta-agent monitors cross-agent consistency and anomalies. Everything rolls up into a Data Quality Index (0–100 across six weighted dimensions) with Green/Amber/Orange/Red bands.",
    architecture:
      "Python / FastAPI / Pandas / Groq backend with automatic OpenAPI docs; React 18 + TypeScript + Vite + Recharts dashboard; multi-layer caching (backend file cache, React Query, localStorage). Ingests real NEST 2.0 Excel files with no synthetic fallback.",
    highlights: [
      "331 tests including 40+ property-based tests (Hypothesis) for algorithm correctness.",
      "Analyses a study in ~300ms; processes all 23 studies in 2–3 minutes with parallel agents.",
      "Guardian oversight with anomaly detection and DQI–consensus alignment checks.",
      "Explicitly abstains and states limitations rather than guessing when data is missing.",
    ],
    metrics: [
      { label: "specialist agents", value: "7" },
      { label: "Safety agent weight", value: "3.0×" },
      { label: "tests (incl. property-based)", value: "331" },
      { label: "latency / study", value: "~300ms" },
    ],
    links: { repo: "https://github.com/roybishal362/NEST_2.0_Hackthon" },
  },
  {
    id: "vayunetra",
    name: "VayuNetra",
    tagline: "Urban air quality: monitor → predict → attribute → act.",
    event: "ET AI Hackathon 2.0 (Smart Cities / Environmental Intelligence)",
    year: "2026",
    accent: "#2DD4BF",
    tags: ["Forecasting", "Geospatial", "LLM"],
    stack: ["Python 3.12", "FastAPI", "scikit-learn", "Next.js 15", "TypeScript", "MapLibre GL", "Recharts", "Groq"],
    problem:
      "Indian cities have hundreds of air-quality sensors but no forecasting, no source attribution, and no guidance for citizens or enforcement officers — just current numbers on a dashboard.",
    approach:
      "A four-stage platform. Forecasting predicts PM2.5 1–72 hours ahead with a HistGradientBoostingRegressor, blended with a persistence baseline to guarantee it never does worse, plus calibrated uncertainty bands. Attribution fuses four independent signals (chemistry, particle size, upwind fires, meteorology) into a confidence-scored source breakdown. LLM agents write multilingual health advisories and generate an enforcement priority queue with an ROI optimiser.",
    architecture:
      "FastAPI backend answering in ~30ms via stale-while-revalidate caching; Next.js 15 + MapLibre GL 3D command centre + Recharts. Data from Open-Meteo / CAMS, NASA FIRMS (fires) and OpenStreetMap; Groq LLM behind a circuit breaker; a Telegram bot delivering advisories in six regional languages.",
    highlights: [
      "Forecast beats baseline by 27–50% on 9,600+ held-out samples.",
      "Attribution validated at 84.5% average agreement with peer-reviewed receptor studies (Mumbai 94%).",
      "Batch multi-coordinate pulls cut data latency from ~80s to ~2s per city.",
      "What-if source-reduction simulator and a validation page proving skill on hold-out data.",
    ],
    metrics: [
      { label: "cities covered", value: "6" },
      { label: "forecast horizon", value: "72h" },
      { label: "RMSE gain vs baseline", value: "27–50%" },
      { label: "attribution agreement", value: "84.5%" },
    ],
    links: {
      repo: "https://github.com/roybishal362/VayuNetra-Urban-Air-Quality-Intelligence",
      demo: "https://vayu-netra-urban-air-quality-intell.vercel.app",
      api: "https://vayunetra-api.onrender.com/docs",
      bot: "https://t.me/VayuNetraBot",
    },
    image: "/projects/vayunetra.png",
  },
  {
    id: "cricket",
    name: "Cricket Scouting Intelligence",
    tagline: "Predicting which uncapped cricketers earn a national cap.",
    event: "Rajasthan Royals SuperRR Selector Hackathon · Rank 4 / 7,599 (solo)",
    year: "2025",
    accent: "#EC6EA8",
    tags: ["ML", "Feature Engineering", "Sports Analytics"],
    stack: ["Python", "Pandas", "NumPy", "LightGBM", "scikit-learn (KMeans)", "EWMA", "Plotly"],
    problem:
      "3,738 uncapped Indian cricketers compete for a handful of national spots. Traditional scouting is subjective and regionally biased, and raw merit ranking structurally favours batsmen — one baseline surfaced 38 batsmen and only 2 bowlers in the top 40.",
    approach:
      "A Cricket Likelihood Engine blends 80% cricket-domain intelligence (phase-wise strike rates, trajectory slopes, consistency) with 20% ML validation (LightGBM) over 84 engineered features — because the 284-player training set is too small for pure ML. K-Means (k=9) creates player archetypes mirroring IPL squad roles, and role-normalised scoring plus position quotas (25 batsmen / 10 bowlers / 5 all-rounders) fixes the structural bowler bias.",
    architecture:
      "End-to-end pipeline over 602,992 ball-by-ball domestic T20 records: feature engineering notebook, EDA + archetype validation, and a production ML pipeline script.",
    highlights: [
      "Trajectory score > 90 correlates with capping within 6–12 months (e.g. Rinku, Arshdeep).",
      "Identified regional talent arbitrage in Assam / the Northeast.",
      "Rajasthan Royals featured the work in a two-part documentary.",
    ],
    metrics: [
      { label: "national rank", value: "4 / 7,599" },
      { label: "LightGBM AUC", value: "0.614 ± 0.04" },
      { label: "clustering silhouette", value: "0.329" },
      { label: "ball-by-ball records", value: "602,992" },
    ],
    links: { repo: "https://github.com/roybishal362/Rajasthan-Royals-SuperSelector-Cricket-Scouting-Intelligence-System-" },
  },
  {
    id: "amazon-ml",
    name: "Smart Product Pricing",
    tagline: "Multimodal price prediction from product text + images.",
    event: "Amazon ML Challenge 2025",
    year: "2025",
    accent: "#F5A623",
    tags: ["Multimodal", "Ensemble", "Pseudo-labeling"],
    stack: ["Python", "LightGBM", "XGBoost", "TensorFlow (EfficientNetB0)", "scikit-learn"],
    problem:
      "Predict e-commerce product prices from product text and images alone — external price lookups strictly prohibited — across 75,000 products.",
    approach:
      "A multimodal feature stack of 1,742 dimensions: TF-IDF text (30,000 features reduced to 300 via SVD), EfficientNetB0 image embeddings (1,280-dim), brand target-encoding (9,441 brands) and engineered numeric features. A LightGBM (3,000) + XGBoost (2,500) ensemble (5% / 95%) is trained, then conservative pseudo-labeling on the middle-50% of test predictions retrains it.",
    architecture:
      "GPU-accelerated 5-fold cross-validation (±0.14% stability); log-transformed targets; mean-embedding for missing images; caching to accelerate experimentation.",
    highlights: [
      "Pseudo-labeling alone improved CV SMAPE by 6.57 points (44.94% → 38.37%).",
      "Trained on 71,824 original + 15,000 pseudo-labeled = 86,824 samples in ~4.5h on dual T4 GPUs.",
    ],
    metrics: [
      { label: "local SMAPE", value: "36.0%" },
      { label: "public SMAPE", value: "39.0%" },
      { label: "baseline SMAPE", value: "46–48%" },
      { label: "feature dimensions", value: "1,742" },
    ],
    links: { repo: "https://github.com/roybishal362/Amazon_ML_2025" },
  },
  {
    id: "piu",
    name: "Problematic Internet Use",
    tagline: "Predicting problematic internet use severity in adolescents.",
    event: "Kaggle · Child Mind Institute · basis of a first-author paper (under review, JAIR)",
    year: "2025",
    accent: "#9B7BFF",
    tags: ["Research", "XGBoost", "Health"],
    stack: ["Python", "XGBoost", "scikit-learn", "SMOTE", "Jupyter"],
    problem:
      "Detect early signs of problematic internet use (PIU) severity — an ordinal 0–3 target — in adolescents, from wrist-accelerometer activity, fitness metrics and questionnaire responses.",
    approach:
      "Quadratic-Weighted-Kappa-optimised ordinal modeling. A Random Forest baseline is improved into a tuned XGBoost with KNN imputation, one-hot encoding, activity/temporal feature engineering, SMOTE for class imbalance and GridSearchCV.",
    architecture:
      "Two Jupyter notebooks documenting iterative improvement from preprocessing sophistication and feature engineering; the work is the basis of a first-author paper under review at the Journal of Artificial Intelligence Research (JAIR).",
    highlights: [
      "Physical-activity metrics (average daily steps, sedentary time) were the strongest predictors.",
      "Formalised into a first-author research paper (under review).",
    ],
    metrics: [
      { label: "QWK (validation)", value: "0.62 → 0.71" },
      { label: "QWK (test)", value: "0.69" },
      { label: "Kaggle rank", value: "1182 / 3559" },
    ],
    links: { repo: "https://github.com/roybishal362/Efficient-Ensemble-Based-Predictive-System-for-Child-Mental-Health-Assessment-" },
  },
];

export interface Experience { org: string; role: string; period: string; bullets: string[]; }

export const EXPERIENCE: Experience[] = [
  {
    org: "Interview Kickstart",
    role: "Associate AI Product Manager Intern",
    period: "Apr 2026 – Present · Remote",
    bullets: [
      "Built a GenAI evaluation pipeline scoring live-class recordings/transcripts against ratings via LLM scoring, routing feedback through human-in-the-loop review — average instructor rating rose 4.2 → 4.6 in 8 weeks.",
      "Automated the weekly instructor-ops workflow in Python across 40+ instructors (~87% less manual effort).",
      "Architected an AI/ML curriculum of 12 modules across 4 tracks for 150+ learners per cohort.",
    ],
  },
  {
    org: "CloudCredits",
    role: "AI Engineer Intern",
    period: "Jul 2025 – Oct 2025 · Remote",
    bullets: [
      "Built and deployed financial risk models (XGBoost, Random Forest) on 5M+ transaction records at 89% accuracy, cutting false positives 34% in a live production environment.",
      "Engineered a feature-extraction pipeline over 3.2M customer records, deriving 12 risk indicators (+27% precision).",
    ],
  },
  {
    org: "AICTE",
    role: "AI Engineer Intern",
    period: "Nov 2024 – Dec 2024 · Remote",
    bullets: [
      "Fine-tuned a 7B open-source LLM (LLaMA-2) with LoRA adapters on 50K Q&A pairs (accuracy 72% → 91%).",
      "Delivered 8 GenAI / LLM / RAG workshops to 600+ faculty across 15 institutions.",
    ],
  },
];

export const ACHIEVEMENTS = [
  "Smart India Hackathon 2024 — All India Rank 2 (Runner-Up) among 49,000+ teams for Mudra, an AI Indian Sign Language platform (TensorFlow + MediaPipe), Ministry of Justice.",
  "BirdCLEF 2026 (Kaggle) — Top 10% globally on 234-species bioacoustic classification (Google Perch v2 embeddings + Bayesian prior fusion, macro ROC-AUC 0.910).",
  "Research — First author, 'Predicting Problematic Internet Use in Children via QWK Optimization & Multi-Modal Feature Engineering' (under review, JAIR); Co-author, 'Real-Time Indian Sign Language Translation using Deep Learning' (under review, Pattern Recognition, Elsevier).",
  "GDG AI/ML Co-Lead — delivered 8 workshops on GenAI/LLMs/RAG to 400+ developers (92% satisfaction).",
];

// Every competition / hackathon with placement (the "trophy wall").
// `confirmed: false` = Bishal still needs to verify the placement.
export interface Competition {
  event: string;
  rank: string;
  scope: string;
  accent: string;
  project: string;
  blurb: string;
  link?: string;
  confirmed: boolean;
}

export const COMPETITIONS: Competition[] = [
  { event: "Smart India Hackathon 2024", rank: "AIR 2", scope: "Runner-Up · 49,000+ teams", accent: "#F5C542", project: "Mudra", blurb: "AI-powered Indian Sign Language platform (TensorFlow + MediaPipe) for the Ministry of Justice.", confirmed: true },
  { event: "Novartis NEST 2.0", rank: "Top 30", scope: "National Semifinalist", accent: "#4C8DFF", project: "C-TRUST", blurb: "7-agent clinical-trial data-quality system with weighted consensus and a Guardian meta-agent.", link: "https://github.com/roybishal362/NEST_2.0_Hackthon", confirmed: true },
  { event: "Rajasthan Royals SuperRR Selector", rank: "Rank 4", scope: "7,599 teams · solo", accent: "#EC6EA8", project: "Cricket Scouting Intelligence", blurb: "Capping-likelihood engine over 602,992 ball-by-ball records — featured in an RR documentary.", link: "https://github.com/roybishal362/Rajasthan-Royals-SuperSelector-Cricket-Scouting-Intelligence-System-", confirmed: true },
  { event: "Amazon ML Challenge 2025", rank: "Top 8%", scope: "10,000+ teams", accent: "#F5A623", project: "Smart Product Pricing", blurb: "Multimodal price prediction — SMAPE 36% local / 39% public vs 46–48% baseline.", link: "https://github.com/roybishal362/Amazon_ML_2025", confirmed: false },
  { event: "BirdCLEF 2026 · Kaggle", rank: "Top 10%", scope: "global · ongoing", accent: "#2DD4BF", project: "Bioacoustic classification", blurb: "234-species classification with Google Perch v2 embeddings + Bayesian prior fusion (ROC-AUC 0.910).", confirmed: false },
  { event: "Far Away Hackathon (International)", rank: "Global", scope: "placement TBD", accent: "#FF6B6B", project: "Kakehashi", blurb: "Grounded multi-agent immigration guide (India → Japan): 51% vs 4% accuracy, 0 hallucinations.", link: "https://github.com/roybishal362/Kakehashi", confirmed: false },
  { event: "ET AI Hackathon 2.0", rank: "Built", scope: "placement TBD", accent: "#9B7BFF", project: "VayuNetra", blurb: "Urban air-quality intelligence: forecasting + source attribution + advisories across 6 cities.", link: "https://github.com/roybishal362/VayuNetra-Urban-Air-Quality-Intelligence", confirmed: false },
  { event: "Kaggle · Child Mind Institute", rank: "1182 / 3559", scope: "Problematic Internet Use", accent: "#9B7BFF", project: "PIU severity", blurb: "QWK 0.62 → 0.71; basis of a first-author paper under review at JAIR.", link: "https://github.com/roybishal362/Efficient-Ensemble-Based-Predictive-System-for-Child-Mental-Health-Assessment-", confirmed: true },
];

// From LinkedIn — Bishal to provide (name, issuer, date, credential URL).
export interface Certification { name: string; issuer: string; date?: string; link?: string; }
export const CERTIFICATIONS: Certification[] = [];

export const SKILLS: { group: string; items: string[] }[] = [
  { group: "GenAI & LLMs", items: ["Multi-Agent Systems", "RAG (BM25 / FAISS / ChromaDB)", "LangChain", "LoRA / QLoRA fine-tuning", "HuggingFace Transformers", "Groq", "Prompt Engineering"] },
  { group: "ML & DL", items: ["PyTorch", "TensorFlow", "scikit-learn", "XGBoost", "LightGBM", "CatBoost", "Optuna", "Ensemble methods"] },
  { group: "MLOps & Deploy", items: ["FastAPI", "Docker", "Git", "CI/CD", "MLflow", "Weights & Biases", "Vercel", "Render"] },
  { group: "Data", items: ["Pandas", "NumPy", "Feature Engineering", "Statistical Analysis", "PySpark (basic)"] },
  { group: "Languages", items: ["Python", "SQL", "TypeScript"] },
];
