import { _ as createFileRoute, g as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as stringType, i as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/map-DBDWqfEo.js
var $$splitComponentImporter = () => import("./map-BzY52Fzn.mjs");
var Route = createFileRoute("/map")({
	validateSearch: objectType({ drain: stringType().optional() }),
	head: () => ({ meta: [
		{ title: "Risk Map — NalaSetu" },
		{
			name: "description",
			content: "OpenStreetMap view of drain choke risk with filters and explainable detail."
		},
		{
			property: "og:title",
			content: "Risk Map — NalaSetu"
		},
		{
			property: "og:description",
			content: "Map of drain choke risk across the demo ward."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
