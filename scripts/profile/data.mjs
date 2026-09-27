// Every fact the profile renders lives here. Sources, newest first: the
// resume (assets/Kashyap_Patel_Resume.pdf), the public showcase READMEs
// (measured numbers), the portfolio's src/lib/data.ts and each public repo. Edit this file, then
// run `node scripts/build-profile.mjs`.

export const GH = 'https://github.com/DeAtHfIrE26';
const repo = (name) => `${GH}/${name}`;

export const person = {
  name: 'Kashyap Patel',
  handle: 'DeAtHfIrE26',
  title: 'Full-Stack Engineer · .NET · React · Python · Cloud',
  tagline: 'Engineering systems that scale, survive, and ship.',
  location: 'Noida, India',
  portfolio: 'https://kashyappatel.vercel.app',
  resume: 'assets/Kashyap_Patel_Resume.pdf',
  email: 'kashyappatel2673@gmail.com',
  linkedin: 'https://www.linkedin.com/in/kashyap-patel2673/',
  leetcode: 'https://leetcode.com/u/Kashyap_patel26/',
  instagram: 'https://www.instagram.com/._k.a.s.h.y.a.p._',
};

// Hero terminal: typed out line by line.
export const terminal = [
  ['role', 'Full-Stack · .NET · React · Azure'],
  ['now', 'Lead Dev, Atlas @ Gentell'],
  ['shipped', '97-endpoint platform, solo'],
  ['impact', '10–20K orders/day synced'],
  ['research', 'IEEE ICCCNT-2025 + 2 papers'],
  ['patent', 'inPASS #202541122226'],
  ['status', 'open to new roles'],
];

// Headline counters (odometer animation).
export const headline = [
  { value: '97', label: 'API endpoints, built solo', sub: 'MyOrders · shipped in 2 weeks', key: 'accent' },
  { value: '75%', label: 'API latency cut', sub: '400 → 100 ms with Redis', key: 'cyan' },
  { value: '8.54', label: 'CGPA', sub: 'B.Tech CSE · VIT Vellore', key: 'green' },
  { value: '3+1', label: 'papers + patent', sub: 'IEEE · INCONSYM · ICICT', key: 'amber' },
];

export const neofetch = [
  ['Role', 'Full-Stack Software Engineer'],
  ['Work', 'Lead Developer (Atlas/CMN) @ Gentell'],
  ['Location', 'Noida, India'],
  ['Education', 'B.Tech CSE, VIT Vellore · CGPA 8.54'],
  ['Stack', '.NET/C# · React · Python · Azure · AWS'],
  ['Data', 'SQL Server · Postgres · Redis · Snowflake'],
  ['Integrates', 'Brightree · DocuSign · CMS PECOS · Stripe'],
  ['AI / ML', 'RAG · LLMs · TensorFlow · OpenCV'],
  ['Research', '3 papers · IEEE / Scopus'],
  ['Patent', 'inPASS #202541122226 · filed'],
  ['Certified', 'AWS Cloud Practitioner · GCP Digital Leader'],
  ['2026', 'AI automation · system design · DSA'],
];

