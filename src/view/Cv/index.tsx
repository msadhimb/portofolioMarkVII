"use client";

import Link from "next/link";
import { ArrowLeft, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { PrintButton } from "@/components/PrintButton";
import { siteConfig } from "@/data/profile";

export const CvView = () => {
  const { dict } = useLanguage();

  return (
    <main id="main" className="mx-auto max-w-3xl px-5 py-12 sm:px-8 print:py-0">
      <div className="mb-8 flex items-center justify-between print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> {dict.cv.back}
        </Link>
        <PrintButton label={dict.cv.print} />
      </div>

      <article className="rounded-3xl border border-border bg-card p-8 sm:p-12 print:border-0 print:p-0">
        <header>
          <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
            {dict.cv.title}
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">{siteConfig.siteName}</h1>
          <p className="mt-1 text-lg text-muted-foreground">{dict.hero.role}</p>
          <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" /> {siteConfig.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Mail className="size-3.5" /> {siteConfig.email}
            </span>
          </p>
          <p className="mt-4 border-l-2 border-signal pl-4 text-[15px] leading-relaxed">
            {dict.hero.statement} {dict.cv.summary}
          </p>
        </header>

        <section className="mt-10">
          <h2 className="font-mono text-xs font-semibold tracking-[0.18em] uppercase">
            {dict.cv.experience}
          </h2>
          <div className="mt-4 space-y-6">
            {dict.experiences.map((e) => (
              <div key={e.org}>
                <p className="flex flex-wrap items-baseline justify-between gap-2">
                  <strong className="text-[15px]">
                    {e.role} · {e.org}
                  </strong>
                  <span className="font-mono text-xs text-muted-foreground">{e.period}</span>
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
                  {e.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-mono text-xs font-semibold tracking-[0.18em] uppercase">
            {dict.cv.projects}
          </h2>
          <div className="mt-4 space-y-4">
            {dict.projects.map((p) => (
              <div key={p.slug}>
                <p className="text-[15px] font-semibold">
                  {p.title} <span className="font-normal text-muted-foreground">— {p.tagline}</span>
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-mono text-xs font-semibold tracking-[0.18em] uppercase">
            {dict.cv.skills}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {dict.skillGroups.map((g) => (
              <div key={g.title}>
                <p className="text-sm font-semibold">{g.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{g.items.join(" · ")}</p>
              </div>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
};
