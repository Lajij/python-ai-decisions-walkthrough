"use client";

import { useCallback, useEffect, useState } from "react";
import { COMPANY, STAGES } from "./data";
import { StageBoard, StageInstall, StageProblem, StageValue } from "./stages";
import { ExampleTag, VercelMark } from "./ui";

const LAST = STAGES.length - 1;

export function Walkthrough() {
  const [stage, setStage] = useState(0);
  const current = STAGES[stage];

  const next = useCallback(() => setStage((s) => Math.min(LAST, s + 1)), []);
  const prev = useCallback(() => setStage((s) => Math.max(0, s - 1)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-border">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-2.5 text-sm">
            <VercelMark className="h-4 w-4" />
            <span className="text-subtle">/</span>
            <span className="font-medium">AI SDK for Python</span>
            <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
              Public beta
            </span>
            <span className="text-subtle">/</span>
            <span className="text-muted">{COMPANY} claims-intake</span>
            <span className="text-[11px] text-subtle">(fictional insurer)</span>
          </div>
          <ExampleTag />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-7 px-6 py-8">
        <nav aria-label="Stages" className="grid grid-cols-4 gap-2">
          {STAGES.map((s) => {
            const active = s.id === stage;
            const passed = s.id < stage;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setStage(s.id)}
                className={`group flex flex-col gap-2 rounded-lg border px-3 py-2.5 text-left transition ${
                  active ? "border-white/70 bg-white/[0.04]" : "border-border hover:border-white/30"
                }`}
              >
                <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div className={`h-full bg-white transition-all duration-500 ${active || passed ? "w-full" : "w-0"}`} />
                </div>
                <span className="flex items-center gap-2 text-[13px]">
                  <span className={`font-mono text-[11px] ${active ? "text-foreground" : "text-subtle"}`}>0{s.id + 1}</span>
                  <span className={active ? "text-foreground" : "text-muted group-hover:text-foreground"}>{s.label}</span>
                </span>
              </button>
            );
          })}
        </nav>

        <section key={`h-${stage}`} className="fade-in space-y-2">
          <p className="font-mono text-[11px] uppercase tracking-wider text-subtle">Stage {stage + 1} of 4</p>
          <h1 className="max-w-4xl text-[28px] font-semibold leading-tight tracking-tight">{current.headline}</h1>
          <p className="max-w-3xl text-[15px] leading-relaxed text-muted">{current.issue}</p>
        </section>

        <section key={`s-${stage}`} className="fade-in">
          {stage === 0 ? <StageProblem /> : null}
          {stage === 1 ? <StageInstall /> : null}
          {stage === 2 ? <StageBoard /> : null}
          {stage === 3 ? <StageValue /> : null}
        </section>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-5">
          <button
            type="button"
            onClick={prev}
            disabled={stage === 0}
            className="rounded-md border border-border px-4 py-2 text-sm text-muted transition enabled:hover:border-white/40 enabled:hover:text-foreground disabled:opacity-30"
          >
            ← Back
          </button>
          <p className="hidden font-mono text-[11px] text-subtle md:block">Use ← → keys · Client-side simulation, no API keys needed</p>
          <button
            type="button"
            onClick={next}
            disabled={stage === LAST}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90 disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      </div>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-4 text-[11.5px] text-subtle">
          <span>
            {COMPANY} is fictional. Claim notes, latencies, spend and timelines are example figures for illustration.
          </span>
          <span className="flex flex-wrap gap-4">
            <a className="hover:text-foreground" href="https://vercel.com/blog/jev-for-python-engineers" target="_blank" rel="noreferrer">
              Blog: Jev for Python engineers ↗
            </a>
            <a className="hover:text-foreground" href="https://vercel.com/docs/ai-gateway/sdks-and-apis/ai-sdk-python" target="_blank" rel="noreferrer">
              AI Gateway docs ↗
            </a>
            <a className="hover:text-foreground" href="https://ai-python.dev/docs" target="_blank" rel="noreferrer">
              ai-python.dev ↗
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
