import type { Project } from "@/data/projects";
import type { Experience, SkillGroup } from "@/data/profile";
import type { Locale } from "./config";

export type NavbarDict = {
  about: string;
  projects: string;
  experience: string;
  skills: string;
  contact: string;
  ai: string;
  hireMe: string;
  openMenu: string;
  closeMenu: string;
  backToTop: string;
  skipToContent: string;
  toggleToLight: string;
  toggleToDark: string;
  themeHint: string;
  switchLanguage: string;
};

export type HeroDict = {
  role: string;
  availability: string;
  statement: string;
  statementExtra: string;
  ctaProjects: string;
  ctaContact: string;
  ctaCv: string;
  stats: [string, string, string];
};

export type AboutDict = {
  eyebrow: string;
  titleA: string;
  titleAccent: string;
  description: string;
  greeting: string;
  highlight: string;
  paragraphs: [string, string, string];
  principle: string;
  values: { title: string; body: string }[];
};

export type ProjectsSectionDict = {
  eyebrow: string;
  titleA: string;
  titleAccent: string;
  description: string;
  note: string;
  featured: string;
  problem: string;
  viewCaseStudy: string;
  liveDemo: string;
  internalDemo: string;
};

export type ExperienceSectionDict = {
  eyebrow: string;
  titleA: string;
  titleAccent: string;
  description: string;
};

export type SkillsSectionDict = {
  eyebrow: string;
  titleA: string;
  titleAccent: string;
  description: string;
  rangeTitle: string;
  rangeNote: string;
  rangeItems: [string, string, string];
};

export type ContactDict = {
  eyebrow: string;
  titleA: string;
  titleAccent: string;
  description: string;
  copyEmail: string;
  copied: string;
  expectations: string;
  availability: string;
  steps: { title: string; detail: string }[];
  availabilityNow: string;
  capacity: string;
};

export type ChatbotDict = {
  eyebrow: string;
  titleA: string;
  titleAccent: string;
  description: string;
  placeholder: string;
  greeting: string;
  prompts: [string, string, string, string];
  send: string;
  stop: string;
  clear: string;
  thinking: string;
  online: string;
  modelLabel: string;
  terminalTitle: string;
  disclaimer: string;
};

export type FooterDict = {
  tagline: string;
};

export type CvDict = {
  title: string;
  back: string;
  print: string;
  summary: string;
  experience: string;
  projects: string;
  skills: string;
};

export type CaseStudyDict = {
  back: string;
  prefix: string;
  role: string;
  period: string;
  demo: string;
  stack: string;
  live: string;
  internal: string;
  problem: string;
  built: string;
  decisions: string;
  technologies: string;
  moreProjects: string;
  nextCase: string;
};

export type MetadataDict = {
  siteTitle: string;
  siteDescription: string;
  ogDescription: string;
  twitterDescription: string;
  cvTitle: string;
  cvDescription: string;
  caseStudySuffix: string;
};

export type Dictionary = {
  nav: NavbarDict;
  hero: HeroDict;
  about: AboutDict;
  projectsSection: ProjectsSectionDict;
  projects: Project[];
  experienceSection: ExperienceSectionDict;
  experiences: Experience[];
  skillsSection: SkillsSectionDict;
  skillGroups: SkillGroup[];
  principles: { title: string; note: string }[];
  contact: ContactDict;
  chatbot: ChatbotDict;
  footer: FooterDict;
  cv: CvDict;
  caseStudy: CaseStudyDict;
  metadata: MetadataDict;
};

