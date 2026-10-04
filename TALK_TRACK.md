# Talk track — AI decisions inside the Python you already run

**Length:** ~2.5 minutes · **Demo:** 4 stages, click "Next →" (or press →) to advance
**Scenario:** Kookaburra Mutual, a fictional Australian insurer. All data on screen is example data.

---

**[Open on Stage 1 — "The problem today"]**

Here's something I hear from almost every bank, insurer and retailer I sit down with in Australia and New Zealand.

Their most important back-office systems are written in Python. Claims intake. Fraud checks. Ops automation. That's where the data team and the engineers live.

And they want AI to make decisions inside those systems. Not write essays. Make decisions. Is this a motor claim or a home claim? How urgent is it? Does a person need to look at it?

But look at what they end up doing today. The AI tooling assumed JavaScript, so they stand up a separate Node service just to call a model. The model answers in a paragraph, so someone writes regex to guess what it meant. And there's no confidence anywhere — so the code can't tell a sure answer from a guess. The result? Every claim note still sits in one inbox until a person reads it.

**[Click Next → Stage 2 — "One package, one typed question"]**

This is what changes with Vercel's AI SDK for Python.

One line: `uv add ai`. One key for our AI Gateway. That's the setup.

Then the team asks a typed question, right inside the claims service they already own. What kind of claim is this — pick one. How urgent is it — on a scale. Does a person need to see it — yes or no, as a probability.

And watch what comes back on the right. Not a paragraph. A choice, a score, a probability, and a confidence number. Typed answers the code can branch on. If the model is sure, route it. If it isn't, send it to a person. That's the whole logic, sitting next to the code that acts on it.

**[Click Next → Stage 3 — "Live triage board". Let the notes stream in.]**

Now let's put it to work. These are claim notes coming into our fictional insurer.

A rear-end on Parramatta Road — motor, high confidence, auto-routed. A burst pipe with a family of four — home, urgent, straight into the priority queue. A hail storm that hit both the roof and the car? The model isn't sure — so it goes to a claims officer. Exactly what you want.

That's the shift. The confident, everyday claims route themselves in milliseconds. Your people spend their time on the hard ones — the ones that actually need a human.

**[Click Next → Stage 4 — "The value"]**

And here's why this matters to the business, not just the engineers.

Every one of these decisions runs through Vercel's AI Gateway. One key, instead of a vendor account per model. Picking a model is one line of config. And finance can see what AI decisions cost, by model, in one place.

But the real value is speed. Instead of weeks building a sidecar, a parser and a new vendor contract, the Python team ships the decision inside the service they already run.

**[Pause on the closing card]**

AI decisions, inside the Python you already run. That's what we're bringing to Python teams with Vercel.

If your teams are sitting on a pile of Python services and a list of decisions they'd love to automate, let's talk.
