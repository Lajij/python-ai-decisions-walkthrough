"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CLAIMS,
  COMPANY,
  CONFIDENCE_THRESHOLD,
  HUMAN_THRESHOLD,
  URGENCY_LEVELS,
  isAutoRouted,
  queueFor,
  type Claim,
} from "./data";
import { Bar, Panel, PyCode } from "./ui";

/* ------------------------------------------------------------------ */
/* Stage 1: the problem today                                          */
/* ------------------------------------------------------------------ */

const GLUE_CODE = `# claims_intake/triage.py  (today)
resp = node_sidecar.post("/classify", json={"note": note})  # JS-only SDK
text = resp.json()["text"]

# "Sure! This sounds like it's probably a home claim, though
#  it could be motor too. I'd say it's fairly urgent..."

if "home" in text.lower():
    claim_type = "home"
elif "motor" in text.lower() or "car" in text.lower():
    claim_type = "motor"
else:
    claim_type = "unknown"          # most of the queue ends up here

urgent = "urgent" in text and "not urgent" not in text
confidence = None                   # the prose never says how sure it is`;

export function StageProblem() {
  const pains = [
    {
      k: "01",
      title: "The SDK speaks JavaScript",
      body: "The claims service is Python. To use AI, the team stands up a Node sidecar just to call a model.",
    },
    {
      k: "02",
      title: "The model answers in prose",
      body: "A paragraph comes back. Someone writes regex to guess the claim type, and nothing says how sure the model was.",
    },
    {
      k: "03",
      title: "A vendor and a key per model",
      body: "Every model is a new contract, a new secret and a new invoice. Nobody can see what decisions cost.",
    },
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.25fr]">
      <div className="flex flex-col gap-3">
        {pains.map((p) => (
          <div key={p.k} className="rounded-xl border border-border bg-card p-4 fade-in">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 font-mono text-[11px] text-danger">{p.k}</span>
              <div>
                <p className="text-sm font-medium">{p.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{p.body}</p>
              </div>
            </div>
          </div>
        ))}
        <div className="rounded-xl border border-dashed border-border p-4 text-sm leading-relaxed text-muted">
          Result at {COMPANY}: claim notes sit in one shared inbox until a person reads every single one.
        </div>
      </div>
      <Panel
        title={<span className="font-mono text-xs">claims_intake/triage.py</span>}
        right={
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-danger">
            <span className="h-1.5 w-1.5 rounded-full bg-danger" /> glue code
          </span>
        }
      >
        <PyCode code={GLUE_CODE} highlight={[2, 5, 6, 13, 16]} />
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4 text-center">
          {[
            ["Services to run", "2", "Python + Node sidecar"],
            ["Output", "prose", "parsed by regex"],
            ["Confidence", "none", "can't branch on it"],
          ].map(([l, v, s]) => (
            <div key={l} className="rounded-lg bg-card-2 px-2 py-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-subtle">{l}</p>
              <p className="mt-1 text-lg font-semibold text-danger">{v}</p>
              <p className="text-[11px] text-muted">{s}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stage 2: uv add ai + typed question                                 */
/* ------------------------------------------------------------------ */

const SNIPPET = `import ai
from ai.ops import experimental as jev

model = ai.get_model("typesafe-ai/jev")   # routed through AI Gateway

async def triage(note: str):
    result = await jev.evaluate(model, {"note": note}, {
        "claim_type": jev.ChoiceQuestion(
            instructions="What kind of insurance claim is this?",
            criteria={"motor": None, "home": None, "travel": None,
                      "health": None, "other": None},
        ),
        "urgency": jev.ScoreQuestion(
            instructions="How quickly does this customer need help?",
            criteria=["routine", "this week", "within 48h", "today", "right now"],
        ),
        "needs_human": jev.NoulQuestion(
            instructions="A claims officer should review this first.",
        ),
    })
    a = result.value
    if a["claim_type"].confidence >= 0.85 and a["needs_human"].noul < 0.5:
        return route(a["claim_type"].choice, a["urgency"].score)
    return send_to_claims_officer(note)`;

type TermLine = { t: string; cls?: string };
const TERM: TermLine[] = [
  { t: "$ uv add ai", cls: "text-foreground" },
  { t: "Resolved packages in 0.4s", cls: "text-subtle" },
  { t: " + ai", cls: "text-success" },
  { t: "$ export AI_GATEWAY_API_KEY=••••••••••••", cls: "text-foreground" },
  { t: "# on Vercel: uv add \"ai[vercel]\" and use OIDC instead", cls: "text-subtle" },
  { t: "$ uv run python triage.py", cls: "text-foreground" },
];

export function StageInstall() {
  const [lines, setLines] = useState(0);
  const [ran, setRan] = useState(false);
  useEffect(() => {
    if (lines >= TERM.length) return;
    const t = window.setTimeout(() => setLines((n) => n + 1), lines === 0 ? 300 : 420);
    return () => window.clearTimeout(t);
  }, [lines]);
  useEffect(() => {
    if (lines < TERM.length) return;
    const t = window.setTimeout(() => setRan(true), 700);
    return () => window.clearTimeout(t);
  }, [lines]);

  const sample = CLAIMS[1];
  return (
    <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
      <Panel
        title={<span className="font-mono text-xs">claims_intake/triage.py</span>}
        right={<span className="font-mono text-[10px] uppercase tracking-wider text-success">Python 3.12+</span>}
      >
        <PyCode code={SNIPPET} highlight={[1, 4, 8, 13, 17, 22]} />
        <p className="mt-3 border-t border-border pt-3 font-mono text-[10.5px] text-subtle">
          Illustrative snippet based on the AI SDK for Python beta docs (ai.ops.experimental.evaluate).
        </p>
      </Panel>
      <div className="flex flex-col gap-4">
        <Panel title={<span className="font-mono text-xs">Terminal</span>} bodyClassName="p-4 min-h-[172px]">
          <div className="font-mono text-[12.5px] leading-[1.8]">
            {TERM.slice(0, lines).map((l, i) => (
              <div key={i} className={`fade-in ${l.cls ?? ""}`}>
                {l.t}
              </div>
            ))}
            {lines < TERM.length ? <span className="pulse-dot inline-block h-3.5 w-2 bg-white/80 align-middle" /> : null}
          </div>
        </Panel>
        <Panel
          title={<span className="font-mono text-xs">result.value</span>}
          right={
            ran ? (
              <span className="font-mono text-[10px] text-subtle">{sample.latencyMs} ms · example</span>
            ) : null
          }
          bodyClassName="p-4 min-h-[210px]"
        >
          {!ran ? (
            <div className="space-y-2">
              <div className="shimmer h-4 w-3/4 rounded" />
              <div className="shimmer h-4 w-2/3 rounded" />
              <div className="shimmer h-4 w-1/2 rounded" />
            </div>
          ) : (
            <div className="space-y-3 fade-in">
              <p className="rounded-md bg-card-2 p-2.5 text-[12.5px] italic leading-relaxed text-muted">
                “{sample.note}”
              </p>
              <AnswerRow label="claim_type" kind="ChoiceAnswer" value={`"${sample.choice}"`} meta={`confidence ${sample.confidence.toFixed(2)}`} bar={sample.confidence} tone="success" />
              <AnswerRow label="urgency" kind="ScoreAnswer" value={`${sample.urgency.toFixed(1)} / 4`} meta={URGENCY_LEVELS[Math.round(sample.urgency)]} bar={sample.urgency / 4} tone="warn" />
              <AnswerRow label="needs_human" kind="NoulAnswer" value={sample.needsHuman.toFixed(2)} meta="probability true" bar={sample.needsHuman} tone="blue" />
              <div className="flex items-center justify-between rounded-md border border-success/30 bg-success/10 px-3 py-2 text-[12.5px]">
                <span className="text-success">→ Auto-routed to {queueFor(sample)}</span>
                <span className="font-mono text-[10px] text-success/80">typed · branchable</span>
              </div>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

function AnswerRow({
  label,
  kind,
  value,
  meta,
  bar,
  tone,
}: {
  label: string;
  kind: string;
  value: string;
  meta: string;
  bar: number;
  tone: "success" | "warn" | "blue";
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-2 font-mono text-[12px]">
        <span>
          <span className="text-foreground">{label}</span>{" "}
          <span className="text-blue">{kind}</span>
        </span>
        <span>
          <span className="text-foreground">{value}</span>{" "}
          <span className="text-subtle">· {meta}</span>
        </span>
      </div>
      <Bar value={bar} tone={tone} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stage 3: live triage board                                          */
/* ------------------------------------------------------------------ */

type Row = { claim: Claim; done: boolean };

export function StageBoard() {
  const [rows, setRows] = useState<Row[]>([]);
  const [run, setRun] = useState(0);
  const idx = useRef(0);

  useEffect(() => {
    idx.current = 0;
    const timers: number[] = [];
    const tick = () => {
      const i = idx.current;
      if (i >= CLAIMS.length) return;
      idx.current = i + 1;
      const claim = CLAIMS[i];
      setRows((r) => [{ claim, done: false }, ...r]);
      timers.push(
        window.setTimeout(() => {
          setRows((r) => r.map((x) => (x.claim.id === claim.id ? { ...x, done: true } : x)));
        }, 450 + claim.latencyMs * 2),
      );
      timers.push(window.setTimeout(tick, 1250));
    };
    timers.push(window.setTimeout(tick, 400));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [run]);

  const done = rows.filter((r) => r.done);
  const auto = done.filter((r) => isAutoRouted(r.claim)).length;
  const human = done.length - auto;
  const avgLatency = done.length ? Math.round(done.reduce((s, r) => s + r.claim.latencyMs, 0) / done.length) : 0;
  const streaming = rows.length < CLAIMS.length || done.length < CLAIMS.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Claim notes in" value={`${rows.length}`} sub={`of ${CLAIMS.length} example notes`} />
        <Stat label="Auto-routed" value={`${auto}`} sub={`confidence ≥ ${CONFIDENCE_THRESHOLD}`} tone="success" />
        <Stat label="Sent to a person" value={`${human}`} sub={`needs_human ≥ ${HUMAN_THRESHOLD} or unsure`} tone="warn" />
        <Stat label="Avg decision" value={avgLatency ? `${avgLatency} ms` : "—"} sub="example latency" />
      </div>
      <Panel
        title={
          <span className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${streaming ? "bg-success pulse-dot" : "bg-subtle"}`} />
            {COMPANY} · claims-intake (Python)
          </span>
        }
        right={
          <button
            type="button"
            onClick={() => {
              setRows([]);
              setRun((n) => n + 1);
            }}
            className="rounded-md border border-border px-2.5 py-1 text-xs text-muted transition hover:border-foreground/40 hover:text-foreground"
          >
            ↻ Replay
          </button>
        }
        bodyClassName="p-0"
      >
        <div className="grid grid-cols-[92px_1fr_150px_120px_120px_160px] gap-3 border-b border-border bg-black/40 px-4 py-2 font-mono text-[10.5px] uppercase tracking-wider text-subtle">
          <span>Claim</span>
          <span>Note</span>
          <span>claim_type</span>
          <span>urgency</span>
          <span>needs_human</span>
          <span>Decision</span>
        </div>
        <div className="h-[392px] overflow-hidden">
          {rows.map(({ claim, done }) => (
            <BoardRow key={`${run}-${claim.id}`} claim={claim} done={done} />
          ))}
        </div>
      </Panel>
    </div>
  );
}

function BoardRow({ claim, done }: { claim: Claim; done: boolean }) {
  const auto = isAutoRouted(claim);
  return (
    <div className="row-in grid grid-cols-[92px_1fr_150px_120px_120px_160px] items-center gap-3 border-b border-border/60 px-4 py-2.5 text-[12.5px]">
      <div>
        <p className="font-mono text-foreground">{claim.id}</p>
        <p className="font-mono text-[10px] text-subtle">{claim.channel}</p>
      </div>
      <p className="truncate text-muted" title={claim.note}>
        {claim.note}
      </p>
      {!done ? (
        <>
          <div className="shimmer h-3.5 rounded" />
          <div className="shimmer h-3.5 rounded" />
          <div className="shimmer h-3.5 rounded" />
          <span className="font-mono text-[11px] text-subtle">evaluating…</span>
        </>
      ) : (
        <>
          <div className="fade-in">
            <div className="flex items-baseline justify-between font-mono">
              <span className="text-foreground">{claim.choice}</span>
              <span className={claim.confidence >= CONFIDENCE_THRESHOLD ? "text-success" : "text-warn"}>
                {claim.confidence.toFixed(2)}
              </span>
            </div>
            <div className="mt-1">
              <Bar value={claim.confidence} tone={claim.confidence >= CONFIDENCE_THRESHOLD ? "success" : "warn"} />
            </div>
          </div>
          <div className="fade-in font-mono">
            <span className="text-foreground">{claim.urgency.toFixed(1)}</span>
            <span className="text-subtle"> / 4</span>
            <p className="text-[10px] text-subtle">{URGENCY_LEVELS[Math.round(claim.urgency)]}</p>
          </div>
          <div className="fade-in font-mono">
            <span className={claim.needsHuman >= HUMAN_THRESHOLD ? "text-warn" : "text-foreground"}>
              {claim.needsHuman.toFixed(2)}
            </span>
            <p className="text-[10px] text-subtle">{claim.latencyMs} ms</p>
          </div>
          <div className="fade-in">
            {auto ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[11px] text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> Auto-routed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-warn/30 bg-warn/10 px-2 py-0.5 text-[11px] text-warn">
                <span className="h-1.5 w-1.5 rounded-full bg-warn" /> Sent to a person
              </span>
            )}
            <p className="mt-0.5 font-mono text-[10px] text-subtle">→ {queueFor(claim)}</p>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value, sub, tone }: { label: string; value: string; sub: string; tone?: "success" | "warn" }) {
  const c = tone === "success" ? "text-success" : tone === "warn" ? "text-warn" : "text-foreground";
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3">
      <p className="font-mono text-[10.5px] uppercase tracking-wider text-subtle">{label}</p>
      <p className={`mt-1 text-2xl font-semibold tabular-nums tracking-tight ${c}`}>{value}</p>
      <p className="text-[11px] text-muted">{sub}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stage 4: value                                                      */
/* ------------------------------------------------------------------ */

export function StageValue() {
  const [model, setModel] = useState<"jev" | "llm">("jev");
  const spend = useMemo(
    () => [
      { m: "typesafe-ai/jev", use: "claim triage decisions", req: "48,210", cost: "$61.40", share: 0.34 },
      { m: "openai/gpt-5.6", use: "customer letter drafts", req: "3,904", cost: "$118.75", share: 0.66 },
    ],
    [],
  );
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="One key" badge="AI Gateway">
          <div className="space-y-3">
            <div className="rounded-lg bg-card-2 p-3 font-mono text-[12px]">
              <span className="text-subtle">AI_GATEWAY_API_KEY</span>
              <span className="text-foreground">=••••••••</span>
            </div>
            <p className="text-sm leading-relaxed text-muted">
              Every model the Python team calls goes through one Gateway key, or OIDC when the service runs on Vercel. No
              new vendor account per model.
            </p>
          </div>
        </Panel>
        <Panel title="Model choice is a config line" badge="Swap">
          <div className="space-y-3">
            <div className="flex gap-1 rounded-lg border border-border p-1 text-xs">
              {(["jev", "llm"] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setModel(k)}
                  className={`flex-1 rounded-md px-2 py-1.5 transition ${model === k ? "bg-white text-black" : "text-muted hover:text-foreground"}`}
                >
                  {k === "jev" ? "Decisions" : "Drafting"}
                </button>
              ))}
            </div>
            <div className="rounded-lg bg-card-2 p-3 font-mono text-[12px]">
              <span className="text-subtle">model = ai.get_model(</span>
              <span key={model} className="fade-in text-success">
                &quot;{model === "jev" ? "typesafe-ai/jev" : "openai/gpt-5.6"}&quot;
              </span>
              <span className="text-subtle">)</span>
            </div>
            <p className="text-sm leading-relaxed text-muted">Same SDK, same key, same code path. Pick the right model for each job.</p>
          </div>
        </Panel>
        <Panel title="Spend you can see" badge="Example figures">
          <div className="space-y-3">
            {spend.map((s) => (
              <div key={s.m}>
                <div className="mb-1 flex items-baseline justify-between font-mono text-[12px]">
                  <span className="text-foreground">{s.m}</span>
                  <span className="text-foreground">{s.cost}</span>
                </div>
                <div className="mb-1 flex justify-between text-[11px] text-subtle">
                  <span>{s.use}</span>
                  <span>{s.req} requests</span>
                </div>
                <Bar value={s.share} tone={s.m.includes("jev") ? "success" : "blue"} />
              </div>
            ))}
            <p className="text-[11px] text-subtle">Example month for a fictional team. Not real pricing.</p>
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Panel title="Time to ship an AI decision" badge="Example figures">
          <div className="space-y-4">
            <ShipRow
              label="Before"
              tone="danger"
              weeks={6}
              steps={["Node sidecar", "Prompt + regex parser", "New vendor contract", "Separate dashboard"]}
            />
            <ShipRow label="With AI SDK for Python + AI Gateway" tone="success" weeks={1} steps={["uv add ai", "Typed question", "Branch on confidence"]} />
          </div>
        </Panel>
        <div className="grid-bg flex flex-col justify-center rounded-xl border border-border bg-card p-6">
          <p className="font-mono text-[11px] uppercase tracking-wider text-subtle">The value</p>
          <p className="mt-2 text-2xl font-semibold leading-snug tracking-tight">
            AI decisions inside the Python you already run.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>· The decision lives next to the code that acts on it.</li>
            <li>· Confident answers route themselves; people get the hard ones.</li>
            <li>· One Gateway for keys, models and spend.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function ShipRow({ label, tone, weeks, steps }: { label: string; tone: "danger" | "success"; weeks: number; steps: string[] }) {
  const c = tone === "danger" ? "bg-danger" : "bg-success";
  const t = tone === "danger" ? "text-danger" : "text-success";
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-sm">{label}</span>
        <span className={`font-mono text-sm ${t}`}>
          ~{weeks} {weeks === 1 ? "week" : "weeks"}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${c} transition-all duration-1000`} style={{ width: `${(weeks / 6) * 100}%` }} />
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {steps.map((s) => (
          <span key={s} className="rounded-md border border-border bg-card-2 px-2 py-0.5 font-mono text-[10.5px] text-muted">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
