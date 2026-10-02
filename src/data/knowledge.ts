// ---------------------------------------------------------------------------
// Bishal Roy — knowledge base. Sourced from the real project repos + résumé.
// This is the single source of truth for the AI chat AND the project pages.
// Keep it TRUE and interview-defensible.
//
// Last aligned with the final résumés and the fact-check on 2 Oct 2026
// (Job-Switch-2026/00-SOURCE-OF-TRUTH.md). Rules that came out of that check:
//   - Title at Interview Kickstart is "Associate Product Manager Intern". Never "Applied AI Engineer" there, never full-time.
//   - "Full end-to-end ownership", never "sole engineer".
//   - The Interview Kickstart pipeline is "multi-stage", not "multi-agent".
//   - Never restore: "31% more issues with video", "4.2 to 4.6", "87% less manual effort", "72% to 91%", "ongoing" for RSNA.
// ---------------------------------------------------------------------------

export const PROFILE = {
  name: "Bishal Roy",
  role: "Applied AI Engineer",
  location: "Pune, India — open to relocation and remote (India + international)",
  email: "roybishal9989@gmail.com",
  phone: "+91 97651 08054",
  github: "https://github.com/roybishal362",
  linkedin: "https://www.linkedin.com/in/bishal-roy-5410b5257/",
  education:
    "B.E. in Artificial Intelligence & Data Science, Dr. D. Y. Patil Institute of Technology, Pune — graduated 2026, aggregate CGPA 8.99/10 across all 8 semesters (9.55/10 in the final semester)",
  summary:
    "Took full end-to-end ownership of a live LLM platform at Interview Kickstart: design, build, deployment, evaluation and cost. Builds LLM pipelines, RAG and AI agents, and competes on Kaggle. Runner-up at the Grand Finale of Smart India Hackathon 2024, 4th place nationally in the Rajasthan Royals hackathon, top 8% in the Amazon ML Challenge.",
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
export interface ProjectLinks { repo?: string; demo?: string; video?: string; api?: string; bot?: string; extra?: { label: string; url: string }[]; }

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
  art?: string;    // drawn hero illustration (scripts/make_project_art.py), used when there is no real screenshot
  icon?: string;   // line-art icon (Lucide, ISC) in public/projects/icons
  featured?: boolean; // shown in the "30-second version" on the home page
  proof?: string;     // one line for the home page card: the result, in plain words
}

