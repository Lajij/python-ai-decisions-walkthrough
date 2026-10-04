export const COMPANY = "Kookaburra Mutual";

export type Stage = {
  id: number;
  label: string;
  headline: string;
  issue: string;
};

export const STAGES: Stage[] = [
  {
    id: 0,
    label: "The problem today",
    headline: "Your Python team wants AI decisions. The tooling sends them somewhere else.",
    issue:
      "The claims service is Python. The AI tooling assumed JavaScript, a separate vendor per model, and a big prompt that answers in prose someone then has to parse.",
  },
  {
    id: 1,
    label: "One package, one typed question",
    headline: "uv add ai. Ask a typed question. Get a typed answer back.",
    issue:
      "The AI SDK for Python puts the decision right next to the code that acts on it. Jev answers with a choice, a score, a probability and a confidence, not a paragraph.",
  },
  {
    id: 2,
    label: "Live triage board",
    headline: "Claim notes stream in. Every one gets a decision the code can branch on.",
    issue:
      "Confident decisions route themselves. Anything uncertain goes straight to a person. Same Python service, no glue code, no separate control plane.",
  },
  {
    id: 3,
    label: "The value",
    headline: "One Gateway for every AI decision your Python team ships.",
    issue:
      "One key, one bill, model choice as a config line, and spend you can actually see. The team ships in the service it already owns.",
  },
];

export type ClaimType = "motor" | "home" | "travel" | "health" | "other";
export const CLAIM_TYPES: ClaimType[] = ["motor", "home", "travel", "health", "other"];

export type Claim = {
  id: string;
  channel: string;
  note: string;
  choice: ClaimType;
  probabilities: Record<ClaimType, number>;
  confidence: number; // ChoiceAnswer.confidence
  urgency: number; // ScoreAnswer.score on 0..4
  needsHuman: number; // NoulAnswer.noul
  latencyMs: number;
};

const p = (m: number, h: number, t: number, he: number, o: number): Record<ClaimType, number> => ({
  motor: m,
  home: h,
  travel: t,
  health: he,
  other: o,
});

// Example data only. Fictional claim notes for a fictional insurer.
export const CLAIMS: Claim[] = [
  {
    id: "CLM-24081",
    channel: "App",
    note: "Rear-ended at the lights on Parramatta Rd. Bumper and tail-light damaged, other driver's details attached.",
    choice: "motor",
    probabilities: p(0.96, 0.01, 0.01, 0.01, 0.01),
    confidence: 0.96,
    urgency: 1.2,
    needsHuman: 0.07,
    latencyMs: 92,
  },
  {
    id: "CLM-24082",
    channel: "Phone",
    note: "Burst pipe under the kitchen sink overnight, water through the floorboards. Family of four, need a plumber today.",
    choice: "home",
    probabilities: p(0.0, 0.94, 0.0, 0.01, 0.05),
    confidence: 0.94,
    urgency: 3.4,
    needsHuman: 0.21,
    latencyMs: 104,
  },
  {
    id: "CLM-24083",
    channel: "Email",
    note: "Checked bag never arrived in Bali. Receipts for toiletries and clothes attached.",
    choice: "travel",
    probabilities: p(0.0, 0.02, 0.93, 0.0, 0.05),
    confidence: 0.93,
    urgency: 1.5,
    needsHuman: 0.11,
    latencyMs: 88,
  },
  {
    id: "CLM-24084",
    channel: "App",
    note: "Hail storm in Brisbane last night. Roof tiles cracked and the windscreen on the car in the driveway is smashed.",
    choice: "home",
    probabilities: p(0.41, 0.52, 0.0, 0.0, 0.07),
    confidence: 0.54,
    urgency: 2.9,
    needsHuman: 0.74,
    latencyMs: 117,
  },
  {
    id: "CLM-24085",
    channel: "Portal",
    note: "Six physio sessions after a fall at the gym. Invoices attached.",
    choice: "health",
    probabilities: p(0.0, 0.0, 0.0, 0.91, 0.09),
    confidence: 0.91,
    urgency: 0.8,
    needsHuman: 0.12,
    latencyMs: 79,
  },
  {
    id: "CLM-24086",
    channel: "Phone",
    note: "Hit a kangaroo outside Dubbo. Car isn't drivable, towed into town, need a hire car to get home.",
    choice: "motor",
    probabilities: p(0.97, 0.0, 0.02, 0.0, 0.01),
    confidence: 0.97,
    urgency: 3.1,
    needsHuman: 0.18,
    latencyMs: 96,
  },
  {
    id: "CLM-24087",
    channel: "Email",
    note: "Gum tree came down across the fence and onto the neighbour's shed. Not sure whose policy this falls under.",
    choice: "home",
    probabilities: p(0.0, 0.63, 0.0, 0.0, 0.37),
    confidence: 0.63,
    urgency: 2.2,
    needsHuman: 0.81,
    latencyMs: 121,
  },
  {
    id: "CLM-24088",
    channel: "App",
    note: "Flight out of Auckland cancelled for weather. Extra night in a hotel, booking confirmation attached.",
    choice: "travel",
    probabilities: p(0.0, 0.0, 0.95, 0.0, 0.05),
    confidence: 0.95,
    urgency: 1.1,
    needsHuman: 0.09,
    latencyMs: 84,
  },
  {
    id: "CLM-24089",
    channel: "Portal",
    note: "Break-in while we were away for the weekend. Laptop and jewellery taken, police event number included.",
    choice: "home",
    probabilities: p(0.0, 0.9, 0.0, 0.0, 0.1),
    confidence: 0.9,
    urgency: 2.6,
    needsHuman: 0.38,
    latencyMs: 101,
  },
  {
    id: "CLM-24090",
    channel: "Phone",
    note: "Chipped a molar on holiday in Fiji, saw a local dentist. Not sure if this is travel or my health cover.",
    choice: "travel",
    probabilities: p(0.0, 0.0, 0.55, 0.4, 0.05),
    confidence: 0.55,
    urgency: 1.4,
    needsHuman: 0.67,
    latencyMs: 112,
  },
  {
    id: "CLM-24091",
    channel: "App",
    note: "Small kitchen fire, smoke damage right through the house. Staying with family, kids' school uniforms gone.",
    choice: "home",
    probabilities: p(0.0, 0.92, 0.0, 0.0, 0.08),
    confidence: 0.92,
    urgency: 3.8,
    needsHuman: 0.66,
    latencyMs: 98,
  },
  {
    id: "CLM-24092",
    channel: "Email",
    note: "Windscreen chip from a truck on the M1, about the size of a 20c coin. Photo attached.",
    choice: "motor",
    probabilities: p(0.95, 0.0, 0.0, 0.0, 0.05),
    confidence: 0.95,
    urgency: 0.6,
    needsHuman: 0.06,
    latencyMs: 81,
  },
];

export const CONFIDENCE_THRESHOLD = 0.85;
export const HUMAN_THRESHOLD = 0.5;

export function isAutoRouted(c: Claim) {
  return c.confidence >= CONFIDENCE_THRESHOLD && c.needsHuman < HUMAN_THRESHOLD;
}

export function queueFor(c: Claim) {
  if (!isAutoRouted(c)) return "claims-officer";
  return c.urgency >= 3 ? `${c.choice}-priority` : `${c.choice}-standard`;
}

export const URGENCY_LEVELS = ["routine", "this week", "within 48h", "today", "right now"];
