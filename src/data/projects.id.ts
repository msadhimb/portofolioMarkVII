import type { Project } from "./projects";

export const projects: Project[] = [
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
  ];
