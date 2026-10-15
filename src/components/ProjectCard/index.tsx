import { ArrowUpRight, Lock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/data/projects";
export type ProjectLinksDict = {
  viewCaseStudy: string;
  liveDemo: string;
  internalDemo: string;
};
import { cn } from "@/lib/utils";

type ProjectVisualProps = {
  project: Project;
};

type TechListProps = {
  items: string[];
  limit?: number;
};

type ProjectLinksProps = {
  project: Project;
  dict: ProjectLinksDict;
};

/** Lightweight, code-driven visual preview — no image assets needed. */
export const ProjectVisual = ({ project }: ProjectVisualProps) => {
  if (project.slug === "duitku") {
    return (
      <div aria-hidden="true" className="p-6 sm:p-8">
        <div className="overflow-hidden rounded-xl border border-border bg-background">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-border" />
              <span className="size-2 rounded-full bg-border" />
              <span className="size-2 rounded-full bg-signal/70" />
            </div>
            <span className="font-mono text-[11px] text-muted-foreground">duitku.app/overview</span>
            <span className="rounded-full bg-emerald-500/12 px-2 py-0.5 font-mono text-[10px] text-emerald-700 dark:text-emerald-300">
              live
            </span>
          </div>
          <div className="grid gap-4 p-4 sm:grid-cols-3">
            {[
              ["Total aset", "Rp 48,2 jt", "+6,4%"],
              ["Arus kas", "+Rp 3,1 jt", "bulan ini"],
              ["Wishlist", "72%", "MacBook fund"],
            ].map(([l, v, d]) => (
              <div key={l} className="rounded-lg border border-border bg-card p-3">
                <p className="text-[11px] text-muted-foreground">{l}</p>
                <p className="tabular mt-1 font-mono text-sm font-semibold text-foreground">{v}</p>
                <p className="mt-0.5 font-mono text-[10px] text-emerald-700 dark:text-emerald-300">{d}</p>
              </div>
            ))}
            <div className="rounded-lg border border-border bg-card p-3 sm:col-span-2">
              <p className="text-[11px] text-muted-foreground">Arus kas · 6 bulan</p>
              <div className="mt-2 flex h-16 items-end gap-1.5">
                {[35, 55, 42, 70, 58, 88, 64, 92, 76, 100, 84, 96].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className={cn(
                      "flex-1 rounded-sm",
                      i >= 9 ? "bg-signal" : "bg-foreground/15"
                    )}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-[11px] text-muted-foreground">Wallets</p>
              <ul className="mt-2 space-y-1.5 font-mono text-[11px]">
                <li className="flex justify-between"><span>BCA</span><span className="tabular">12,4</span></li>
                <li className="flex justify-between"><span>E-Wallet</span><span className="tabular">3,8</span></li>
                <li className="flex justify-between text-muted-foreground"><span>Cash</span><span className="tabular">1,2</span></li>
              </ul>
              <p className="mt-2 rounded-md bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground">
                RLS ✓ user_id = auth.uid()
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (project.slug === "pln-pusmanpro") {
    return (
      <div aria-hidden="true" className="p-6 sm:p-8">
        <div className="overflow-hidden rounded-xl border border-border bg-background">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <span className="font-mono text-[11px] text-muted-foreground">pusmanpro · dashboard</span>
            <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              role: reviewer
            </span>
          </div>
          <div className="grid gap-4 p-4 sm:grid-cols-[0.9fr_1.4fr]">
            <ol className="space-y-2">
              {[
                ["Pengajuan A-1024", "review", true],
                ["Pengajuan A-1023", "approved", false],
                ["Pengajuan A-1022", "draft", false],
              ].map(([t, s, active]) => (
                <li
                  key={t as string}
                  className={cn(
                    "rounded-lg border p-2.5",
                    active ? "border-signal/50 bg-card" : "border-border bg-card"
                  )}
                >
                  <p className="font-mono text-[11px] font-medium text-foreground">{t}</p>
                  <p className="mt-1 inline-block rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                    {s}
                  </p>
                </li>
              ))}
            </ol>
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center gap-2">
                {["draft", "review", "approved"].map((s, i) => (
                  <span key={s} className="flex items-center gap-2 font-mono text-[10px]">
                    <span className={cn("rounded-full px-2 py-0.5", i <= 1 ? "bg-signal text-signal-foreground" : "bg-muted text-muted-foreground")}>
                      {s}
                    </span>
                    {i < 2 ? <span className="text-muted-foreground">→</span> : null}
                  </span>
                ))}
              </div>
              <div className="mt-3 space-y-1.5">
                <div className="h-2 rounded bg-muted" />
                <div className="h-2 w-4/5 rounded bg-muted" />
                <div className="h-2 w-3/5 rounded bg-muted" />
              </div>
              <div className="mt-3 flex gap-2">
                <span className="rounded-md bg-foreground px-2.5 py-1 font-mono text-[10px] text-background">Approve</span>
                <span className="rounded-md border border-border px-2.5 py-1 font-mono text-[10px] text-muted-foreground">Request changes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="p-6 sm:p-8">
      <div className="overflow-hidden rounded-xl border border-border bg-[#101010] text-[#f5f1e8]">
        <div className="px-6 pt-10 pb-6 text-center">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-60">The Wedding Of</p>
          <p className="font-display mt-2 text-3xl italic">D &amp; N</p>
          <p className="mt-1 font-mono text-[11px] opacity-70">Sabtu · 14 . 06 . 2025</p>
          <div className="mx-auto mt-5 flex max-w-[220px] justify-center gap-2 font-mono text-[11px]">
            {["02", "14", "33", "09"].map((v) => (
              <span key={v} className="flex-1 rounded-md border border-white/15 bg-white/5 px-2 py-1.5 tabular">
                {v}
              </span>
            ))}
          </div>
          <div className="mx-auto mt-5 h-16 w-px bg-gradient-to-b from-white/40 to-transparent" />
          <p className="font-mono text-[10px] tracking-widest uppercase opacity-50">scroll untuk cerita</p>
        </div>
      </div>
    </div>
  );
};

export const TechList = ({ items, limit }: TechListProps) => {
  const shown = limit ? items.slice(0, limit) : items;
  return (
    <ul aria-label="Technologies" className="flex flex-wrap gap-1.5">
      {shown.map((t) => (
        <li key={t}>
          <Badge variant="secondary" className="h-auto rounded-full px-2.5 py-1 font-mono text-[11px] font-normal">
            {t}
          </Badge>
        </li>
      ))}
      {limit && items.length > limit ? (
        <li>
          <Badge variant="outline" className="h-auto rounded-full px-2.5 py-1 font-mono text-[11px] font-normal">
            +{items.length - limit}
          </Badge>
        </li>
      ) : null}
    </ul>
  );
};

export const ProjectLinks = ({ project, dict }: ProjectLinksProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/projects/${project.slug}`}
        className="inline-flex h-9 items-center gap-1.5 rounded-full bg-foreground px-4 text-sm font-medium text-background transition-transform hover:-translate-y-px"
      >
        {dict.viewCaseStudy}
        <ArrowUpRight className="size-4" />
      </Link>
      {project.demoUrl ? (
        <a
          href={project.demoUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-4 text-sm text-foreground transition-colors hover:bg-muted"
        >
          {dict.liveDemo}
          <ArrowUpRight className="size-4" />
        </a>
      ) : (
        <span className="inline-flex h-9 items-center gap-1.5 rounded-full border border-dashed border-border px-4 text-sm text-muted-foreground">
          <Lock className="size-3.5" />
          {dict.internalDemo}
        </span>
      )}
    </div>
  );
};
