# NalaSetu — Predictive Drain Dispatch

**Track:** Heat & Water · WeMakeDevs × AWS Environmental Hacks 2026 (Oct 8–11, 2026)

**Live app (primary, on AWS):** https://main.d2ui5wwbz0rjfy.amplifyapp.com/login — use Demo Mode on the login page (Municipal Officer)
**Backup link:** https://nalasetu-sujalgiriiitp-sources-projects.vercel.app
**Repository:** https://github.com/sujalgiriiitp-source/NalaSetu.git

> 72-hour rain forecast → drain-wise choke-risk scores → crew-hour-optimized cleaning plans → before/after AI photo verification → honest projected-impact board.

Cities waterlog after rain not only because it rains, but because the drains that matter were already choked and limited crews cleaned the wrong ones first. NalaSetu ranks every drain segment by an explainable risk score, builds a dispatch plan that fits inside real crew-hours, and closes the loop with photo proof that is AI-checked and human-verified — so a municipal officer can show *which* drains were cleaned, *why* those first, and *what* it changed.

## What it does

1. **Risk scoring** — Each of the drain segments gets a choke-risk score (HIGH / MEDIUM / LOW) from the 72-hour rain forecast (live Open-Meteo), drain history, slope and citizen reports. The formula and the per-drain reasons are shown on screen — it is a planning score, not a flood guarantee, and it is labelled that way.
2. **Dispatch planning** — "Generate Pre-Rain Cleaning Plan" selects the drains that fit the available crew-hours (verified live: 24 drains — all 10 HIGH + 14 MEDIUM — in 11.7 of 15 crew-hours over a 27.0 km route) and dispatches them to crews.
3. **Crew proof loop** — Crew app walks Start → En Route → Cleaning → Submit Proof with before/after photos. Demo photos in this flow are synthetic and labelled as such in the app.
4. **AI verification + human gate** — Photo proof is verified (Amazon Bedrock Nova Lite; the Test Lab shows a real Bedrock run, PASS 95% verified live). Low-confidence or failed checks route to a human officer queue (Needs Review) — AI never silently auto-approves.
5. **Impact board** — Completed work, high-risk coverage, crew-hours used and projected exposure reduction, every number labelled PROJECTED/ESTIMATED with its formula.

Pages: Dashboard · Risk Map (Leaflet / OpenStreetMap) · Drains · Citizen Reports · Dispatch · Crew · Officer Queue · Impact · Test Lab · Settings (with the full AWS stack health shown).

## Built on AWS (region: ap-south-1)

| Layer | Service |
|---|---|
| Hosting | AWS Amplify Hosting (this app) |
| API | Amazon API Gateway → AWS Lambda (`nalasetu-api`) |
| Data | Amazon DynamoDB |
| Proof photos | Amazon S3 (`nalasetu-proof-2026`, private bucket, Block Public Access on) |
| Weather refresh | Amazon EventBridge → Lambda (Open-Meteo forecast) |
| Photo verification | Amazon Bedrock (Nova Lite) |
| Observability | Amazon CloudWatch |

The app also runs a full client-side demo mode (local store), so it works end-to-end without backend credentials; the AWS wiring above is what's live in the Amplify deployment.

## Run it locally

You need Node.js and npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)).

```sh
git clone https://github.com/sujalgiriiitp-source/NalaSetu.git
cd NalaSetu
npm i
npm run dev
```

Other scripts: `npm run build` (production build), `npm run preview`, `npm test` (vitest), `npm run lint`.

### S3 & IAM configuration (backend)

1. The S3 bucket (`nalasetu-proof-2026`) must remain **PRIVATE**. Do NOT disable Block Public Access.
2. The Lambda execution role needs this minimal inline policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::nalasetu-proof-2026/*"
    }
  ]
}
```

3. Set the `S3_BUCKET` environment variable on the Lambda function to `nalasetu-proof-2026`.

## Architecture notes

- Domain logic lives as pure functions in `src/lib/nalasetu/` (risk, dispatch, state-machine, impact, verify) — testable and UI-independent.
- Demo state is a single client store persisted to localStorage; every task status change goes through `transition()`, so invalid transitions are rejected and every change is audited.
- Proof verification results store their mode on each result, so AI-assisted vs real Bedrock runs stay honestly labelled; failures/low confidence go to NEEDS_REVIEW.
- Weather comes from the `/api/weather` server route (Open-Meteo) with cached → demo fallback, and the source label is always shown on screen.
- Sign-in goes through an `AuthAdapter` interface (demo adapter today; a Cognito adapter can replace it).

## Honesty labels (please read before judging the numbers)

- Drain registry and citizen reports are a **demo dataset**; impact numbers are **PROJECTED/ESTIMATED**, with formulas shown in the app.
- Weather forecast is **live** (Open-Meteo). Switching Settings → Weather source between Demo (Heavy Rain 55mm scenario) and Live changes the scores honestly — on a dry day you will see mostly MEDIUM/LOW, and that is the correct behaviour.
- Crew-flow demo photos are **synthetic and labelled** in the app; the Test Lab Bedrock verification is a real run.
- Risk scores are a prioritisation aid for cleaning crews, not a flood prediction.

## Built with

React · TypeScript · TanStack Start · Tailwind CSS · Leaflet / OpenStreetMap · Recharts — scaffolded with [Lovable](https://lovable.dev), then extended and wired to the AWS backend above.

## AI-tool disclosure

This project was built during the hackathon window (repository created 8 Oct 2026, after the event clock started) with AI assistance: Lovable (app scaffolding/UI generation) and GitHub Copilot (code assistance). All AI-generated output was reviewed, tested and deployed by the author; the demo script, verification runs and this README were prepared with AI assistance and human verification of every claim against the live app.

## Credits

- Weather data: [Open-Meteo](https://open-meteo.com) (free API)
- Maps & tiles: [OpenStreetMap](https://www.openstreetmap.org) contributors, via Leaflet

## How to test in 30 seconds

Login → Demo access (Municipal Officer) → Generate Pre-Rain Cleaning Plan → Dispatch All → Crew view → Use sample demo photos (synthetic) → Submit Proof → Officer queue → Approve → Impact.
