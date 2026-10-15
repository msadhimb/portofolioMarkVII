"use client";

import Link from "next/link";
import { ArrowLeft, Mail, MapPin } from "lucide-react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { getExperiences, getProjects, getSkillGroups } from "@/data/localized";
import idHero from "../../components/Hero/i18n/id";
import enHero from "../../components/Hero/i18n/en";
import id from "./i18n/id";
import en from "./i18n/en";
import { PrintButton } from "@/components/PrintButton";
import { siteConfig } from "@/data/profile";

export const CvView = () => {
  i18next.addResourceBundle("id", "Hero", idHero);
  i18next.addResourceBundle("en", "Hero", enHero);
  i18next.addResourceBundle("id", "Cv", id);
  i18next.addResourceBundle("en", "Cv", en);
  const { t, i18n } = useTranslation("Cv");
  const { t: tHero } = useTranslation("Hero");
  const experiences = getExperiences(i18n.language);
  const projects = getProjects(i18n.language);
  const skillGroups = getSkillGroups(i18n.language);

  return (
    <main id="main" className="mx-auto max-w-3xl px-5 py-12 sm:px-8 print:py-0">
      <div className="mb-8 flex items-center justify-between print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> {t("back")}
        </Link>
        <PrintButton label={t("print")} />
      </div>

      <article className="rounded-3xl border border-border bg-card p-8 sm:p-12 print:border-0 print:p-0">
        <header>
          <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
            {t("title")}
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">{siteConfig.siteName}</h1>
          <p className="mt-1 text-lg text-muted-foreground">{tHero("role")}</p>
          <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" /> {siteConfig.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Mail className="size-3.5" /> {siteConfig.email}
            </span>
          </p>
          <p className="mt-4 border-l-2 border-signal pl-4 text-[15px] leading-relaxed">
            {tHero("statement")} {t("summary")}
          </p>
        </header>

        <section className="mt-10">
          <h2 className="font-mono text-xs font-semibold tracking-[0.18em] uppercase">
            {t("experience")}
          </h2>
          <div className="mt-4 space-y-6">
            {experiences.map((e) => (
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
            {t("projects")}
          </h2>
          <div className="mt-4 space-y-4">
            {projects.map((p) => (
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
            {t("skills")}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {skillGroups.map((g) => (
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