export const PROJECTS: Project[] = [
  {
    id: "ik-platform",
    icon: "/projects/icons/ik-platform.svg",
    art: "/projects/art/ik-platform.svg",
    name: "Feedback Loop",
    tagline: "Every class scored; every weak class reviewed by an AI that shows its evidence.",
    event: "Interview Kickstart · full end-to-end ownership (internal, in pilot)",
    year: "2026",
    accent: "#7C5CFF",
    tags: ["Production LLM", "FastAPI", "PostgreSQL", "Next.js"],
    stack: ["Python", "FastAPI", "Docker", "PostgreSQL (row-level security)", "Next.js", "TypeScript", "Claude API (long context + vision)", "pytest", "GitHub Actions"],
    featured: true,
    proof: "Turns a 4-hour class into instructor feedback in about 9 minutes for about $1.",
    problem:
      "Learners rate every class, but the ratings sat in a spreadsheet and each programme manager read them their own way, so 'how is this class doing?' had no shared answer. When a class went badly, useful feedback meant watching a long recording and writing notes by hand, so it happened late or not at all.",
    approach:
      "Two halves. First, every rated class is pulled in and scored the same way, three times a day, and the weakest are queued for review. Second, a multi-stage LLM pipeline reads the class: it maps the whole session first (who is teaching, what was asked, what got answered later), then reads it in 30-minute windows, flags only problems it can back with a quote and a timestamp, and runs a second, deliberately sceptical pass that can soften or drop a finding but never invent one. A programme manager edits and approves every note; nothing is sent automatically.",
    architecture:
      "A Python/FastAPI worker in Docker runs the scheduled sync and the AI analysis; a Next.js app gives every course its own workspace; PostgreSQL holds everything behind row-level security. The scoring rule lives in one versioned SQL function that the Python and TypeScript copies are tested against with 120 shared cases, so the numbers can never disagree. Jobs are re-queued after a restart, and syncs only write the rows that changed.",
    highlights: [
      "A 4-hour class becomes evidence-backed instructor feedback in about 9 minutes for about $1, and a person approves every note.",
      "Built for a team of about 100 programme managers, in pilot since July 2026: saves an estimated 3 days a week of watching class recordings and writing feedback by hand.",
      "Raised vision accuracy from 84% to 99% by testing against a labelled answer key and sending one frame per call.",
      "Cut LLM cost 11% on long classes by tracing a 4x rise in output tokens and caching the shared prompt block.",
      "Cut one-vote verdict flips from 31% to 13% of classes with a perturbation test on 2,784 real classes and a minimum-response rule.",
      "Made the data sync 25x faster (9 minutes to about 20 seconds) and fixed a defect that mislabelled 67% of class records.",
      "600+ automated tests, plus SQL contract tests that run the scoring function against shared cases.",
    ],
    metrics: [
      { label: "to draft feedback on a 4-hour class", value: "~9 min" },
      { label: "vision accuracy", value: "84% → 99%" },
      { label: "classes scored, three times a day", value: "3,000+" },
      { label: "automated tests", value: "600+" },
    ],
    links: {},
  },
  {
    id: "kakehashi",
    icon: "/projects/icons/kakehashi.svg",
    name: "Kakehashi",
    tagline: "An AI that guides Indian workers to Japan — grounded, cited, scam-proof.",
    event: "FAR AWAY 2026 hackathon · Finalist, rank 14 · solo build",
    year: "2026",
    accent: "#FF6B6B",
    tags: ["Multi-Agent", "RAG", "Groq", "Next.js"],
    stack: ["Python 3.12", "FastAPI", "Next.js", "TypeScript", "BM25 RAG", "Groq (gpt-oss-120b)", "Fernet AES-128", "Server-Sent Events", "GitHub Actions"],
    featured: true,
    proof: "6 agents with RAG and live tools: 0 contradicted facts in 6 evaluation runs, against 69 without grounding.",
    problem:
      "India and Japan agreed to move 50,000 skilled Indian workers to Japan over five years. Workers face a maze of visas, tests, employers and costs — and scam middlemen exploit the information gap.",
    approach:
      "Kakehashi turns a resume/profile into a personalised, citation-backed migration plan. An LLM router picks the visa pathway (SSW / Engineer / Specialist); six specialist agents (Pathway, Jobs, Procedure, Prep, Journey, Synthesis) build the plan and call live tools for jobs, Japanese government statistics and flights; a BM25 RAG layer grounds every claim in official SSW / MOFA sources; a verification layer refuses to fabricate and labels anything it can't source.",
    architecture:
      "Next.js on Vercel + FastAPI on Render with Server-Sent Events streaming a live agent timeline. Groq gpt-oss-120b with automatic key failover, Fernet AES-128 PII encryption, live jobs via the JSearch API, and a 22-test CI pipeline.",
    highlights: [
      "Measured, not claimed: on 22 official facts across 6 runs, grounded answers contradicted 0 facts; the same LLM without sources contradicted 69. Reproducible from PROOF.md.",
      "Live job matching ranked by candidate fit; salary + cost estimation.",
      "Multilingual (English / Hindi / Japanese) with an encrypted PDF 'Migration Dossier' export.",
      "Honest degradation — cached data is transparently labelled when live APIs are down.",
    ],
    metrics: [
      { label: "contradicted facts (6 runs)", value: "0 vs 69" },
      { label: "fact recall vs plain LLM", value: "51% vs 4%" },
      { label: "official facts tested", value: "22" },
      { label: "specialist agents", value: "6" },
    ],
    links: {
      repo: "https://github.com/roybishal362/Kakehashi",
      demo: "https://kakehashi-4e1v.vercel.app/",
      video: "https://youtu.be/OtaC-AKZvlE",
    },
    image: "/projects/kakehashi.webp",
  },
  {
    id: "c-trust",
    icon: "/projects/icons/c-trust.svg",
    art: "/projects/art/c-trust.svg",
    name: "C-TRUST",
    tagline: "Specialist agents that score clinical-trial data quality, with a referee that checks they agree.",
    event: "Novartis NEST 2.0 (2025-26) · National Semifinalist",
    year: "2025",
    accent: "#4C8DFF",
    tags: ["Multi-Agent", "FastAPI", "Property-based Testing"],
    stack: ["Python 3.10", "FastAPI", "Pandas", "Pydantic", "React 18", "TypeScript", "Vite", "Recharts", "Hypothesis"],
    featured: true,
    proof: "A rule-based multi-agent risk engine for clinical-trial data, backed by 550+ passing tests.",
    problem:
      "Clinical trials generate fragmented data across EDC, SAE dashboards, coding and query systems. Quality issues stay hidden until they hit regulatory submissions or patient safety, and teams must watch 20+ concurrent studies at once.",
    approach:
      "Eight rule-based specialist agents each score one risk dimension and combine through a weighted consensus — the Safety & Compliance agent carries 3.0x weight. The agents are deterministic on purpose: in safety scoring the same data must give the same answer, with a reason. A consistency check then looks across the agents' outputs for contradictions. Everything rolls up into a risk score from 0 to 100 with Green/Amber/Orange/Red bands.",
    architecture:
      "Python / FastAPI / Pandas backend with automatic OpenAPI docs; React 18 + TypeScript + Vite + Recharts dashboard; multi-layer caching (backend file cache, React Query, localStorage). Ingests real NEST 2.0 Excel files with no synthetic fallback.",
    highlights: [
      "550+ passing tests, 130+ of them property-based (Hypothesis) for algorithm correctness.",
      "Runs across all 23 studies in the real NEST 2.0 data.",
      "Deterministic scoring: no LLM in the risk score, so every result can be traced to a rule.",
      "A consistency check across the agents' outputs flags contradictions.",
    ],
    metrics: [
      { label: "rule-based agents", value: "8" },
      { label: "passing tests", value: "550+" },
      { label: "Safety agent weight", value: "3.0×" },
      { label: "studies analysed", value: "23" },
    ],
    links: { repo: "https://github.com/roybishal362/NEST_2.0_Hackthon" },
  },
  {
    id: "amazon-ml",
    icon: "/projects/icons/amazon-ml.svg",
    art: "/projects/art/amazon-ml.svg",
    name: "Smart Product Pricing",
    tagline: "Multimodal price prediction from product text + images.",
    event: "Amazon ML Challenge 2025 · Top 8% on the final leaderboard · team (I designed the pipeline)",
    year: "2025",
    accent: "#F5A623",
    tags: ["Multimodal", "Ensemble", "Pseudo-labeling"],
    stack: ["Python", "LightGBM", "XGBoost", "TensorFlow (EfficientNetB0)", "scikit-learn"],
    featured: true,
    proof: "Top 8% on the final leaderboard with a multimodal text + image pipeline I designed.",
    problem:
      "Predict e-commerce product prices from product text and images alone — external price lookups strictly prohibited — across 75,000 products.",
    approach:
      "A multimodal feature stack of 1,742 dimensions: TF-IDF text (30,000 features reduced to 300 via SVD), EfficientNetB0 image embeddings (1,280-dim), brand target-encoding (9,441 brands) and engineered numeric features. A LightGBM + XGBoost ensemble is trained, then conservative pseudo-labeling on the middle 50% of test predictions retrains it.",
    architecture:
      "GPU-accelerated training on dual T4s; log-transformed targets; mean-embedding for missing images; caching to accelerate experimentation.",
    highlights: [
      "Top 8% on the final leaderboard.",
      "Conservative pseudo-labeling: 15,000 test predictions from the middle of the price range added back as training rows.",
      "Text, image and brand signals fused into one 1,742-dimension feature stack.",
    ],
    metrics: [
      { label: "final leaderboard (team)", value: "Top 8%" },
      { label: "products", value: "75K" },
      { label: "feature dimensions", value: "1,742" },
    ],
    links: { repo: "https://github.com/roybishal362/Amazon_ML_2025" },
  },
  {
    id: "cricket",
    icon: "/projects/icons/cricket.svg",
    art: "/projects/art/cricket.svg",
    name: "Cricket Scouting Intelligence",
    tagline: "Finding which uncapped cricketers deserve a look, from ball-by-ball data.",
    event: "Rajasthan Royals SupeRR Selector Hackathon 2025 · 4th place nationally (top 8 at the finale; 7,500+ participants, solo)",
    year: "2025",
    accent: "#EC6EA8",
    tags: ["ML", "Feature Engineering", "Sports Analytics"],
    stack: ["Python", "Pandas", "NumPy", "LightGBM", "scikit-learn (KMeans)", "Plotly"],
    featured: true,
    proof: "4th place nationally, solo, out of 7,500+ participants: scouting features from 602,992 deliveries.",
    problem:
      "3,800+ uncapped Indian cricketers compete for a handful of national spots. Traditional scouting is subjective and regionally biased, and raw merit ranking structurally favours batsmen — one baseline surfaced 38 batsmen and only 2 bowlers in the top 40.",
    approach:
      "Batting and bowling features engineered from ball-by-ball data: phase-wise strike rates, trajectory slopes and consistency. Cricket knowledge leads and ML checks it, because the labelled set of capped players is small. K-Means groups players into archetypes that mirror squad roles, and role-normalised scoring plus position quotas fix the bias towards batsmen.",
    architecture:
      "End-to-end pipeline over 602,992 ball-by-ball domestic T20 deliveries across 2,714 matches: a feature-engineering notebook, EDA and archetype validation, and a pipeline script.",
    highlights: [
      "Placed 4th nationally, solo, and reached the top 8 at the finale.",
      "Role-normalised scoring and position quotas fixed a baseline that put 38 batsmen and 2 bowlers in its top 40.",
      "Rajasthan Royals made a two-part documentary on the hackathon, SupeRR Selector, on their official channel.",
    ],
    metrics: [
      { label: "national placement (solo)", value: "4th" },
      { label: "participants", value: "7,500+" },
      { label: "ball-by-ball deliveries", value: "602,992" },
      { label: "matches", value: "2,714" },
    ],
    links: {
      repo: "https://github.com/roybishal362/Rajasthan-Royals-SuperSelector-Cricket-Scouting-Intelligence-System-",
      // the official Rajasthan Royals documentary on the hackathon (their YouTube channel)
      extra: [
        { label: "RR documentary · Ep 1", url: "https://youtu.be/HuvrKN8uJZ4" },
        { label: "RR documentary · Ep 2", url: "https://youtu.be/OJjg-OFGErg" },
      ],
    },
  },
  {
    id: "piu",
    icon: "/projects/icons/piu.svg",
    art: "/projects/art/piu.svg",
    name: "Problematic Internet Use",
    tagline: "Predicting problematic internet use severity in children — the work behind my first-author paper.",
    event: "Kaggle · Child Mind Institute · basis of a first-author paper (under review, JAIR)",
    year: "2025",
    accent: "#9B7BFF",
    tags: ["Research", "Ensemble", "Health"],
    stack: ["Python", "LightGBM", "XGBoost", "CatBoost", "PyTorch", "scikit-learn", "Jupyter"],
    featured: true,
    proof: "A boosted ensemble with a PyTorch autoencoder; it led to a first-author paper under review at JAIR.",
    problem:
      "Detect early signs of problematic internet use severity — an ordered 0–3 target — in children, from health measurements and wrist-sensor summaries.",
    approach:
      "The levels are ordered, so the models predict a number and three tuned cut-points turn it into a level from 0 to 3. An ensemble of LightGBM, XGBoost and CatBoost runs under 5-fold stratified cross-validation, with a PyTorch autoencoder over 96 wrist-sensor statistics.",
    architecture:
      "Jupyter notebooks documenting the pipeline from preprocessing and feature engineering to the ensemble; the work is the basis of a first-author paper under review at the Journal of Artificial Intelligence Research (JAIR).",
    highlights: [
      "Formalised into a first-author research paper (under review, JAIR).",
      "Treated the ordered target properly: regression plus tuned cut-points, not plain classification.",
    ],
    metrics: [
      { label: "first-author paper (under review)", value: "JAIR" },
      { label: "severity levels (ordered)", value: "0–3" },
      { label: "cross-validation", value: "5-fold" },
    ],
    links: { repo: "https://github.com/roybishal362/Efficient-Ensemble-Based-Predictive-System-for-Child-Mental-Health-Assessment-" },
  },
  {
    id: "rsna-knee",
    icon: "/projects/icons/rsna-knee.svg",
    art: "/projects/art/rsna-knee.svg",
    name: "RSNA Knee MRI",
    tagline: "Twelve knee abnormalities from MRI, trained on labels an LLM read out of radiology reports.",
    event: "Kaggle · RSNA knee abnormality detection · team of 2",
    year: "2026",
    accent: "#38BDF8",
    tags: ["Computer Vision", "Medical Imaging", "PyTorch"],
    stack: ["PyTorch", "DINOv2 (ViT-S / ViT-B)", "DICOM", "Multilingual LLM label extraction", "GroupKFold", "fp16 + EMA", "Kaggle 2x T4"],
    problem:
      "Detect 12 knee abnormalities from MRI. The training set has 4,407 studies (about 740K DICOM slices from 19 sites and 6 scanner vendors) with radiology reports in 12 languages, but only 58 studies are labelled by radiologists.",
    approach:
      "Labels first: a multilingual LLM reads each report and extracts the 12 findings (macro AUC 0.897 against the radiologist-labelled studies, up from 0.78 for rules). Then a 2.5D multi-plane transformer over DINOv2 features, where 12 learned label queries attend over the slice tokens. Folds are grouped by report text to prevent leakage.",
    architecture:
      "DICOM slices are converted once into a cached 336px tensor store (617K slices, sharded, resumable build). Training uses fp16, EMA and layer-wise learning-rate decay; inference has to run offline in a Kaggle notebook within a 9-hour limit on two T4 GPUs.",
    highlights: [
      "0.91 macro ROC-AUC on a held-out fold with DINOv2-base, up from 0.885 with the small backbone.",
      "0.86 on the 58 radiologist-labelled studies, the stricter test.",
      "Pseudo-label distillation added 0.02-0.03 macro AUC per fold.",
      "I left the competition before the final submission, so there is no leaderboard rank. The code stays private until 22 Oct 2026, as Kaggle's rules require.",
    ],
    metrics: [
      { label: "macro ROC-AUC (held-out fold)", value: "0.91" },
      { label: "on radiologist-labelled studies", value: "0.86" },
      { label: "MRI studies", value: "4,407" },
      { label: "findings detected", value: "12" },
    ],
    links: {},
  },
  {
    id: "vayunetra",
    icon: "/projects/icons/vayunetra.svg",
    name: "VayuNetra",
    tagline: "Urban air quality: monitor → predict → attribute → act.",
    event: "Independent project",
    year: "2026",
    accent: "#2DD4BF",
    tags: ["Forecasting", "Geospatial", "LLM"],
    stack: ["Python 3.12", "FastAPI", "scikit-learn", "Next.js 15", "TypeScript", "MapLibre GL", "Recharts", "Groq"],
    problem:
      "Indian cities have hundreds of air-quality sensors but no forecasting, no source attribution, and no guidance for citizens or enforcement officers — just current numbers on a dashboard.",
    approach:
      "A four-stage platform. Forecasting predicts ward-level PM2.5 1–72 hours ahead across 6 Indian cities with a HistGradientBoostingRegressor, blended with a persistence baseline to guarantee it never does worse, plus calibrated uncertainty bands. Attribution fuses four independent signals (chemistry, particle size, upwind fires, meteorology) into a confidence-scored source breakdown. LLM agents write multilingual health advisories and generate an enforcement priority queue with an ROI optimiser.",
    architecture:
      "FastAPI backend answering in ~30ms via stale-while-revalidate caching; Next.js 15 + MapLibre GL 3D command centre + Recharts. Data from Open-Meteo / CAMS, NASA FIRMS (fires) and OpenStreetMap; Groq LLM behind a circuit breaker; a Telegram bot delivering advisories in six regional languages.",
    highlights: [
      "Forecast beats baseline by 27–50% on 9,600+ held-out samples.",
      "Attribution validated at 84.5% average agreement with peer-reviewed receptor studies (Mumbai 94%).",
      "Batch multi-coordinate pulls cut data latency from ~80s to ~2s per city.",
      "What-if source-reduction simulator and a validation page proving skill on hold-out data.",
    ],
    metrics: [
      { label: "cities (ward level)", value: "6" },
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
    id: "medbuddy",
    icon: "/projects/icons/medbuddy.svg",
    art: "/projects/art/medbuddy.svg",
    name: "MedBuddy",
    tagline: "Explains your lab report in plain words, and checks itself before it answers.",
    event: "Independent project · Solo build",
    year: "2026",
    accent: "#F472B6",
    tags: ["RAG", "OCR", "Health"],
    stack: ["Python", "LangChain", "Groq (Llama 3.3, Mixtral)", "FAISS", "all-MiniLM-L6-v2", "PyMuPDF", "pdfplumber", "Tesseract OCR", "OpenCV", "MedlinePlus API", "Streamlit"],
    problem:
      "Lab reports are written for doctors. Patients see numbers, ranges and medical terms with no idea which ones matter.",
    approach:
      "Upload a report (digital or scanned; scans go through OCR) or ask about a single term. MedBuddy pulls out each test value, flags it Normal, Borderline or Critical, and explains it at the reader's chosen literacy level, in English or Hindi. Definitions come from a 3-tier lookup: a cached FAISS knowledge base first, the live MedlinePlus API next, and the LLM only as a last resort; a verification step checks every explanation against its source.",
    architecture:
      "A Streamlit front end over small Python services: document intelligence, entity extraction, a value contextualiser, the RAG retriever, a hallucination verifier and a refusal handler for out-of-scope questions. The FAISS index of 150+ MedlinePlus definitions is prebuilt and committed, so the cloud deploy needs no build step.",
    highlights: [
      "3-tier retrieval: FAISS cache, then the live MedlinePlus API, then the LLM as a fallback.",
      "Every explanation is checked against its source before it is shown.",
      "Scanned reports are read with Tesseract OCR and OpenCV.",
      "Out-of-scope medical questions are refused, not guessed at.",
    ],
    metrics: [
      { label: "medical terms in the knowledge base", value: "150+" },
      { label: "retrieval tiers", value: "3" },
      { label: "languages", value: "2" },
      { label: "literacy levels", value: "3" },
    ],
    links: {
      repo: "https://github.com/roybishal362/MedBuddy-",
      demo: "https://mhappaporuchxxakx5cbmjn.streamlit.app/",
    },
  },
  {
    id: "support-copilot",
    icon: "/projects/icons/support-copilot.svg",
    art: "/projects/art/support-copilot.svg",
    name: "Support Copilot",
    tagline: "Triage a pile of support tickets in seconds, and answer the ones the docs can answer.",
    event: "Solo build · on Atlan's public documentation",
    year: "2025",
    accent: "#22D3EE",
    tags: ["RAG", "Classification", "LangChain"],
    stack: ["Python", "LangChain", "Groq (Llama 3.3 70B)", "FAISS", "all-MiniLM-L6-v2", "BeautifulSoup", "LangSmith", "Streamlit", "Pandas"],
    problem:
      "A support team gets tickets about how-tos, connectors, SSO, lineage and more, each with a different urgency, and answering the easy ones by hand eats the time the hard ones need.",
    approach:
      "An LLM classifies every ticket on three things at once: topic (9 categories), sentiment and priority (P0-P2), returned as JSON. Topics the documentation can answer go to a RAG pipeline over up to 80 crawled documentation pages (LangChain, MiniLM embeddings, FAISS), which replies with source links; everything else is routed to the right team.",
    architecture:
      "A Streamlit dashboard with bulk upload and an interactive view that shows the internal analysis next to the customer-facing answer. LangChain orchestrates the LLM and an in-memory FAISS index.",
    highlights: [
      "Bulk classification dashboard with charts and CSV export.",
      "Answers cite the documentation page they came from.",
      "Topics the docs can't answer are escalated, not guessed at.",
    ],
    metrics: [
      { label: "things classified per ticket", value: "3" },
      { label: "ticket topics", value: "9" },
      { label: "priority levels", value: "P0-P2" },
      { label: "answers", value: "cited" },
    ],
    links: {
      repo: "https://github.com/roybishal362/Customer-Support-copilot-Atlan",
      demo: "https://customer-support-copilot-atlan-x7vgdgkye42hrtgmgw6mhn.streamlit.app/",
    },
  },
  {
    id: "shl-rag",
    icon: "/projects/icons/shl-rag.svg",
    art: "/projects/art/shl-rag.svg",
    name: "Assessment Finder",
    tagline: "Type a few keywords about a role; get the three best-fitting SHL assessments.",
    event: "SHL AI internship assignment · Solo build",
    year: "2025",
    accent: "#A3E635",
    tags: ["RAG", "Vector Search", "FastAPI"],
    stack: ["Python", "BeautifulSoup", "sentence-transformers (all-MiniLM-L6-v2)", "FAISS (IndexFlatIP)", "FastAPI", "Streamlit"],
    problem:
      "SHL's catalogue has hundreds of assessments across many pages; a hiring manager should not have to read all of them to find the right three.",
    approach:
      "Scrape the official catalogue, embed each assessment with an open-source sentence model and index the vectors in FAISS. A query is embedded the same way and matched by cosine similarity; the top three come back with their official SHL links. Open-source models only, no paid APIs.",
    architecture:
      "An automated scraper builds the catalogue; a FAISS inner-product index serves retrieval behind a FastAPI service (/recommend, /health, Swagger docs) and a Streamlit front end. An evaluation script scores retrieval with MAP@3 and Recall@3 against a labelled query set.",
    highlights: [
      "Fully automated scraper of the official SHL catalogue.",
      "Open-source only: all-MiniLM-L6-v2 embeddings, 384 dimensions.",
      "REST API with Swagger docs, plus a Streamlit UI.",
      "Retrieval measured with MAP@3 and Recall@3.",
    ],
    metrics: [
      { label: "recommendations per query", value: "top 3" },
      { label: "embedding dimensions", value: "384" },
      { label: "vector index", value: "FAISS" },
      { label: "evaluated with", value: "MAP@3" },
    ],
    links: {
      repo: "https://github.com/roybishal362/SHL-Assessment-Recommendation-Engine-RAG-based",
      demo: "https://bhjrsqk9qhpw85zk5ysuhu.streamlit.app/",
      api: "https://shl-assessment-recommendation-system-561x.onrender.com/docs",
    },
  },
];

export interface Experience { org: string; role: string; period: string; bullets: string[]; }

// The same lines as the final résumés (Job-Switch-2026/resume/output), in the same words.
export const EXPERIENCE: Experience[] = [
  {
    org: "Interview Kickstart",
    role: "Associate Product Manager Intern",
    period: "Apr 2026 – Present · Remote · full end-to-end ownership of Feedback Loop, a live AI platform scoring 3,000+ classes",
    bullets: [
      "Built for a team of about 100 programme managers, in pilot since July 2026: saves an estimated 3 days a week of watching class recordings and writing instructor feedback by hand.",
      "Built a multi-stage LLM pipeline that turns a 4-hour class into instructor feedback in about 9 minutes for about $1.",
      "Owned the platform end to end: Next.js app, Dockerised FastAPI worker, PostgreSQL with row-level security, 600+ tests.",
      "Engineered trust into the output: every finding carries a quote and timestamp from the class, a second LLM pass tries to refute serious findings, and a person approves each note.",
      "Raised vision accuracy from 84% to 99% by testing against a labelled answer key and sending one frame per call.",
      "Cut LLM cost 11% on long classes by tracing a 4x rise in output tokens and caching the shared prompt block.",
    ],
  },
  {
    org: "CloudCredits",
    role: "AI Engineer Intern",
    period: "Jul 2025 – Oct 2025 · Remote",
    bullets: [
      "Deployed XGBoost and Random Forest risk models on 5M+ transactions, cutting false positives 34% in production.",
      "Engineered 12 risk indicators from 3.2M customer records, lifting credit-scoring precision 27% and cutting default-prediction error 18%.",
    ],
  },
];

export const ACHIEVEMENTS = [
  "Smart India Hackathon 2024 — Runner-up at the Grand Finale (one of 5 teams selected nationally for the Indian Sign Language problem statement, set by ISLRTC under the Ministry of Social Justice and Empowerment; ~49,000 teams were shortlisted to the national round) with Mudra, an AI Indian Sign Language platform (TensorFlow + MediaPipe).",
  "Rajasthan Royals SupeRR Selector Hackathon 2025 — 4th place nationally (top 8 at the finale; 7,500+ participants, solo).",
  "Amazon ML Challenge 2025 — Top 8% on the final leaderboard (team; I designed the multimodal pipeline).",
  "Novartis NEST 2.0 (2025-26) — National Semifinalist with C-TRUST.",
  "FAR AWAY 2026 hackathon — Finalist, rank 14, with Kakehashi (solo).",
  "Kaggle — 5 competitions across health data, medical imaging, bioacoustics and LLM optimisation. BirdCLEF+ 2026 (ended Jun 2026): 234-species bioacoustic classification with Google Perch v2 embeddings + Bayesian prior fusion (macro ROC-AUC 0.910).",
  "Research — First author, 'Predicting Problematic Internet Use in Children via QWK Optimization & Multi-Modal Feature Engineering' (under review, JAIR); Co-author, 'Real-Time Indian Sign Language Translation using Deep Learning' (under review, Pattern Recognition, Elsevier).",
  "GDG on Campus (DYPIT, Pune) AI/ML Co-Lead — delivered 8 workshops on GenAI/LLMs/RAG to 400+ developers.",
  "Microsoft Certified: Azure AI Apps and Agents Developer Associate (AI-103) and Azure AI Fundamentals (AI-901), 2026.",
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
  { event: "Smart India Hackathon 2024 · Grand Finale", rank: "Runner-up", scope: "1 of 5 teams selected nationally for the ISL problem statement", accent: "#F5C542", project: "Mudra", blurb: "AI-powered Indian Sign Language platform (TensorFlow + MediaPipe) for the problem statement set by ISLRTC, Ministry of Social Justice and Empowerment.", confirmed: true },
  { event: "Rajasthan Royals SupeRR Selector 2025", rank: "4th place", scope: "National · top 8 at the finale · 7,500+ participants · solo", accent: "#EC6EA8", project: "Cricket Scouting Intelligence", blurb: "Scouting features from 602,992 ball-by-ball deliveries to rank uncapped Indian players. Rajasthan Royals made a two-part documentary on the hackathon.", link: "https://github.com/roybishal362/Rajasthan-Royals-SuperSelector-Cricket-Scouting-Intelligence-System-", confirmed: true },
  { event: "Amazon ML Challenge 2025", rank: "Top 8%", scope: "final leaderboard · team", accent: "#F5A623", project: "Smart Product Pricing", blurb: "Multimodal price prediction from product text and images across 75K products.", link: "https://github.com/roybishal362/Amazon_ML_2025", confirmed: false },
  { event: "Novartis NEST 2.0", rank: "Semifinalist", scope: "National", accent: "#4C8DFF", project: "C-TRUST", blurb: "Rule-based multi-agent risk engine for clinical-trial data quality, with a weighted consensus and a consistency check.", link: "https://github.com/roybishal362/NEST_2.0_Hackthon", confirmed: true },
  { event: "FAR AWAY 2026", rank: "Finalist · #14", scope: "Agentic & Autonomous Systems · solo", accent: "#FF6B6B", project: "Kakehashi", blurb: "6-agent assistant with RAG and live tools that plans an Indian worker's move to Japan from official sources.", link: "https://github.com/roybishal362/Kakehashi", confirmed: true },
  { event: "BirdCLEF+ 2026 · Kaggle", rank: "AUC 0.910", scope: "macro ROC-AUC · 234 species · ended Jun 2026", accent: "#2DD4BF", project: "Bioacoustic classification", blurb: "234-species classification with Google Perch v2 embeddings + Bayesian prior fusion.", confirmed: true },
  { event: "First-author paper · Child Mind Institute data", rank: "JAIR · under review", scope: "Kaggle · problematic internet use", accent: "#9B7BFF", project: "PIU severity", blurb: "Ordered severity model: a LightGBM, XGBoost and CatBoost ensemble with tuned cut-points; basis of a first-author paper under review at JAIR.", link: "https://github.com/roybishal362/Efficient-Ensemble-Based-Predictive-System-for-Child-Mental-Health-Assessment-", confirmed: true },
];

// From LinkedIn — Bishal to provide (name, issuer, date, credential URL).
export interface Certification { name: string; issuer: string; date?: string; link?: string; }
export const CERTIFICATIONS: Certification[] = [];

export const SKILLS: { group: string; items: string[] }[] = [
  { group: "GenAI & LLMs", items: ["Production LLM pipelines", "RAG (BM25 / FAISS)", "AI agents (tool calling)", "Multi-Agent Systems", "LLM evaluation", "Multimodal LLMs (vision)", "Prompt engineering", "Prompt caching", "LangChain", "Hugging Face", "Claude and Groq APIs"] },
  { group: "ML & DL", items: ["PyTorch", "TensorFlow", "scikit-learn", "XGBoost", "LightGBM", "CatBoost", "Ensemble methods", "Cross-validation"] },
  { group: "Engineering", items: ["FastAPI", "Next.js", "REST APIs", "Docker", "PostgreSQL", "pytest", "Git", "GitHub Actions CI/CD", "Vercel", "Render", "Azure AI"] },
  { group: "Data", items: ["SQL", "Pandas", "NumPy", "Feature Engineering", "Statistical Analysis", "Excel", "Power BI"] },
  { group: "Languages", items: ["Python", "SQL", "TypeScript"] },
];
