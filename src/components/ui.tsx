import type { ReactNode } from "react";

export function VercelMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 76 65" fill="currentColor" aria-hidden>
      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
    </svg>
  );
}

export function Panel({
  title,
  badge,
  right,
  children,
  className = "",
  bodyClassName = "p-4",
}: {
  title: ReactNode;
  badge?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-xl border border-border bg-card ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <span className="text-sm font-medium">{title}</span>
        <div className="flex items-center gap-2">
          {right}
          {badge ? (
            <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted">
              {badge}
            </span>
          ) : null}
        </div>
      </div>
      <div className={`flex-1 ${bodyClassName}`}>{children}</div>
    </div>
  );
}

const PY_KEYWORDS = new Set([
  "import", "from", "as", "async", "await", "def", "return", "if", "else", "elif", "for", "in",
  "and", "or", "not", "None", "True", "False", "with", "while", "lambda",
]);

function highlightLine(line: string, key: number) {
  const out: ReactNode[] = [];
  const commentIdx = (() => {
    let inStr: string | null = null;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inStr) {
        if (ch === inStr) inStr = null;
      } else if (ch === '"' || ch === "'") inStr = ch;
      else if (ch === "#") return i;
    }
    return -1;
  })();
  const code = commentIdx >= 0 ? line.slice(0, commentIdx) : line;
  const comment = commentIdx >= 0 ? line.slice(commentIdx) : "";
  const re = /("[^"]*"|'[^']*'|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b|\s+|.)/g;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(code))) {
    const tok = m[0];
    let cls = "";
    if (tok.startsWith('"') || tok.startsWith("'")) cls = "text-success";
    else if (/^\d/.test(tok)) cls = "text-warn";
    else if (PY_KEYWORDS.has(tok)) cls = "text-purple";
    else if (/^[A-Z][A-Za-z]+Question$/.test(tok) || tok === "evaluate" || tok === "get_model") cls = "text-blue";
    out.push(
      <span key={i++} className={cls}>
        {tok}
      </span>,
    );
  }
  if (comment) out.push(<span key={i++} className="text-subtle">{comment}</span>);
  return (
    <div key={key} className="flex">
      <span className="mr-4 inline-block w-5 shrink-0 select-none text-right text-subtle/60">{key + 1}</span>
      <span className="whitespace-pre">{out.length ? out : " "}</span>
    </div>
  );
}

export function PyCode({ code, highlight = [] }: { code: string; highlight?: number[] }) {
  const lines = code.replace(/\n$/, "").split("\n");
  return (
    <pre className="overflow-x-auto font-mono text-[12.5px] leading-[1.7] text-foreground/90">
      {lines.map((l, idx) => (
        <div key={idx} className={highlight.includes(idx + 1) ? "-mx-4 bg-blue/10 px-4" : ""}>
          {highlightLine(l, idx)}
        </div>
      ))}
    </pre>
  );
}

export function Bar({ value, tone = "white" }: { value: number; tone?: "white" | "success" | "warn" | "danger" | "blue" }) {
  const color =
    tone === "success" ? "bg-success" : tone === "warn" ? "bg-warn" : tone === "danger" ? "bg-danger" : tone === "blue" ? "bg-blue" : "bg-white";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${Math.round(value * 100)}%` }} />
    </div>
  );
}

export function ExampleTag({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border border-warn/30 bg-warn/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-warn ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-warn" />
      Simulated walkthrough · example data
    </span>
  );
}
