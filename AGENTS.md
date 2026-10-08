<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# NalaSetu — architecture rules

- Domain logic lives as pure functions in `src/lib/nalasetu/` (risk, dispatch, state-machine, impact, verify) — keeps the formulas testable and UI-independent.
- Demo state is a single client store (`store.tsx`) persisted to localStorage — the app must run fully without any backend credentials.
- Proof verification runs server-side via `verifyProof` (AI Gateway, structured output); any AI failure or low confidence routes to NEEDS_REVIEW, never auto-approves. Mode is stored on each result so labels stay honest.
- Weather comes from the `/api/weather` server route (Open-Meteo) with cached → demo fallback; the source label must always be shown.
- Leaflet is only loaded via `LazyMap` (ClientOnly + lazy import) — it touches `window` at import time and would break SSR.
- All task status changes go through `transition()` so invalid transitions are rejected and every change is audited.
- Uploaded-photo charts and PDF reports share `groupTestTrends` local-calendar aggregation with Monday-start weeks; per-outcome rates use each cohort’s run count and empty cohorts return null — keeps reports consistent without implying zero-valued measurements.
- Sign-in goes through the `AuthAdapter` interface in `src/lib/nalasetu/auth.tsx` (DemoAuthAdapter today; a Cognito adapter can replace it) and pages are gated client-side by `RequireRole` — keeps the app running without credentials while allowing a real provider later.
