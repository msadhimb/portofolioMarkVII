import type { Project } from "./projects";

export const projects: Project[] = [
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
  ];
