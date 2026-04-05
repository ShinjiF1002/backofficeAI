interface PageHeaderProps {
  title: string
  subtitle?: string
}

/**
 * JP-safe page heading. Enforces `tracking-normal leading-[1.4]` for JP content
 * (never tracking-tight per CLAUDE.md §JP typography) and a consistent H1 scale
 * across all pages.
 */
export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header>
      <h1 className="text-2xl font-semibold tracking-normal leading-[1.4]">{title}</h1>
      {subtitle && (
        <p className="text-muted-foreground mt-1 text-sm leading-[1.4]">{subtitle}</p>
      )}
    </header>
  )
}
