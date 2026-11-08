type PageHeaderProps = {
  eyebrow?: string
  title: string
  description: string
  action?: React.ReactNode
}

export const PageHeader = ({
  eyebrow = "Konten",
  title,
  description,
  action,
}: PageHeaderProps) => (
  <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
    <div>
      <p className="font-mono text-[9px] tracking-[0.2em] text-signal uppercase">
        {eyebrow}
      </p>
      <h1 className="mt-1.5 text-2xl font-medium tracking-[-0.02em] text-foreground">
        {title}
      </h1>
      <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
    {action}
  </div>
)
