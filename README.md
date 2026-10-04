# AI decisions inside the Python you already run

A Vercel-branded, client-side **simulated walkthrough** (example data, no API keys needed) showing how an enterprise Python team adds typed AI decisions with Vercel's **AI SDK for Python** (public beta) and the **Jev** evaluation model via **AI Gateway**.

Scenario: *Kookaburra Mutual*, a fictional Australian insurer, triaging incoming claim notes. Four stages:

1. The problem today: JS-only SDK, prose output, regex glue code
2. `uv add ai` + one typed question (`ChoiceQuestion`, `ScoreQuestion`, `NoulQuestion`)
3. Live triage board: claim type, urgency, needs-a-person probability, confidence, latency
4. The value: one AI Gateway key, model choice as config, spend visibility, time to ship

All names, notes, latencies, spend and timelines are example figures.

- `TALK_TRACK.md`: 2–3 minute spoken script
- `LINKEDIN_CAPTION.md`: post caption

## Sources

- Blog: [Jev for Python engineers](https://vercel.com/blog/jev-for-python-engineers) (2 Oct 2026)
- Docs: [AI SDK for Python on AI Gateway](https://vercel.com/docs/ai-gateway/sdks-and-apis/ai-sdk-python)
- Docs: [ai-python.dev](https://ai-python.dev/docs) (`ai.ops.experimental.evaluate`)

## Develop

```bash
npm install
npm run dev
```
