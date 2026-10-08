import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "NalaSetu — Municipal drain operations" },
    { name: "description", content: "Prioritize, dispatch and verify pre-rain municipal drain cleaning." },
    { property: "og:title", content: "NalaSetu — Municipal drain operations" },
    { property: "og:description", content: "Plan and verify municipal drain cleaning before rainfall." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  beforeLoad: () => { throw redirect({ to: "/login" }); },
});