const id: Dictionary = {
  nav: {
    about: "Tentang",
    projects: "Proyek",
    experience: "Pengalaman",
    skills: "Keahlian",
    contact: "Kontak",
    ai: "Tanya AI",
    hireMe: "Rekrut saya",
    openMenu: "Buka menu",
    closeMenu: "Tutup menu",
    backToTop: "Kembali ke atas",
    skipToContent: "Lewati ke konten",
    toggleToLight: "Ganti ke mode terang",
    toggleToDark: "Ganti ke mode gelap",
    themeHint: "Tema (D)",
    switchLanguage: "Bahasa",
  },
  hero: {
    role: "Web Developer / Frontend Engineer",
    availability: "Terbuka untuk proyek",
    statement:
      "Saya membangun aplikasi web yang terstruktur, cepat, dan memiliki pengalaman pengguna yang matang.",
    statementExtra:
      "Saya fokus pada arsitektur yang rapi, performa yang terukur, dan detail interaksi yang tidak mengganggu.",
    ctaProjects: "Lihat proyek",
    ctaContact: "Hubungi saya",
    ctaCv: "Download CV",
    stats: [
      "Tahun pengalaman JavaScript",
      "Proyek unggulan",
      "Teknologi dikuasai",
    ],
  },
  about: {
    eyebrow: "Tentang",
    titleA: "Engineer yang berpikir seperti",
    titleAccent: "pemilik produk.",
    description:
      "Sekitar 4 tahun membangun dengan JavaScript — dari landing page cepat sampai sistem enterprise yang dipakai harian.",
    greeting: "Halo, saya Salman.",
    highlight: "BUMN dan institusi pemerintahan",
    paragraphs: [
      "Saya Web Developer / Frontend Engineer yang terbiasa bekerja dari ujung ke ujung: menggambar UI, mengatur state, merancang API dan skema database, mengurus authentication, sampai deployment ke Vercel.",
      "Sebagian waktu saya dihabiskan di lingkungan BUMN dan institusi pemerintahan — tempat di mana “berhasil di laptop saya” tidak cukup. Di sana saya belajar menulis workflow yang bisa diaudit, form yang tidak ambigu antar peran, dan dashboard yang tetap waras saat datanya besar.",
      "Di sisi lain saya membangun Duitku sebagai latihan disiplin produk: memisahkan data milik user yang wajib dipersist dari data live eksternal yang tidak perlu disimpan. Prinsip kecil, dampak besar untuk maintainability.",
    ],
    principle:
      "Cara saya bekerja sederhana: pahami masalahnya dulu, sepakati kontrak datanya, baru bangun UI-nya.",
    values: [
      {
        title: "Arsitektur yang bisa dirawat",
        body: "Modul kecil, tipe eksplisit, dan aliran data satu arah. Saya menulis kode seolah orang berikutnya yang membacanya adalah saya sendiri enam bulan dari sekarang — lelah dan dikejar deadline.",
      },
      {
        title: "Keamanan & kebenaran data",
        body: "Terbiasa dengan auth, RLS Supabase, validasi ganda, dan jejak audit untuk sistem enterprise. Data finansial dan pemerintahan tidak memberi ruang untuk 'hampir benar'.",
      },
      {
        title: "Performa sebagai fitur",
        body: "Pagination, agregasi server-side, lazy section, dan budget JavaScript. Cepat bukan soal skor — soal rasa percaya saat aplikasi dipakai setiap hari.",
      },
      {
        title: "UX yang matang, bukan ramai",
        body: "Whitespace, hierarki tipografi, dan micro-motion yang tenang. Saya lebih suka satu transisi 200ms yang tepat daripada sepuluh animasi yang berteriak.",
      },
    ],
  },
  projectsSection: {
    eyebrow: "Proyek Pilihan",
    titleA: "Kerja nyata,",
    titleAccent: "bukan daftar logo.",
    description:
      "Tiga proyek yang paling menjelaskan cara saya berpikir: satu produk finansial, satu sistem enterprise, satu pengalaman kreatif.",
    note: "Setiap proyek mencantumkan problem, peran, keputusan teknis, dan studi kasusnya.",
    featured: "Unggulan",
    problem: "Problem",
    viewCaseStudy: "Lihat Studi Kasus",
    liveDemo: "Demo langsung",
    internalDemo: "Internal — demo on request",
  },
  projects: [
    {
      slug: "duitku",
      title: "Duitku",
      tagline: "Personal finance tracker yang menghormati kepemilikan data.",
      description:
        "Aplikasi pelacak keuangan pribadi berbasis Next.js dan Supabase. Mencatat transaksi multi-wallet, mengelola kategori dan wishlist, menyajikan laporan serta chart, dan memantau portofolio — dengan prinsip data yang jelas.",
      problem:
        "Kebanyakan finance tracker mencampur data milik user dengan data pasar eksternal yang live, lalu menyimpannya tanpa alasan. Akibatnya skema membengkak, sulit diaudit, dan rawan basi. Duitku memisahkan keduanya: yang milik user dipersist dengan RLS yang ketat, yang eksternal live hanya di-fetch on-demand.",
      role: "Solo builder — product, frontend, backend (Supabase), deployment",
      period: "2024 — sekarang",
      context: "Produk independen · Supabase + Next.js",
      technologies: [
        "Next.js",
        "TypeScript",
        "Supabase",
        "PostgreSQL",
        "Row Level Security",
        "TanStack React Query",
        "Zustand",
        "React Hook Form",
        "Tailwind CSS",
        "shadcn/ui",
        "Vercel",
      ],
      highlights: [
        "Transaksi multi-wallet dengan transfer antar-dompet dan rekonsiliasi saldo",
        "Kategori + wishlist dengan alokasi anggaran dan progres",
        "Laporan bulanan, chart arus kas, dan ringkasan portofolio",
        "API key per-user untuk akses programmatic yang revocable",
        "Auth Supabase + RLS: user hanya bisa membaca tulis datanya sendiri",
        "Data eksternal (harga pasar) tidak dipersist — selalu live fetch dengan cache singkat",
      ],
      image: "/images/duitku.svg",
      demoUrl: "https://duitku.app",
      featured: true,
      metrics: [
        { label: "Query terpola", value: "RLS-first" },
        { label: "State server", value: "React Query" },
        { label: "State client", value: "Zustand" },
        { label: "Persistensi eksternal", value: "0 tabel" },
      ],
      decisions: [
        {
          title: "RLS sebagai garis pertahanan, bukan sekadar filter UI",
          detail:
            "Setiap tabel user-scoped memakai policy auth.uid() = user_id. Service role tidak pernah terekspos ke client. API key disimpan sebagai hash dan diverifikasi di Edge Function.",
        },
        {
          title: "React Query untuk server state, Zustand untuk UI state",
          detail:
            "Cache, invalidasi, dan optimistic update milik React Query. Zustand hanya menyimpan filter tanggal, wallet aktif, dan preferensi tampilan — tidak ada duplikasi source of truth.",
        },
        {
          title: "Data pasar tidak disimpan",
          detail:
            "Harga portofolio di-fetch client-side saat halaman dibuka dengan stale-time pendek. Tidak ada cron sync, tidak ada tabel prices yang basi. Prinsipnya: persist hanya yang user buat.",
        },
      ],
    },
    {
      slug: "pln-pusmanpro",
      title: "PLN Pusmanpro",
      tagline: "Sistem enterprise untuk workflow dan dashboard BUMN.",
      description:
        "Aplikasi internal berbasis Next.js untuk lingkungan BUMN: dashboard operasional, alur approval berjenjang, pengelolaan data master, dan pelaporan PDF untuk kebutuhan audit dan manajemen.",
      problem:
        "Proses yang sebelumnya tersebar di spreadsheet dan dokumen manual sulit dilacak: siapa menyetujui apa, kapan, dan berdasarkan data versi mana. Dibutuhkan satu pintu dengan jejak audit yang bisa dipertanggungjawabkan.",
      role: "Frontend Engineer — dashboard, workflow UI, data management",
      period: "2023 — 2024",
      context: "Enterprise · BUMN · tim lintas fungsi",
      technologies: [
        "Next.js",
        "TypeScript",
        "TanStack React Query",
        "Zustand",
        "React Hook Form",
        "Axios",
        "Tailwind CSS",
        "Radix UI",
        "PDF tooling",
      ],
      highlights: [
        "Dashboard peran (role-based) dengan agregasi dan filter server-side",
        "Workflow approval bertingkat dengan status, komentar, dan riwayat",
        "Manajemen data master dengan validasi form yang ketat",
        "Ekspor laporan PDF siap cetak untuk kebutuhan formal",
        "Penanganan sesi, token refresh, dan error boundary yang konsisten",
      ],
      image: "/images/pusmanpro.svg",
      metrics: [
        { label: "Lingkungan", value: "Enterprise" },
        { label: "Fokus", value: "Workflow" },
        { label: "Output", value: "Audit-ready" },
      ],
      decisions: [
        {
          title: "Kontrak API dulu, UI kemudian",
          detail:
            "Setiap layar workflow dipetakan ke state machine yang eksplisit (draft → review → approved → published) sebelum komponen dibangun, sehingga edge case penolakan dan revisi tidak jadi if-else dadakan.",
        },
        {
          title: "Form sebagai data, bukan sekadar input",
          detail:
            "React Hook Form + skema validasi terpusat membuat aturan yang sama dipakai di create, edit, dan review — mengurangi bug inkonsistensi antar peran.",
        },
      ],
    },
    {
      slug: "dna-wedding-invitation",
      title: "DNA Wedding Invitation",
      tagline: "Undangan digital sebagai visual storytelling.",
      description:
        "Website undangan digital interaktif dengan narasi scroll: pembuka sinematik, galeri, hitung mundur, RSVP, dan amplop digital. Dibangun dengan Next.js, Tailwind, GSAP + ScrollTrigger.",
      problem:
        "Undangan digital kebanyakan terasa seperti template: berat, generik, dan tidak berkesan di HP. Tantangannya adalah membuat pengalaman yang ringan namun emosional — dibuka dalam 2 detik di koneksi seluler, tetap sinematik.",
      role: "Frontend Engineer — motion, storytelling, performa",
      period: "2023",
      context: "Client work · mobile-first",
      technologies: [
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "GSAP",
        "ScrollTrigger",
        "Framer Motion",
        "Vercel",
      ],
      highlights: [
        "Narasi scroll chapter-by-chapter dengan ScrollTrigger yang di-throttle",
        "Optimasi media agresif: gambar responsif, lazy section, preconnect font",
        "RSVP dan buku tamu dengan validasi dan anti-spam sederhana",
        "Amplop digital dan peta lokasi yang mobile-friendly",
        "Dukungan prefers-reduced-motion untuk aksesibilitas",
      ],
      image: "/images/dna.svg",
      demoUrl: "https://dna-invitation.vercel.app",
      metrics: [
        { label: "Pendekatan", value: "Mobile-first" },
        { label: "Motion", value: "Scroll-driven" },
        { label: "Aksesibilitas", value: "Reduced-motion" },
      ],
      decisions: [
        {
          title: "GSAP untuk scroll, Framer Motion untuk micro-interaction",
          detail:
            "ScrollTrigger menangani koreografi chapter yang presisi; Framer Motion untuk fade/scale kecil pada tombol dan modal. Tidak ada dua sistem animasi yang berebut satu elemen.",
        },
        {
          title: "Ceritakan dulu, hias kemudian",
          detail:
            "Struktur narasi (hook → cerita → detail acara → aksi) ditetapkan sebelum dekorasi. Setiap animasi harus melayani transisi antar chapter, bukan sekadar bergerak.",
        },
      ],
    },
  ],
  experienceSection: {
    eyebrow: "Pengalaman",
    titleA: "Terbiasa dengan",
    titleAccent: "sistem yang dipakai serius.",
    description:
      "Ringkasnya: 4 tahun JavaScript, dari freelance sampai enterprise BUMN — selalu dekat dengan data, auth, dan user.",
  },
  experiences: [
    {
      period: "2023 — Sekarang",
      role: "Frontend Engineer",
      org: "PLN Pusmanpro",
      context: "BUMN · Enterprise systems",
      points: [
        "Membangun dashboard dan workflow approval berjenjang dengan Next.js + TypeScript untuk kebutuhan operasional dan audit.",
        "Merancang pola data fetching dengan TanStack React Query: cache per-modul, invalidasi terarah, dan loading/error state yang konsisten.",
        "Menangani form kompleks lintas peran dengan React Hook Form dan validasi terpusat.",
        "Berkolaborasi dengan backend dan QA untuk kontrak API, token lifecycle, dan laporan PDF siap cetak.",
      ],
      stack: ["Next.js", "TypeScript", "React Query", "Zustand", "Tailwind", "Axios"],
    },
    {
      period: "2022 — Sekarang",
      role: "Independent Builder",
      org: "Duitku",
      context: "Produk pribadi · Supabase",
      points: [
        "Merancang skema PostgreSQL dengan RLS penuh: auth, transaksi multi-wallet, kategori, wishlist, dan API key.",
        "Memisahkan data milik user (dipersist) dari data pasar live (tidak dipersist) — prinsip arsitektur yang disengaja.",
        "Membangun laporan, chart, dan portfolio monitoring dengan performa yang dijaga lewat pagination dan agregasi server-side.",
      ],
      stack: ["Next.js", "Supabase", "PostgreSQL", "React Query", "shadcn/ui"],
    },
    {
      period: "2021 — 2023",
      role: "Web Developer",
      org: "Freelance & Client Work",
      context: "Website profesional & kreatif",
      points: [
        "Membangun website company profile, landing page, dan undangan digital interaktif (termasuk DNA Wedding Invitation dengan GSAP + ScrollTrigger).",
        "Fokus pada mobile-first, optimasi media, i18n (i18next), dan deployment Vercel.",
        "Terbiasa bekerja langsung dengan client: dari brief, revisi desain, hingga serah terima.",
      ],
      stack: ["React", "Next.js", "GSAP", "i18next", "Tailwind", "Vercel"],
    },
  ],
  skillsSection: {
    eyebrow: "Keahlian & Pendekatan",
    titleA: "Stack yang dalam,",
    titleAccent: "opini yang jelas.",
    description:
      "Teknologi hanyalah alat. Yang membedakan adalah keputusan kapan memakai apa — dan apa yang sengaja tidak dipakai.",
    rangeTitle: "Engineering range",
    rangeNote: "Satu orang, seluruh alur.",
    rangeItems: ["UI → state → API", "DB → auth → RLS", "PDF → i18n → deploy"],
  },
  skillGroups: [
    {
      title: "Core",
      note: "Yang saya pakai setiap hari.",
      items: ["TypeScript", "JavaScript", "React.js", "Next.js", "Tailwind CSS"],
    },
    {
      title: "Data & Backend",
      note: "Dari UI sampai database.",
      items: ["Supabase", "PostgreSQL", "Authentication", "Row Level Security", "Axios", "REST"],
    },
    {
      title: "State & Forms",
      note: "Dipilih sesuai masalah, bukan hype.",
      items: ["Zustand", "TanStack React Query", "React Hook Form"],
    },
    {
      title: "UI & Motion",
      note: "Presisi, bukan dekorasi.",
      items: ["shadcn/ui", "Radix UI", "Framer Motion", "GSAP", "i18next"],
    },
    {
      title: "Delivery",
      note: "Sampai ke tangan user.",
      items: ["Vercel", "PDF tooling", "SEO", "A11y", "Performance budgets"],
    },
  ],
  principles: [
    {
      title: "Struktur sebelum kecepatan mengetik",
      note: "Kontrak tipe, batas modul, dan aliran data ditetapkan dulu. Fitur cepat tidak berguna jika tidak bisa diubah enam bulan kemudian.",
    },
    {
      title: "Server state ≠ client state",
      note: "Cache milik React Query, preferensi UI milik Zustand. Tidak ada dua source of truth untuk satu data.",
    },
    {
      title: "Keamanan sebagai default",
      note: "RLS, validasi ganda (client + server), dan prinsip least-privilege — terutama untuk data finansial dan enterprise.",
    },
    {
      title: "Motion melayani narasi",
      note: "Animasi hanya ada jika membantu orientasi atau emosi. Hormati prefers-reduced-motion.",
    },
  ],
  contact: {
    eyebrow: "Kontak",
    titleA: "Punya masalah yang perlu",
    titleAccent: "dibereskan dengan rapi?",
    description:
      "Saya terbuka untuk full-time, kontrak, maupun freelance yang spesifik. Ceritakan konteksnya — saya akan jawab jujur apakah saya orang yang tepat.",
    copyEmail: "Salin email",
    copied: "Tersalin!",
    expectations: "Alurnya",
    availability: "Terbuka untuk proyek",
    steps: [
      {
        title: "Balasan < 48 jam",
        detail: "Ceritakan scope, timeline, dan stack yang dipakai sekarang.",
      },
      {
        title: "Diskusi 30 menit",
        detail: "Kita bedah problem, bukan sekadar fitur. Gratis, tanpa komitmen.",
      },
      {
        title: "Proposal jujur",
        detail: "Estimasi, risiko, dan alternatif — termasuk opsi 'tidak perlu saya'.",
      },
    ],
    availabilityNow: "Saat ini",
    capacity: "Kapasitas 1–2 proyek freelance per kuartal di luar pekerjaan utama.",
  },
  chatbot: {
    eyebrow: "Salman AI · Live",
    titleA: "Ngobrol dulu dengan",
    titleAccent: "kembaran digital saya.",
    description:
      "Terminal AI yang ditenagai Ollama (model dari env) dan tahu isi portofolio ini. Tanya soal stack, proyek, atau cara kerja saya — dijawab streaming, token demi token.",
    placeholder: "Tanya sesuatu… mis. “Ceritakan proyek Duitku”",
    greeting:
      "Halo! Saya Salman AI 👋 — kembaran digital yang hafal portofolio ini. Mau tanya soal skill, proyek Duitku / PLN Pusmanpro, atau ketersediaan freelance? Ketik aja, saya jawab cepat.",
    prompts: [
      "Ceritakan proyek Duitku",
      "Skill apa yang paling dikuasai?",
      "Pengalaman di PLN Pusmanpro?",
      "Apakah tersedia untuk freelance?",
    ],
    send: "Kirim",
    stop: "Stop",
    clear: "Reset",
    thinking: "Salman AI mengetik",
    online: "online · Ollama",
    modelLabel: "model",
    terminalTitle: "salman-ai — ollama console",
    disclaimer: "Ditenagai Ollama · model & key dari env · bisa salah, verifikasi via email.",
  },
  footer: {
    tagline:
      "Calm · Precise · Technical · Thoughtful · Reliable · Human. Dibangun dengan Next.js, Tailwind, dan perhatian pada detail.",
  },
  cv: {
    title: "Curriculum Vitae",
    back: "Kembali",
    print: "Cetak / Simpan PDF",
    summary:
      "Sekitar 4 tahun pengalaman JavaScript — dari UI, state management, API, database, authentication, hingga deployment.",
    experience: "Pengalaman",
    projects: "Proyek pilihan",
    skills: "Keahlian",
  },
  caseStudy: {
    back: "Semua proyek",
    prefix: "Studi Kasus",
    role: "Peran",
    period: "Periode",
    demo: "Demo",
    stack: "Stack",
    live: "Langsung",
    internal: "Internal",
    problem: "Problem",
    built: "Yang dibangun",
    decisions: "Keputusan teknis",
    technologies: "Teknologi",
    moreProjects: "Proyek lain",
    nextCase: "Studi berikutnya",
  },
  metadata: {
    siteTitle: "Muhamad Salman Adhim Baqy — Web Developer / Frontend Engineer",
    siteDescription:
      "Portofolio Muhamad Salman Adhim Baqy, Web Developer dengan ±4 tahun pengalaman JavaScript. Membangun aplikasi Next.js yang terstruktur dan cepat untuk BUMN, institusi, dan produk independen — dari UI, API, database, auth, hingga deployment.",
    ogDescription:
      "Saya membangun aplikasi web yang terstruktur, cepat, dan memiliki pengalaman pengguna yang matang.",
    twitterDescription: "Next.js · TypeScript · Supabase · Enterprise & produk independen.",
    cvTitle: "CV",
    cvDescription: "CV Muhamad Salman Adhim Baqy — Web Developer / Frontend Engineer.",
    caseStudySuffix: "— Studi Kasus",
  },
};

