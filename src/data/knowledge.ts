// ---------------------------------------------------------------------------
// Bishal Roy, knowledge base. Sourced from the real project repos + résumé.
// This is the single source of truth for the AI chat AND the project pages.
// Keep it TRUE and interview-defensible.
//
// Last aligned with the final résumés and the fact-check on 6 Oct 2026
// (Job-Switch-2026/00-SOURCE-OF-TRUTH.md). Rules that came out of that check:
//   - Title at Interview Kickstart: "Applied AI Intern", April to October 2026. The internship has ended: past tense.
//     Never "Applied AI Engineer" there, never full-time.
//   - "Full end-to-end ownership", never "sole engineer".
//   - The Interview Kickstart pipeline is "multi-stage", not "multi-agent".
//   - Never restore: "31% more issues with video", "4.2 to 4.6", "87% less manual effort", "72% to 91%", "ongoing" for RSNA.
//   - Withdrawn on 6 Oct 2026, after each project's code and saved outputs were re-read: Kakehashi "0 vs 69" and
//     "6 agents with live tools"; any BirdCLEF result; RSNA "0.86 on the 58 radiologist-labelled studies"; VayuNetra
//     "27-50% on 9,600+ samples", "ward level" and "84.5% agreement"; MedBuddy "grounded in MedlinePlus"; Assessment
//     Finder "scraped catalogue" and "RAG"; "about 9 minutes" (it is about 10); Feedback Loop on Microsoft Foundry.
// ---------------------------------------------------------------------------