export const experience = [
  {
    period: 'Jul 2025 – Present', current: true,
    role: 'Junior Application Developer · Lead Developer (Atlas/CMN)', company: 'Gentell', place: 'Noida, India',
    impact: [
      'Built and shipped MyOrders, a 97-endpoint healthcare order platform (.NET, ASP.NET Core, React, SQL Server, Azure), as sole developer under a 2-week deadline: 1,000+ users across 7 branches and 10–20K daily orders synced with Brightree EHR.',
      'Architected a 28-endpoint RBAC admin system (30+ DTO schemas, bulk approvals, JWT) and integrated CMS PECOS physician records for instant NPI and name lookups.',
      'Cut API latency 75% (400 ms → 100 ms) with a Redis distributed cache on Azure App Service, and migrated the data warehouse from Azure to AWS Snowflake with zero downtime.',
      'Led Atlas, a Certificate-of-Medical-Necessity module that moved a Salesforce-licensed workflow ($175/user/month) into Fastcare: automated PDFs, multi-signer DocuSign routing and Brightree DMS upload.',
      'Wrote 40+ Playwright and Cucumber BDD tests that run in CI/CD on every deploy, saving 2–3 hours of manual QA per release.',
      'On-call DRI for production incidents on a 4,000+ facility wound-care SaaS.',
    ],
    stack: ['.NET', 'ASP.NET Core', 'React', 'SQL Server', 'Azure', 'Redis', 'Snowflake', 'DocuSign', 'Playwright'],
  },
  {
    period: 'Aug 2024 – Apr 2025',
    role: 'Full-Stack Developer (Freelance)', company: 'Homoeocare Pharma', place: 'Remote',
    impact: [
      'Delivered an end-to-end e-commerce platform for an FDA-approved pharmaceutical brand as sole developer: 7 product categories, 50+ SKUs and Stripe checkout.',
      'Built a custom inventory backend, a doctor portal and an appointment-booking module.',
    ],
    stack: ['WordPress', 'PHP', 'Stripe'],
  },
  {
    period: 'Jun 2024 – Jul 2024',
    role: 'AI/ML Engineer Intern', company: 'TeachNook', place: 'Remote',
    impact: [
      'Optimised a TensorFlow training pipeline: +30% accuracy, −40% GPU training time.',
      'Built the KARY and Doctor chatbots with full MLOps pipelines.',
    ],
    stack: ['TensorFlow', 'Python', 'NLP', 'MLOps'],
  },
  {
    period: 'Sep 2021 – May 2025', edu: true,
    role: 'B.Tech, Computer Science', company: 'Vellore Institute of Technology', place: 'Vellore',
    impact: ['Graduated with a CGPA of 8.54 / 10.0.'],
    stack: [],
  },
];