const en: Dictionary = {
  nav: {
    about: "About",
    projects: "Projects",
    experience: "Experience",
    skills: "Skills",
    contact: "Contact",
    ai: "Ask AI",
    hireMe: "Hire me",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    backToTop: "Back to top",
    skipToContent: "Skip to content",
    toggleToLight: "Switch to light mode",
    toggleToDark: "Switch to dark mode",
    themeHint: "Theme (D)",
    switchLanguage: "Language",
  },
  hero: {
    role: "Web Developer / Frontend Engineer",
    availability: "Available for projects",
    statement:
      "I build web applications that are well-structured, fast, and mature in user experience.",
    statementExtra:
      "I focus on tidy architecture, measurable performance, and interaction details that stay out of the way.",
    ctaProjects: "View projects",
    ctaContact: "Contact me",
    ctaCv: "Download CV",
    stats: [
      "Years of JavaScript experience",
      "Featured projects",
      "Technologies mastered",
    ],
  },
  about: {
    eyebrow: "About",
    titleA: "An engineer who thinks like",
    titleAccent: "a product owner.",
    description:
      "About 4 years building with JavaScript — from fast landing pages to enterprise systems used daily.",
    greeting: "Hi, I'm Salman.",
    highlight: "state-owned enterprises and government institutions",
    paragraphs: [
      "I'm a Web Developer / Frontend Engineer comfortable working end to end: sketching UI, managing state, designing APIs and database schemas, handling authentication, all the way to deploying on Vercel.",
      "Much of my time has been spent around state-owned enterprises and government institutions — places where “works on my machine” isn't enough. There I learned to write auditable workflows, role-proof forms, and dashboards that stay sane at scale.",
      "On the other side I built Duitku as an exercise in product discipline: separating user-owned data that must be persisted from live external data that should never be stored. A small principle with outsized maintainability payoff.",
    ],
    principle:
      "How I work is simple: understand the problem first, agree on the data contract, then build the UI.",
    values: [
      {
        title: "Maintainable architecture",
        body: "Small modules, explicit types, one-way data flow. I write code as if the next reader is me six months from now — tired and on a deadline.",
      },
      {
        title: "Security & data correctness",
        body: "At home with auth, Supabase RLS, double validation, and audit trails for enterprise systems. Financial and government data leaves no room for 'almost right'.",
      },
      {
        title: "Performance as a feature",
        body: "Pagination, server-side aggregation, lazy sections, and JavaScript budgets. Speed isn't about scores — it's about trust when the app is used every day.",
      },
      {
        title: "Mature UX, not noisy",
        body: "Whitespace, type hierarchy, and calm micro-motion. I'd rather ship one precise 200ms transition than ten shouting animations.",
      },
    ],
  },
  projectsSection: {
    eyebrow: "Selected Projects",
    titleA: "Real work,",
    titleAccent: "not a logo list.",
    description:
      "Three projects that best explain how I think: one finance product, one enterprise system, one creative experience.",
    note: "Each project lists the problem, my role, technical decisions, and its case study.",
    featured: "Featured",
    problem: "Problem",
    viewCaseStudy: "View Case Study",
    liveDemo: "Live demo",
    internalDemo: "Internal — demo on request",
  },
  projects: [
    {
      slug: "duitku",
      title: "Duitku",
      tagline: "A personal finance tracker that respects data ownership.",
      description:
        "A personal finance tracking app built with Next.js and Supabase. Multi-wallet transactions, categories and wishlists, reports with charts, and portfolio monitoring — with clear data principles.",
      problem:
        "Most finance trackers mix user-owned data with live external market data, then persist both for no good reason. Schemas bloat, audits get hard, and data goes stale. Duitku separates the two: user data is persisted under strict RLS, live external data is only fetched on demand.",
      role: "Solo builder — product, frontend, backend (Supabase), deployment",
      period: "2024 — present",
      context: "Independent product · Supabase + Next.js",
      technologies: [
        "Next.js",
        "TypeScript",
        "Supabase",
        "PostgreSQL",
        "Row Level Security",
        "TanStack React Query",
        "Zustand",
        "React Hook Form",
        "Tailwind CSS",
        "shadcn/ui",
        "Vercel",
      ],
      highlights: [
        "Multi-wallet transactions with inter-wallet transfers and balance reconciliation",
        "Categories + wishlists with budget allocation and progress",
        "Monthly reports, cash-flow charts, and portfolio summaries",
        "Per-user API keys for revocable programmatic access",
        "Supabase Auth + RLS: users can only read and write their own data",
        "External data (market prices) never persisted — always live-fetched with short cache",
      ],
      image: "/images/duitku.svg",
      demoUrl: "https://duitku.app",
      featured: true,
      metrics: [
        { label: "Query pattern", value: "RLS-first" },
        { label: "Server state", value: "React Query" },
        { label: "Client state", value: "Zustand" },
        { label: "External persistence", value: "0 tables" },
      ],
      decisions: [
        {
          title: "RLS as the line of defense, not just UI filtering",
          detail:
            "Every user-scoped table enforces an auth.uid() = user_id policy. The service role is never exposed to the client. API keys are stored hashed and verified in an Edge Function.",
        },
        {
          title: "React Query for server state, Zustand for UI state",
          detail:
            "Caching, invalidation, and optimistic updates belong to React Query. Zustand only holds date filters, the active wallet, and display preferences — no duplicated source of truth.",
        },
        {
          title: "Market data is never stored",
          detail:
            "Portfolio prices are fetched client-side when the page opens, with a short stale time. No sync crons, no stale prices table. The principle: persist only what the user creates.",
        },
      ],
    },
    {
      slug: "pln-pusmanpro",
      title: "PLN Pusmanpro",
      tagline: "Enterprise system for state-company workflows and dashboards.",
      description:
        "An internal Next.js application for a state-owned enterprise environment: operational dashboards, tiered approval flows, master data management, and PDF reporting for audit and management needs.",
      problem:
        "Processes previously scattered across spreadsheets and manual documents were hard to trace: who approved what, when, and against which version of the data. The organization needed a single front door with an accountable audit trail.",
      role: "Frontend Engineer — dashboards, workflow UI, data management",
      period: "2023 — 2024",
      context: "Enterprise · State-owned · cross-functional team",
      technologies: [
        "Next.js",
        "TypeScript",
        "TanStack React Query",
        "Zustand",
        "React Hook Form",
        "Axios",
        "Tailwind CSS",
        "Radix UI",
        "PDF tooling",
      ],
      highlights: [
        "Role-based dashboards with server-side aggregation and filtering",
        "Tiered approval workflows with statuses, comments, and history",
        "Master data management with strict form validation",
        "Print-ready PDF exports for formal reporting",
        "Consistent session handling, token refresh, and error boundaries",
      ],
      image: "/images/pusmanpro.svg",
      metrics: [
        { label: "Environment", value: "Enterprise" },
        { label: "Focus", value: "Workflow" },
        { label: "Output", value: "Audit-ready" },
      ],
      decisions: [
        {
          title: "API contract first, UI second",
          detail:
            "Every workflow screen was mapped to an explicit state machine (draft → review → approved → published) before components were built, so rejection and revision edge cases never became improvised if-else chains.",
        },
        {
          title: "Forms as data, not just inputs",
          detail:
            "React Hook Form plus a centralized validation schema means the same rules run on create, edit, and review — cutting cross-role inconsistency bugs.",
        },
      ],
    },
    {
      slug: "dna-wedding-invitation",
      title: "DNA Wedding Invitation",
      tagline: "A digital invitation as visual storytelling.",
      description:
        "An interactive digital wedding invitation with scroll-driven narrative: a cinematic opening, gallery, countdown, RSVP, and digital envelope. Built with Next.js, Tailwind, GSAP + ScrollTrigger.",
      problem:
        "Most digital invitations feel templated: heavy, generic, and unimpressive on phones. The challenge was crafting an experience that feels light yet emotional — opening in 2 seconds on mobile data, still cinematic.",
      role: "Frontend Engineer — motion, storytelling, performance",
      period: "2023",
      context: "Client work · mobile-first",
      technologies: [
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "GSAP",
        "ScrollTrigger",
        "Framer Motion",
        "Vercel",
      ],
      highlights: [
        "Chapter-by-chapter scroll narrative with throttled ScrollTrigger",
        "Aggressive media optimization: responsive images, lazy sections, font preconnect",
        "RSVP and guestbook with validation and simple anti-spam",
        "Mobile-friendly digital envelope and venue map",
        "prefers-reduced-motion support for accessibility",
      ],
      image: "/images/dna.svg",
      demoUrl: "https://dna-invitation.vercel.app",
      metrics: [
        { label: "Approach", value: "Mobile-first" },
        { label: "Motion", value: "Scroll-driven" },
        { label: "Accessibility", value: "Reduced-motion" },
      ],
      decisions: [
        {
          title: "GSAP for scroll, Framer Motion for micro-interactions",
          detail:
            "ScrollTrigger handles precise chapter choreography; Framer Motion covers small fades and scales on buttons and modals. No two animation systems ever fight over one element.",
        },
        {
          title: "Story first, decoration second",
          detail:
            "The narrative structure (hook → story → event details → action) was fixed before decoration. Every animation must serve a chapter transition, never just move.",
        },
      ],
    },
  ],
  experienceSection: {
    eyebrow: "Experience",
    titleA: "Used to",
    titleAccent: "systems taken seriously.",
    description:
      "In short: 4 years of JavaScript, from freelance to state-owned enterprise — always close to data, auth, and users.",
  },
  experiences: [
    {
      period: "2023 — Present",
      role: "Frontend Engineer",
      org: "PLN Pusmanpro",
      context: "State-owned · Enterprise systems",
      points: [
        "Built dashboards and tiered approval workflows with Next.js + TypeScript for operational and audit needs.",
        "Designed data-fetching patterns with TanStack React Query: per-module caching, targeted invalidation, and consistent loading/error states.",
        "Handled complex cross-role forms with React Hook Form and centralized validation.",
        "Collaborated with backend and QA on API contracts, token lifecycles, and print-ready PDF reports.",
      ],
      stack: ["Next.js", "TypeScript", "React Query", "Zustand", "Tailwind", "Axios"],
    },
    {
      period: "2022 — Present",
      role: "Independent Builder",
      org: "Duitku",
      context: "Personal product · Supabase",
      points: [
        "Designed a PostgreSQL schema with full RLS: auth, multi-wallet transactions, categories, wishlists, and API keys.",
        "Separated user-owned data (persisted) from live market data (never persisted) — a deliberate architecture principle.",
        "Built reports, charts, and portfolio monitoring kept fast via pagination and server-side aggregation.",
      ],
      stack: ["Next.js", "Supabase", "PostgreSQL", "React Query", "shadcn/ui"],
    },
    {
      period: "2021 — 2023",
      role: "Web Developer",
      org: "Freelance & Client Work",
      context: "Professional & creative websites",
      points: [
        "Built company profiles, landing pages, and interactive digital invitations (including DNA Wedding Invitation with GSAP + ScrollTrigger).",
        "Focused on mobile-first, media optimization, i18n (i18next), and Vercel deployment.",
        "Used to working directly with clients: from brief and design revisions to handover.",
      ],
      stack: ["React", "Next.js", "GSAP", "i18next", "Tailwind", "Vercel"],
    },
  ],
  skillsSection: {
    eyebrow: "Skills & Approach",
    titleA: "Deep stack,",
    titleAccent: "clear opinions.",
    description:
      "Technology is just a tool. What sets work apart is deciding when to use what — and what to deliberately leave out.",
    rangeTitle: "Engineering range",
    rangeNote: "One person, the whole flow.",
    rangeItems: ["UI → state → API", "DB → auth → RLS", "PDF → i18n → deploy"],
  },
  skillGroups: [
    {
      title: "Core",
      note: "What I reach for daily.",
      items: ["TypeScript", "JavaScript", "React.js", "Next.js", "Tailwind CSS"],
    },
    {
      title: "Data & Backend",
      note: "From UI to database.",
      items: ["Supabase", "PostgreSQL", "Authentication", "Row Level Security", "Axios", "REST"],
    },
    {
      title: "State & Forms",
      note: "Chosen for the problem, not the hype.",
      items: ["Zustand", "TanStack React Query", "React Hook Form"],
    },
    {
      title: "UI & Motion",
      note: "Precision, not decoration.",
      items: ["shadcn/ui", "Radix UI", "Framer Motion", "GSAP", "i18next"],
    },
    {
      title: "Delivery",
      note: "Into users' hands.",
      items: ["Vercel", "PDF tooling", "SEO", "A11y", "Performance budgets"],
    },
  ],
  principles: [
    {
      title: "Structure before typing speed",
      note: "Type contracts, module boundaries, and data flow come first. Shipping fast is useless if it can't change six months later.",
    },
    {
      title: "Server state ≠ client state",
      note: "Cache belongs to React Query, UI preferences to Zustand. No two sources of truth for one piece of data.",
    },
    {
      title: "Security by default",
      note: "RLS, double validation (client + server), and least privilege — especially for financial and enterprise data.",
    },
    {
      title: "Motion serves narrative",
      note: "Animation exists only if it aids orientation or emotion. Respect prefers-reduced-motion.",
    },
  ],
  contact: {
    eyebrow: "Contact",
    titleA: "Have a problem worth",
    titleAccent: "solving properly?",
    description:
      "I'm open to full-time, contract, and well-scoped freelance. Tell me the context — I'll honestly say whether I'm the right person.",
    copyEmail: "Copy email",
    copied: "Copied!",
    expectations: "What to expect",
    availability: "Available for projects",
    steps: [
      {
        title: "Reply < 48 hours",
        detail: "Tell me the scope, timeline, and current stack.",
      },
      {
        title: "30-minute call",
        detail: "We dissect the problem, not just the features. Free, no commitment.",
      },
      {
        title: "Honest proposal",
        detail: "Estimates, risks, and alternatives — including the 'you don't need me' option.",
      },
    ],
    availabilityNow: "Currently",
    capacity: "Capacity for 1–2 freelance projects per quarter alongside my main work.",
  },
  chatbot: {
    eyebrow: "Salman AI · Live",
    titleA: "Chat first with",
    titleAccent: "my digital twin.",
    description:
      "An AI terminal powered by Ollama (model from env) that knows this portfolio inside out. Ask about the stack, projects, or how I work — answered streaming, token by token.",
    placeholder: "Ask anything… e.g. “Tell me about Duitku”",
    greeting:
      "Hey! I'm Salman AI 👋 — the digital twin that memorized this portfolio. Ask about skills, the Duitku / PLN Pusmanpro projects, or freelance availability. Just type, I answer fast.",
    prompts: [
      "Tell me about Duitku",
      "What skills stand out most?",
      "Experience at PLN Pusmanpro?",
      "Available for freelance?",
    ],
    send: "Send",
    stop: "Stop",
    clear: "Reset",
    thinking: "Salman AI is typing",
    online: "online · Ollama",
    modelLabel: "model",
    terminalTitle: "salman-ai — ollama console",
    disclaimer: "Powered by Ollama · model & key from env · may be wrong, verify via email.",
  },
  footer: {
    tagline:
      "Calm · Precise · Technical · Thoughtful · Reliable · Human. Built with Next.js, Tailwind, and attention to detail.",
  },
  cv: {
    title: "Curriculum Vitae",
    back: "Back",
    print: "Print / Save PDF",
    summary:
      "About 4 years of JavaScript experience — from UI, state management, APIs, databases, and authentication to deployment.",
    experience: "Experience",
    projects: "Selected projects",
    skills: "Skills",
  },
  caseStudy: {
    back: "All projects",
    prefix: "Case Study",
    role: "Role",
    period: "Period",
    demo: "Demo",
    stack: "Stack",
    live: "Live",
    internal: "Internal",
    problem: "Problem",
    built: "What was built",
    decisions: "Technical decisions",
    technologies: "Technologies",
    moreProjects: "More projects",
    nextCase: "Next case",
  },
  metadata: {
    siteTitle: "Muhamad Salman Adhim Baqy — Web Developer / Frontend Engineer",
    siteDescription:
      "Portfolio of Muhamad Salman Adhim Baqy, a Web Developer with ±4 years of JavaScript experience. Building structured, fast Next.js applications for state enterprises, institutions, and independent products — from UI, APIs, and databases to auth and deployment.",
    ogDescription:
      "I build web applications that are well-structured, fast, and mature in user experience.",
    twitterDescription: "Next.js · TypeScript · Supabase · Enterprise & independent products.",
    cvTitle: "CV",
    cvDescription: "CV of Muhamad Salman Adhim Baqy — Web Developer / Frontend Engineer.",
    caseStudySuffix: "— Case Study",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { id, en };

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];

export const projectSlugs: string[] = id.projects.map((p) => p.slug);

export const getProject = (locale: Locale, slug: string): Project | undefined =>
  dictionaries[locale].projects.find((p) => p.slug === slug);