export const PROFILE = {
  name: "Bishal Roy",
  role: "Applied AI Engineer",
  location: "Pune, India. Open to relocation and remote (India + international)",
  email: "roybishal9989@gmail.com",
  phone: "+91 97651 08054",
  github: "https://github.com/roybishal362",
  linkedin: "https://www.linkedin.com/in/bishal-roy-5410b5257/",
  education:
    "B.E. in Artificial Intelligence & Data Science, Dr. D. Y. Patil Institute of Technology, Pune. Graduated 2026, aggregate CGPA 8.99/10 across all 8 semesters (9.55/10 in the final semester)",
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
    proof: "Turns a 4-hour class into instructor feedback in about 10 minutes for about $1.",
    problem:
      "Learners rate every class, but the ratings sat in a spreadsheet and each programme manager read them their own way, so 'how is this class doing?' had no shared answer. When a class went badly, useful feedback meant watching a long recording and writing notes by hand, so it happened late or not at all.",
    approach:
      "Two halves. First, every rated class is pulled in and scored the same way, three times a day, and the weakest are queued for review. Second, a multi-stage LLM pipeline reads the class: it maps the whole session first (who is teaching, what was asked, what got answered later), then reads it in 30-minute windows, flags only problems it can back with a quote and a timestamp, and runs a second, deliberately sceptical pass that can soften or drop a finding but never invent one. A programme manager edits and approves every note; nothing is sent automatically.",
    architecture:
      "A Python/FastAPI worker in Docker runs the scheduled sync and the AI analysis; a Next.js app gives every course its own workspace; PostgreSQL holds everything behind row-level security. The scoring rule lives in one versioned SQL function that the Python and TypeScript copies are tested against with 120 shared cases, so the numbers can never disagree. Jobs are re-queued after a restart, and syncs only write the rows that changed.",
    highlights: [
      "A 4-hour class becomes evidence-backed instructor feedback in about 10 minutes for about $1, and a person approves every note.",
      "Built for a team of about 100 programme managers, in pilot since July 2026: saves an estimated 3 days a week of manual review, for about $13 a week in LLM spend at the team's volume.",
      "Raised vision accuracy from 84% to 99% by testing against a labelled answer key and sending one frame per call.",
      "Cut LLM cost 10-15% on long classes by tracing a 4x rise in output tokens and caching the shared prompt block; the platform itself runs on free hosting tiers.",
      "Ask AI: ask about a class in plain words and get an answer with exact transcript quotes and timestamps.",
      "Cut one-vote verdict flips from 31% to 13% of classes with a perturbation test on 2,784 real classes and a minimum-response rule.",
      "Made the data sync 25x faster (9 minutes to about 20 seconds) and fixed a defect that mislabelled 67% of class records.",
      "850+ automated tests, plus SQL contract tests that run the scoring function against shared cases.",
    ],
    metrics: [
      { label: "to draft feedback on a 4-hour class", value: "~10 min" },
      { label: "vision accuracy", value: "84% → 99%" },
      { label: "classes scored, three times a day", value: "3,000+" },
      { label: "automated tests", value: "850+" },
    ],
    links: {},
  },
  {
    id: "kakehashi",
    icon: "/projects/icons/kakehashi.svg",
    name: "Kakehashi",
    tagline: "An LLM agent pipeline that plans an Indian worker's move to Japan from retrieved official rules.",
    event: "FAR AWAY 2026 hackathon · Finalist, rank 14 · solo build",
    year: "2026",
    accent: "#FF6B6B",
    tags: ["Multi-Agent", "RAG", "Groq", "Next.js"],
    stack: ["Python 3.12", "FastAPI", "Next.js", "TypeScript", "BM25 RAG", "Groq (gpt-oss-120b)", "Fernet AES-128", "Server-Sent Events", "GitHub Actions"],
    featured: true,
    proof: "An LLM agent pipeline with RAG and a live job-search tool: 0 contradictions flagged in 132 fact checks over 6 runs.",
    problem:
      "Indian workers who want to work in Japan face a maze of visas, tests, employers and costs, and scam middlemen exploit the information gap.",
    approach:
      "Kakehashi turns a resume or profile into a migration plan with source links. An LLM router picks the visa route (Specified Skilled Worker, Engineer or Specialist), and five agents cover eligibility, jobs, application steps, a study plan and a cost summary. The eligibility agent and the follow-up chat are grounded in BM25 retrieval over a curated knowledge base of 26 facts, each with a source URL. A live job-search tool supplies listings; when it fails, the app shows recorded listings labelled as a cached sample.",
    architecture:
      "Next.js on Vercel and FastAPI on Render, with Server-Sent Events streaming each agent's steps. A Groq-hosted LLM with key failover, a job-search API, and 22 offline tests that run in GitHub Actions.",
    highlights: [
      "Tested, not just claimed: an LLM judge checked answers against 22 curated gold facts for 3 worker personas over 6 runs and flagged 0 contradictions in 132 fact checks.",
      "A live job-search tool, with listings scored for fit by an LLM; salary and cost estimates.",
      "Multilingual (English / Hindi / Japanese) with an encrypted PDF 'Migration Dossier' export.",
      "Honest degradation: cached data is transparently labelled when live APIs are down.",
    ],
    metrics: [
      { label: "contradictions flagged in 132 fact checks", value: "0" },
      { label: "working agents", value: "5" },
      { label: "curated facts in the knowledge base", value: "26" },
      { label: "offline tests in CI", value: "22" },
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
      "Eight rule-based specialist agents each score one risk dimension and combine through a weighted consensus. The Safety & Compliance agent carries 3.0x weight. The agents are deterministic on purpose: in safety scoring the same data must give the same answer, with a reason. A consistency check then looks across the agents' outputs for contradictions. Everything rolls up into a risk score from 0 to 100 with Green/Amber/Orange/Red bands.",
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
      "Predict e-commerce product prices from product text and images alone, with external price lookups strictly prohibited, across 75,000 products.",
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
      "3,800+ uncapped Indian cricketers compete for a handful of national spots. Traditional scouting is subjective and regionally biased, and raw merit ranking structurally favours batsmen: one baseline surfaced 38 batsmen and only 2 bowlers in the top 40.",
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
    tagline: "Predicting problematic internet use severity in children, the work behind my first-author paper.",
    event: "Kaggle · Child Mind Institute · basis of a first-author paper (under review, JAIR)",
    year: "2025",
    accent: "#9B7BFF",
    tags: ["Research", "Ensemble", "Health"],
    stack: ["Python", "LightGBM", "XGBoost", "CatBoost", "PyTorch", "scikit-learn", "Jupyter"],
    featured: true,
    proof: "A boosted ensemble with a PyTorch autoencoder; it led to a first-author paper under review at JAIR.",
    problem:
      "Detect early signs of problematic internet use severity, an ordered 0 to 3 target, in children, from health measurements and wrist-sensor summaries.",
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
      { label: "severity levels (ordered)", value: "0-3" },
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
    stack: ["PyTorch", "DINOv2 (ViT-S / ViT-B)", "DICOM", "LLM-read report labels", "GroupKFold", "fp16 + EMA", "Kaggle 2x T4"],
    problem:
      "Detect 12 knee abnormalities from MRI. The training set has 4,407 studies with radiology reports in several languages, but only 58 studies are labelled by radiologists.",
    approach:
      "Labels first: an LLM read 4,276 radiology reports and marked the 12 findings (0.90 macro ROC-AUC against the 58 radiologist-labelled studies, against 0.78 for a rules baseline). Then a 2.5D multi-plane transformer over DINOv2 features, where 12 learned label queries attend over the slice tokens. Folds are grouped by report text to prevent leakage.",
    architecture:
      "DICOM slices are converted once into a cached tensor store (617K slices, sharded, resumable build). Training uses fp16, EMA and layer-wise learning-rate decay on two Kaggle T4 GPUs, in resumable sessions of about 8 hours.",
    highlights: [
      "0.91 macro ROC-AUC against the report labels on a held-out fold of 1,102 studies with DINOv2-base, up from 0.885 with the small backbone.",
      "Against the 58 radiologist-labelled studies, scored out-of-fold: 0.84 for the four-fold models, and 0.89 after a pseudo-label round.",
      "I left the competition before the final submission, so there is no leaderboard rank. The code stays private until 22 Oct 2026, as Kaggle's rules require.",
    ],
    metrics: [
      { label: "macro ROC-AUC (held-out fold)", value: "0.91" },
      { label: "on radiologist labels, after pseudo-labels", value: "0.89" },
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
      "Indian cities have hundreds of air-quality sensors but no forecasting, no source attribution, and no guidance for citizens or enforcement officers, just current numbers on a dashboard.",
    approach:
      "A four-stage platform. Forecasting predicts PM2.5 up to 72 hours ahead for six Indian cities with one gradient-boosted model per city, checked against a same-hour persistence baseline. A rule-based engine splits each locality's PM2.5 across source classes from pollutant ratios, wind and land use. An LLM writes health advisories in English and six Indian languages.",
    architecture:
      "A FastAPI backend with stale-while-revalidate caching; a Next.js 15, MapLibre GL and Recharts map dashboard. Modelled pollution and weather data from Open-Meteo / CAMS and OpenStreetMap; a Groq LLM behind a circuit breaker; a Telegram bot for city alerts.",
    highlights: [
      "On a held-out final week the forecast clearly beat a same-hour persistence baseline in four of six cities, and added little or nothing in coastal Chennai and Mumbai.",
      "An 18-endpoint FastAPI service behind a Next.js and MapLibre map dashboard, covering 59 localities.",
      "Health advisories in English and six Indian languages, with a Telegram bot for city alerts.",
    ],
    metrics: [
      { label: "cities", value: "6" },
      { label: "forecast horizon", value: "72h" },
      { label: "cities where it beat the baseline", value: "4 of 6" },
      { label: "localities", value: "59" },
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
    tagline: "Explains your lab report in plain words, with a fixed rule for what is in range.",
    event: "Independent project",
    year: "2026",
    accent: "#F472B6",
    tags: ["LLM", "OCR", "Health"],
    stack: ["Python", "LangChain", "Groq (Llama 3.3 70B)", "FAISS", "all-MiniLM-L6-v2", "PyMuPDF", "pdfplumber", "Tesseract OCR", "OpenCV", "Streamlit"],
    problem:
      "Lab reports are written for doctors. Patients see numbers, ranges and medical terms with no idea which ones matter.",
    approach:
      "Upload a report (a PDF, or a scan or photo that goes through OCR) or ask about a single term. An LLM pulls out each test value, unit and reference range. A fixed rule, not the LLM, flags each value Normal, Borderline or Critical against the range printed on the report. The LLM then explains each result at one of three reading levels, in English or Hindi, and a second LLM call scores how much of an explanation the retrieved reference text supports and labels it Verified or Flag.",
    architecture:
      "A Streamlit front end over small Python services: document reading, value extraction, the range rule, a retriever, the self-check and a refusal handler for diagnosis and treatment questions.",
    highlights: [
      "The flag on each value comes from a fixed rule on the report's own reference range; the rule passes all 21 of its test cases.",
      "A self-check labels an explanation Verified or Flag by how much of it the retrieved text supports.",
      "Scanned reports are read with Tesseract OCR and OpenCV.",
      "Questions asking for a diagnosis or a treatment are refused.",
    ],
    metrics: [
      { label: "range-rule test cases passing", value: "21 of 21" },
      { label: "languages", value: "2" },
      { label: "reading levels", value: "3" },
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
    tagline: "Labels support tickets with an LLM and answers documentation questions with RAG.",
    event: "Solo build · on Atlan's public documentation",
    year: "2025",
    accent: "#22D3EE",
    tags: ["RAG", "Classification", "LangChain"],
    stack: ["Python", "LangChain", "Groq (Llama 3.3 70B)", "FAISS", "all-MiniLM-L6-v2", "BeautifulSoup", "Streamlit", "Pandas"],
    problem:
      "A support team gets tickets about how-tos, connectors, SSO, lineage and more, each with a different urgency, and answering the easy ones by hand eats the time the hard ones need.",
    approach:
      "An LLM labels every ticket on three things at once: topic (9 categories), sentiment and priority (P0 to P2), parsed from a JSON reply. Five of the nine topics go to a RAG pipeline over crawled product documentation (capped at 40 pages per site; LangChain, MiniLM embeddings, FAISS), which answers and lists the source pages. The other topics get a hand-off message.",
    architecture:
      "A Streamlit dashboard with bulk upload and an interactive view that shows the internal analysis next to the customer-facing answer. LangChain orchestrates the LLM and an in-memory FAISS index.",
    highlights: [
      "Bulk classification dashboard with charts and CSV export.",
      "Answers list the documentation pages the retrieved passages came from.",
      "Five of nine topics are answered from the documentation; the rest get a hand-off message.",
    ],
    metrics: [
      { label: "things classified per ticket", value: "3" },
      { label: "ticket topics", value: "9" },
      { label: "priority levels", value: "P0-P2" },
      { label: "topics answered from the docs", value: "5 of 9" },
    ],
    links: {
      repo: "https://github.com/roybishal362/Customer-Support-copilot-Atlan",
    },
  },
  {
    id: "shl-rag",
    icon: "/projects/icons/shl-rag.svg",
    art: "/projects/art/shl-rag.svg",
    name: "Assessment Finder",
    tagline: "Describe a role in plain words; get a ranked list of matching assessments.",
    event: "SHL AI internship assignment · Solo build",
    year: "2025",
    accent: "#A3E635",
    tags: ["Semantic Search", "Vector Search", "FastAPI"],
    stack: ["Python", "LangChain", "all-MiniLM-L6-v2", "FAISS (exact flat index)", "FastAPI", "Streamlit"],
    problem:
      "A hiring catalogue lists many assessments; a hiring manager should not have to read all of them to find the right few.",
    approach:
      "Each assessment in a catalogue of 37 is embedded with an open-source sentence model and indexed in FAISS. A query, or the text of a job-posting page, is embedded the same way and matched by similarity, with optional filters for duration, remote and adaptive testing. Open-source models only, no paid APIs.",
    architecture:
      "An exact FAISS flat index serves retrieval behind a FastAPI service (/recommend, /health) and a Streamlit front end. A custom evaluation script scores retrieval with Precision, Recall and MAP at k = 3, 5 and 10 against 6 labelled queries.",
    highlights: [
      "MAP@3 0.73 and Precision@3 0.78 on 6 labelled queries over a catalogue of 37 assessments.",
      "Open-source only: all-MiniLM-L6-v2 embeddings, 384 dimensions.",
      "A FastAPI service, plus a Streamlit app with an evaluation tab.",
    ],
    metrics: [
      { label: "MAP@3 (6 queries, 37 assessments)", value: "0.73" },
      { label: "embedding dimensions", value: "384" },
      { label: "vector index", value: "FAISS" },
      { label: "Precision@3", value: "0.78" },
    ],
    links: {
      repo: "https://github.com/roybishal362/SHL-Assessment-Recommendation-Engine-RAG-based",
    },
  },
];

export interface Experience { org: string; role: string; period: string; bullets: string[]; }

// The same lines as the final résumés (Job-Switch-2026/resume/output), in the same words.
export const EXPERIENCE: Experience[] = [
  {
    org: "Interview Kickstart",
    role: "Applied AI Intern",
    period: "Apr 2026 - Oct 2026 · Remote · full end-to-end ownership of Feedback Loop, a live AI platform scoring 3,000+ classes",
    bullets: [
      "Saves an estimated 3 days a week of manual review: built for about 100 programme managers, in pilot since July 2026.",
      "Turns a 4-hour class into instructor feedback in about 10 minutes for about $1 with a multi-stage LLM pipeline.",
      "Costs about $13 a week at the team's volume: about $1 a class in LLM spend on free hosting; prompt caching cut it 10-15%.",
      "Made the output trustworthy: quote and timestamp per finding, a second LLM pass to refute serious ones, human approval.",
      "Raised vision accuracy from 84% to 99% by testing against a labelled answer key and sending one frame per call.",
      "Shipped Ask AI: answers questions about a class with exact transcript quotes and timestamps, about 15 cents each.",
      "Built and deployed agent and RAG projects on Microsoft Foundry for the company's Azure AI Engineer programme.",
    ],
  },
  {
    org: "CloudCredits",
    role: "AI Engineer Intern",
    period: "Jul 2025 - Oct 2025 · Remote",
    bullets: [
      "Deployed XGBoost and Random Forest risk models on 5M+ transactions: 34% fewer false positives than the earlier model.",
      "Engineered 12 risk indicators from 3.2M customer records, lifting credit-scoring precision 27% and cutting default-prediction error 18%.",
    ],
  },
];

export const ACHIEVEMENTS = [
  "Smart India Hackathon 2024: Runner-up at the Grand Finale (one of 5 teams selected nationally for the Indian Sign Language problem statement, set by ISLRTC under the Ministry of Social Justice and Empowerment; ~49,000 teams were shortlisted to the national round) with Mudra, an AI Indian Sign Language platform (TensorFlow + MediaPipe).",
  "Rajasthan Royals SupeRR Selector Hackathon 2025: 4th place nationally (top 8 at the finale; 7,500+ participants, solo).",
  "Amazon ML Challenge 2025: Top 8% on the final leaderboard (team; I designed the multimodal pipeline).",
  "Novartis NEST 2.0 (2025-26): National Semifinalist with C-TRUST.",
  "FAR AWAY 2026 hackathon: finalist, rank 14, with Kakehashi (solo).",
  "Kaggle: 5 competitions across health data, medical imaging, game AI and LLM optimisation.",
  "Research: first author, 'Predicting Problematic Internet Use in Children: A Novel Methodology Leveraging Quadratic Weighted Kappa and Advanced Multi-Modal Feature Engineering' (under review, JAIR); Co-author, 'Real-Time Indian Sign Language Translation using Deep Learning' (under review, Pattern Recognition, Elsevier).",
  "GDG on Campus (DYPIT, Pune) AI/ML Co-Lead: delivered 8 workshops on GenAI/LLMs/RAG to 400+ developers.",
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
  { event: "FAR AWAY 2026", rank: "Finalist · #14", scope: "Agentic & Autonomous Systems · solo", accent: "#FF6B6B", project: "Kakehashi", blurb: "An LLM agent pipeline with RAG and a live job-search tool that plans an Indian worker's move to Japan.", link: "https://github.com/roybishal362/Kakehashi", confirmed: true },
  { event: "First-author paper · Child Mind Institute data", rank: "JAIR · under review", scope: "Kaggle · problematic internet use", accent: "#9B7BFF", project: "PIU severity", blurb: "Ordered severity model: a LightGBM, XGBoost and CatBoost ensemble with tuned cut-points; basis of a first-author paper under review at JAIR.", link: "https://github.com/roybishal362/Efficient-Ensemble-Based-Predictive-System-for-Child-Mental-Health-Assessment-", confirmed: true },
];

// From LinkedIn, Bishal to provide (name, issuer, date, credential URL).
export interface Certification { name: string; issuer: string; date?: string; link?: string; }
export const CERTIFICATIONS: Certification[] = [];

export const SKILLS: { group: string; items: string[] }[] = [
  { group: "GenAI & LLMs", items: ["Production LLM pipelines", "RAG (BM25 / FAISS)", "Azure AI Search", "AI agents (tool calling)", "Multi-Agent Systems", "LLM evaluation", "Multimodal LLMs (vision)", "Prompt engineering", "Prompt caching", "LangChain", "Hugging Face", "Claude and Groq APIs"] },
  { group: "ML & DL", items: ["PyTorch", "TensorFlow", "scikit-learn", "XGBoost", "LightGBM", "CatBoost", "Ensemble methods", "Cross-validation"] },
  { group: "Engineering", items: ["FastAPI", "Next.js", "REST APIs", "Docker", "PostgreSQL", "pytest", "Git", "GitHub Actions", "Vercel", "Render", "Microsoft Foundry"] },
  { group: "Data", items: ["SQL", "Pandas", "NumPy", "Feature Engineering", "Statistical Analysis", "Excel", "Power BI"] },
  { group: "Languages", items: ["Python", "SQL", "TypeScript"] },
];
