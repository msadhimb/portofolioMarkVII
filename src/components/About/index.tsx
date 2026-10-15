"use client";

import { ShieldCheck, Layers, Gauge, HeartHandshake } from "lucide-react";
import { useTheme } from "next-themes";
import type { CSSProperties } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { SpotlightCard } from "@/components/SpotlightCard";

const icons = [Layers, ShieldCheck, Gauge, HeartHandshake];

const spotlightStyle = {
  padding: "1.25rem",
  borderRadius: "1rem",
  backgroundColor: "var(--card)",
  "--spotlight-card-surface": "var(--card)",
  "--spotlight-card-border": "color-mix(in srgb, var(--signal) 38%, transparent)",
} as CSSProperties;

export const About = () => {
  const { dict } = useLanguage();
  const { resolvedTheme } = useTheme();
  const [beforeHighlight, afterHighlight] = dict.about.paragraphs[1].split(dict.about.highlight);

  return (
    <section id="about" aria-label="About" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            index="01"
            eyebrow={dict.about.eyebrow}
            title={
              <>
                {dict.about.titleA}{" "}
                <span className="font-display font-normal italic text-signal">
                  {dict.about.titleAccent}
                </span>
              </>
            }
          >
            {dict.about.description}
          </SectionHeading>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <Reveal delay={0.05}>
            <div className="space-y-5 text-[15.5px] leading-relaxed text-muted-foreground">
              <p>
                <strong className="font-medium text-foreground">
                  {dict.about.greeting}
                </strong>{" "}
                {dict.about.paragraphs[0]}
              </p>
              <p>
                {beforeHighlight}
                <strong className="font-medium text-foreground">
                  {dict.about.highlight}
                </strong>
                {afterHighlight}
              </p>
              <p>{dict.about.paragraphs[2]}</p>
              <p className="border-l-2 border-signal pl-4 text-foreground">
                {dict.about.principle}
              </p>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {dict.about.values.map((v, i) => {
              const Icon = icons[i % icons.length];
              return (
                <Reveal key={v.title} delay={0.06 * i} className="h-full">
                  <SpotlightCard
                    spotlightColor="var(--signal)"
                    intensity={0.5}
                    spotlightSize={220}
                    theme={resolvedTheme === "light" ? "light" : "dark"}
                    className="h-full"
                    style={spotlightStyle}
                  >
                    <Icon className="size-5 text-signal" aria-hidden="true" />
                    <h3 className="mt-3 text-[15px] font-semibold tracking-tight text-foreground">
                      {v.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {v.body}
                    </p>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