// Flagship projects. `metrics` animate as before→after bars; `facts` as tiles.
export const flagships = [
  {
    id: 'document-intelligence', title: 'Document Intelligence Framework', tag: 'AI · SEARCH · FULL STACK', key: 'accent',
    desc: 'A retrieval-augmented document platform: extraction, embeddings, cross-encoder reranking and a knowledge graph behind a Flask API. Upload a PDF, scan, note or audio file, then search it with AI answers that cite their sources.',
    metrics: [
      ['Process a 21 KB document', 230, 2.9, 's'],
      ['Live search', 15.7, 0.33, 's'],
      ['Embedding API calls / upload', 855, 2, ''],
      ['SQL statements / upload', 15084, 29, ''],
    ],
    stack: ['Python', 'Flask', 'pgvector', 'spaCy', 'OpenAI', 'Tesseract', 'TypeScript'],
    live: 'https://docu-intelligence.vercel.app', code: repo('document-intelligence-showcase'),
    gif: 'https://raw.githubusercontent.com/DeAtHfIrE26/document-intelligence-showcase/main/assets/demo.gif',
    art: 'document-intelligence',
  },
  {
    id: 'rideshare', title: 'RideShare Incentive Platform', tag: 'FULL STACK · PERFORMANCE', key: 'blue',
    desc: 'A production carpooling platform that pays people to share journeys. The showcase holds its app shell, a dependency-free motion system and a 72-check release-hygiene suite.',
    metrics: [
      ['Dashboard stats API', 828.7, 419.3, 'ms'],
      ['Journeys list, 200k rows', 20.5, 0.11, 'ms'],
      ['Worst layout shift (CLS)', 0.481, 0.019, ''],
      ['Main bundle, gzipped', 124.2, 102.3, 'kB'],
    ],
    stack: ['React 18', 'TypeScript', 'Tailwind', 'Radix', 'PostgreSQL', 'Drizzle', 'Playwright'],
    live: 'https://ride-share-incentive-platform.vercel.app', code: repo('rideshare-incentive-showcase'),
    gif: 'https://raw.githubusercontent.com/DeAtHfIrE26/rideshare-incentive-showcase/main/assets/walkthrough.gif',
    art: 'rideshare',
  },
  {
    id: 'healthhubpro', title: 'HealthHubPro', tag: 'HEALTH · TIME SERIES · A11Y', key: 'green',
    desc: 'Health tracking on a 26-endpoint TypeScript API with a Redis cache, InfluxDB time series for 6 biometric signals, and Kubernetes deploys watched by Prometheus, Grafana and Sentry. Streams a 300 MB Apple Health export in 4 MB slices.',
    metrics: [
      ['Chart chunk, gzipped', 99.38, 2.11, 'kB'],
      ['Dashboard payload', 766, 377, 'kB'],
      ['Total blocking time, mobile', 349, 175, 'ms'],
    ],
    stack: ['TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'InfluxDB', 'Kubernetes', 'React 18'],
    live: 'https://healthhubproapp.vercel.app', code: repo('healthhubpro-showcase'),
    extra: ['Playground', 'https://deathfire26.github.io/healthhubpro-showcase/'],
    gif: 'https://raw.githubusercontent.com/DeAtHfIrE26/healthhubpro-showcase/main/assets/demo.gif',
    art: 'healthhubpro',
  },
  {
    id: 'merkle-verif', title: 'Merkle Verify', tag: 'ON-CHAIN VERIFICATION · SOLIDITY', key: 'pink',
    desc: 'An on-chain verification suite: a Merkle-proof verifier byte-compatible with OpenZeppelin, an ECDSA verifier that rejects malleable signatures (EIP-2), and a USDC transfer tracker indexed through a subgraph. The live visualizer lets you tamper with a proof and watch the verdict flip.',
    facts: [
      ['278', 'tests in the engine'],
      ['12', 'leaf counts at OZ parity'],
      ['41', 'Solidity↔TS parity tests'],
      ['0', 'prod dependency vulns'],
    ],
    stack: ['Solidity', 'Hardhat', 'The Graph', 'ethers.js', 'OpenZeppelin', 'React 19', 'TypeScript'],
    live: 'https://merkle-verif.vercel.app', code: repo('merkle-verif-showcase'),
    gif: 'https://raw.githubusercontent.com/DeAtHfIrE26/merkle-verif-showcase/main/assets/demo.gif',
    art: 'merkle-verif',
  },
  {
    id: 'interview-coach', title: 'AI Interview Coach', tag: 'GEN AI · RAG · COMPUTER VISION', key: 'amber',
    desc: 'A multimodal interview platform with 5 assessment modes and no fixed question bank: an LLM + RAG engine writes resume-aware questions and scores answers on 4 dimensions, while lip-sync verification flags passive test-taking. IEEE ICCCNT 2025; patent filed.',
    facts: [
      ['5', 'assessment modes'],
      ['4', 'scoring dimensions'],
      ['92%+', 'lip-sync verification accuracy'],
      ['0', 'fixed questions: all generated'],
    ],
    stack: ['Python', 'TensorFlow', 'OpenCV', 'DeepFace', 'LLMs', 'RAG', 'MediaPipe'],
    code: repo('Next-Generation-Virtual-Interview-Training-System'),
    extra: ['Coach UI', repo('futuristic-ai-interviewer')],
    gif: 'https://raw.githubusercontent.com/DeAtHfIrE26/Next-Generation-Virtual-Interview-Training-System/main/VirtualCoach.gif',
    art: 'interview-coach',
  },
];

// Every other public project, as two-up cards. `glyph` picks the animated icon.
export const projects = [
  { id: 'intelligent-retriever', title: 'Intelligent Retriever', tag: 'AI SEARCH', key: 'accent', glyph: 'search', year: 2025,
    desc: 'AI document management with semantic search, so teams can store, search and analyse whole document repositories.',
    stack: ['TypeScript', 'React', 'Express', 'OpenAI'], url: repo('Intelligent_Retriever') },
  { id: 'memotag', title: 'MemoTag · Dementia Care', tag: 'HEALTH AI', key: 'pink', glyph: 'pulse', year: 2025,
    desc: 'AI-powered memory assistance for people living with dementia and the families who care for them.',
    stack: ['TypeScript', 'React', 'Express', 'WebSockets'], url: repo('AI-Powered-Dementia-Care-Solution') },
  { id: 'vas', title: 'MemoTag Voice Analysis', tag: 'SPEECH', key: 'cyan', glyph: 'wave', year: 2025,
    desc: 'Speech transcription and audio-feature analysis for spotting cognitive signals in voice recordings.',
    stack: ['Python', 'Whisper', 'Vosk', 'librosa', 'Streamlit'], url: repo('VAS_Voice-Analysis-System') },
  { id: 'face-attend', title: 'Unified Face Attend', tag: 'COMPUTER VISION', key: 'green', glyph: 'scan', year: 2025,
    desc: 'Multi-face attendance at 98% precision, with active anti-spoofing and real-time Firebase cloud sync. Published at INCONSYM-2025.',
    stack: ['Python', 'OpenCV', 'DeepFace', 'Firebase'], url: repo('Unified-Face-Attend') },
  { id: 'gujarati-tts', title: 'Gujarati Text-to-Speech', tag: 'NEURAL TTS', key: 'amber', glyph: 'wave', year: 2025,
    desc: 'End-to-end VITS speech synthesis for Gujarati: conditional VAE, adversarial training and a flow-based decoder.',
    stack: ['Python', 'PyTorch', 'VITS', 'FastAPI'], url: repo('VITS-Based-Gujarati-Text-to-Speech-Model') },
  { id: 'chatbot-doctor', title: 'ChatBot Doctor', tag: 'LLM FINE-TUNING', key: 'blue', glyph: 'chat', year: 2024,
    desc: 'LLaMA fine-tuned for medical Q&A with PEFT and 4-bit quantization, for memory-efficient inference.',
    stack: ['Python', 'LLaMA', 'PEFT', 'bitsandbytes'], url: repo('ChatBot_Doctor_Using_FTM') },
  { id: 'kary', title: 'KARY · Sentiment Chatbot', tag: 'NLP', key: 'pink', glyph: 'chat', year: 2024,
    desc: 'Emotion-aware chatbot that detects sentiment in real time and adapts its replies. Built at the TeachNook internship.',
    stack: ['Python', 'Flask', 'NLP'], url: repo('Sentiment_Analysis') },
  { id: 'doc-retrieval', title: 'Document Retrieval System', tag: 'SEARCH INFRA', key: 'cyan', glyph: 'graph', year: 2024,
    desc: 'Graph-backed document retrieval on Neo4j with transformer embeddings, containerised with Docker and Kubernetes.',
    stack: ['Python', 'FastAPI', 'Neo4j', 'Docker'], url: repo('document_retrieval_system') },
  { id: 'rl-agents', title: 'Reinforcement Learning Trio', tag: 'DEEP RL', key: 'green', glyph: 'orbit', year: 2024,
    desc: 'Lunar Landing (Deep Q-learning), Pac-Man (deep convolutional Q-learning) and Kung Fu (A3C) agents.',
    stack: ['Python', 'PyTorch', 'Gymnasium', 'A3C'], url: repo('AI_Lunar_Landing'),
    links: [['Lunar Landing', repo('AI_Lunar_Landing')], ['Pac-Man', repo('AI_Pac_MAN_GAME')], ['Kung Fu A3C', repo('KungFu_A3C')]] },
  { id: 'carpool', title: 'Carpooling with Rewards', tag: 'FULL STACK', key: 'blue', glyph: 'route', year: 2025,
    desc: 'Ride-sharing that matches drivers and passengers on a live map, with a reward system for shared rides.',
    stack: ['React', 'Express', 'MongoDB', 'Leaflet'], url: repo('Carpooling_With_RewardSystem') },
  { id: 'chess', title: 'Turn-based Chess-like Game', tag: 'REAL-TIME', key: 'amber', glyph: 'grid', year: 2025,
    desc: 'Real-time multiplayer strategy on a 5×5 board, with game state synchronised over WebSockets.',
    stack: ['JavaScript', 'Express', 'Socket.IO'], url: repo('Turn_based_ChessLike_Game') },
  { id: 'doofus', title: 'Doofus Adventure', tag: 'GAME DEV', key: 'accent', glyph: 'pixel', year: 2025,
    desc: 'A Unity platformer: guide Doofus through dynamic worlds full of puzzles, enemies and treasure.',
    stack: ['C#', 'Unity'], url: repo('Doofus_Adventure_Game') },
  { id: 'portfolio', title: 'Portfolio', tag: 'WEBGL · MOTION', key: 'cyan', glyph: 'orbit', year: 2026,
    desc: 'kashyappatel.vercel.app: a WebGL hero, GSAP motion, a command palette and a Turnstile-protected contact flow.',
    stack: ['Next.js 14', 'Three.js', 'GSAP', 'Resend'], url: repo('kashyap-portfolio') },
  { id: 'neetcode', title: 'NeetCode Solutions', tag: 'DSA', key: 'green', glyph: 'grid', year: 2026,
    desc: 'Accepted NeetCode solutions in C++ and Python, synced to GitHub automatically on every submission.',
    stack: ['C++', 'Python'], url: repo('neetcode-submissions') },
];

export const publications = [
  { badge: 'IEEE · ICCCNT-2025', key: 'accent', title: 'Spontaneous Virtual Interview Coaching via Lip-Sync-Empowered Generative AI', venue: 'International Conference on Computing, Communication and Networking Technologies · Dec 2025' },
  { badge: 'INCONSYM-2025', key: 'cyan', title: 'Unified Multi-Face Detection Framework for Enhanced Automated Attendance Systems', venue: 'INCONSYM-2025 International Conference' },
  { badge: 'ICICT-2024', key: 'green', title: 'AgriSmart: Empowering Small-Scale Farmers with Precision Agriculture Tools', venue: 'ICICT-2024 International Conference' },
];

export const patent = {
  title: 'AI-Powered Virtual Interview Coaching System with Multimodal Authentication',
  office: 'Indian Patent Office (inPASS)', number: '202541122226', year: '2025', status: 'Filed',
};

export const certifications = [
  { name: 'Cloud Practitioner (CLF-C02)', provider: 'Amazon Web Services', key: 'amber' },
  { name: 'Cloud Digital Leader', provider: 'Google Cloud', key: 'blue' },
  { name: 'Computing Foundations', provider: 'Google Cloud', key: 'green' },
  { name: 'Full-Stack Web Development', provider: 'Udemy', key: 'accent' },
  { name: 'Machine Learning Fundamentals', provider: 'Coursera', key: 'cyan' },
];

// Self-assessed levels (1–5), carried over from the portfolio's skills bento.
export const skills = [
  { label: 'Full Stack', key: 'accent', items: [['React / Next.js', 5], ['TypeScript', 5], ['.NET / ASP.NET Core', 4], ['Node.js / Express', 4], ['Angular', 3]] },
  { label: 'Cloud & DevOps', key: 'cyan', items: [['Microsoft Azure', 4], ['AWS / GCP', 4], ['Docker / Kubernetes', 3], ['CI/CD · Terraform', 3]] },
  { label: 'AI / ML', key: 'green', items: [['TensorFlow / Keras', 4], ['OpenCV / DeepFace', 4], ['NLP / LLMs', 4], ['Generative AI', 4], ['MLOps pipelines', 3]] },
  { label: 'Data', key: 'amber', items: [['SQL Server / Snowflake', 5], ['PostgreSQL / Redis', 4], ['MongoDB / Firebase', 4], ['Neo4j', 3]] },
  { label: 'Testing & Tools', key: 'pink', items: [['Playwright + Cucumber', 4], ['Jest · Azure DevOps', 4], ['Vitest · GitHub Actions', 4]] },
  { label: 'Languages', key: 'blue', items: [['TypeScript · JavaScript', 5], ['C# · Python · SQL', 5], ['C++ · Java', 4]] },
];

export const marquee = [
  ['C#', '.NET', 'ASP.NET Core', 'React', 'Next.js', 'TypeScript', 'Python', 'Azure', 'AWS', 'SQL Server', 'Snowflake', 'Redis', 'Playwright', 'Cucumber', 'Solidity', 'Hardhat'],
  ['Node.js', 'PostgreSQL', 'InfluxDB', 'MongoDB', 'Neo4j', 'Docker', 'Kubernetes', 'Prometheus', 'Sentry', 'RAG', 'LLMs', 'TensorFlow', 'OpenCV', 'DocuSign', 'Brightree', 'The Graph'],
];
