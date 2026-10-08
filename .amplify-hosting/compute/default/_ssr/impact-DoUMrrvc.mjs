//#region node_modules/.nitro/vite/services/ssr/assets/impact-DoUMrrvc.js
/** Projected exposure reduction = popWeight(cleaned HIGH) / popWeight(all HIGH) × 100. Never NaN. */
function exposureReduction(drains) {
	const high = drains.filter((d) => d.riskBand === "HIGH");
	const den = high.reduce((a, d) => a + d.adjacentPopulationWeight, 0);
	if (!den) return 0;
	const num = high.filter((d) => d.status === "VERIFIED").reduce((a, d) => a + d.adjacentPopulationWeight, 0);
	return Math.round(num / den * 100);
}
function impactStats(drains) {
	const high = drains.filter((d) => d.riskBand === "HIGH");
	const done = drains.filter((d) => d.status === "VERIFIED");
	const highDone = high.filter((d) => d.status === "VERIFIED").length;
	return {
		completed: done.length,
		total: drains.filter((d) => d.status !== "UNASSIGNED").length,
		highCoveragePct: high.length ? Math.round(highDone / high.length * 100) : 0,
		highDone,
		highTotal: high.length,
		exposurePct: exposureReduction(drains),
		crewMinutes: done.reduce((a, d) => a + d.cleaningTimeMin, 0)
	};
}
//#endregion
export { impactStats as t };
