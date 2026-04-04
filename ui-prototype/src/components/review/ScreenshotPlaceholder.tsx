interface ScreenshotPlaceholderProps {
  workflowName: string
  stepName: string
  hasError?: boolean
  size?: 'full' | 'compact'
}

export default function ScreenshotPlaceholder({
  workflowName,
  stepName,
  hasError = false,
  size = 'full',
}: ScreenshotPlaceholderProps) {
  const isCompact = size === 'compact'

  return (
    <div className="rounded-lg border border-border overflow-hidden bg-white">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        </div>
        <div className="flex-1 bg-white rounded px-3 py-0.5 text-[10px] text-muted-foreground border">
          https://banking-app.internal/operations
        </div>
      </div>

      {/* App nav tabs */}
      <div className="flex border-b border-border bg-slate-50">
        {['ホーム', '送金', '口座', '請求書'].map((tab, i) => (
          <div
            key={tab}
            className={`px-3 py-1.5 text-[11px] border-r border-border ${
              i === 1 ? 'bg-white font-medium text-foreground' : 'text-muted-foreground'
            }`}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Fake app content */}
      <div className={`${isCompact ? 'p-3' : 'p-5'} space-y-3`}>
        {/* Header bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`${isCompact ? 'text-xs' : 'text-sm'} font-semibold text-slate-700`}>
              送金依頼詳細
            </div>
            <div className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] rounded font-medium">
              承認待ち
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground">2026/04/04 09:12</div>
        </div>

        {/* Form fields */}
        <div className={`border rounded-md ${isCompact ? 'p-2' : 'p-4'} bg-slate-50/50 space-y-2`}>
          <FormRow label="依頼番号" value="TX-0158" compact={isCompact} />
          <FormRow label="送金先口座" value="みずほ銀行 本店 普通 ***-1234" compact={isCompact} />
          <div className="border-t border-dashed border-slate-200 pt-2 mt-2">
            <FormRow
              label="画面上の金額"
              value="¥1,250,000"
              compact={isCompact}
              highlight={hasError ? 'neutral' : 'ok'}
            />
            <FormRow
              label="書類上の金額"
              value={hasError ? '¥1,350,000' : '¥1,250,000'}
              compact={isCompact}
              highlight={hasError ? 'error' : 'ok'}
            />
          </div>
          {hasError && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-red-50 border border-red-200 rounded text-[10px] text-red-700 font-medium">
              金額不一致を検出: 差分 ¥100,000
            </div>
          )}
          {!hasError && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 border border-emerald-200 rounded text-[10px] text-emerald-700 font-medium">
              金額一致を確認済み
            </div>
          )}
        </div>

        {/* Action buttons placeholder */}
        {!isCompact && (
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-slate-200 text-slate-500 text-[10px] rounded">承認</div>
            <div className="px-3 py-1 bg-slate-100 text-slate-400 text-[10px] rounded border border-slate-200">差し戻し</div>
          </div>
        )}
      </div>

      {/* Label */}
      <div className="px-3 py-1.5 bg-slate-50 border-t border-border text-[10px] text-muted-foreground">
        スクリーンショット — {workflowName} / {stepName}
      </div>
    </div>
  )
}

function FormRow({
  label,
  value,
  compact,
  highlight,
}: {
  label: string
  value: string
  compact: boolean
  highlight?: 'ok' | 'error' | 'neutral'
}) {
  const textSize = compact ? 'text-[10px]' : 'text-xs'
  const highlightClass =
    highlight === 'error'
      ? 'text-red-700 font-bold bg-red-50 px-1 rounded'
      : highlight === 'ok'
      ? 'text-emerald-700 font-semibold'
      : ''

  return (
    <div className={`flex justify-between items-center ${textSize}`}>
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-mono ${highlightClass}`}>{value}</span>
    </div>
  )
}
