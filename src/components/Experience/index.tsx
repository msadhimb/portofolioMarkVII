"use client";

import { Building2 } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge } from "@/components/ui/badge";

export const Experience = () => {
  const { dict } = useLanguage();
  const { experiences, experienceSection: t } = dict;

  return (
    <section
      id="experience"
      aria-label="Experience"
      className="scroll-mt-24 border-t border-border bg-card/40 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            index="03"
            eyebrow={t.eyebrow}
            title={
              <>
                {t.titleA}{" "}
                <span className="font-display font-normal italic text-signal">
                  {t.titleAccent}
                </span>
              </>
            }
          >
            {t.description}
          </SectionHeading>
        </Reveal>

        <ol className="mt-12 space-y-0">
          {experiences.map((e, i) => (
            <Reveal key={e.org} delay={0.04 * i}>
              <li className="grid gap-4 border-t border-border py-8 last:border-b sm:grid-cols-[180px_1fr] sm:gap-8">
                <div>
                  <p className="tabular font-mono text-xs text-muted-foreground">{e.period}</p>
                  <Badge variant="outline" className="mt-2 h-auto gap-1.5 rounded-full px-2.5 py-1 text-xs font-normal text-muted-foreground">
                    <Building2 className="size-3.5" />
                    {e.context}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">
                    {e.role} <span className="font-normal text-muted-foreground">· {e.org}</span>
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {e.points.map((pt) => (
                      <li
                        key={pt}
                        className="flex gap-3 text-[15px] leading-relaxed text-muted-foreground"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[9px] size-1.5 shrink-0 rounded-full bg-signal"
                        />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 font-mono text-xs text-muted-foreground">
                    {e.stack.join(" · ")}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
};
