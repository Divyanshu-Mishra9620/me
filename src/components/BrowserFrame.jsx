import { Lock } from "lucide-react";

/* Minimal browser window chrome around a project screenshot. */
export default function BrowserFrame({ url, className = "", children }) {
  const host = new URL(url).hostname;
  return (
    <div
      className={`overflow-hidden rounded-[1.1rem] border border-line bg-surface shadow-soft ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-line bg-surface-2/70 px-3.5 py-2.5 sm:px-4">
        <div className="flex shrink-0 gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="mx-auto flex min-w-0 items-center gap-1.5 rounded-full bg-bg/80 px-3 py-1 text-[11px] text-muted sm:text-xs">
          <Lock className="size-3 shrink-0" aria-hidden="true" />
          <span className="truncate">{host}</span>
        </div>
        <div className="hidden w-[46px] shrink-0 sm:block" />
      </div>
      {children}
    </div>
  );
}
