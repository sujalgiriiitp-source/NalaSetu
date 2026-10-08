import before from "@/assets/test-before.jpg";
import afterClean from "@/assets/test-after-clean.jpg";
import afterDirty from "@/assets/test-after-dirty.jpg";
import otherLocation from "@/assets/test-other-location.jpg";

export interface Expectation {
  verdict: "PASS" | "REVIEW";
  minConfidence?: number;
  maxConfidence?: number;
  sameLocation?: boolean;
  obstructionAfter?: boolean;
}

export interface Fixture {
  id: string;
  title: string;
  description: string;
  before: string;
  after: string;
  expect: Expectation;
}

/** Repeatable proof-verification scenarios. Photos are realistic sample images, not field data. */
export const FIXTURES: Fixture[] = [
  { id: "genuine", title: "Genuine cleaning", description: "Same drain, blockage removed.", before, after: afterClean, expect: { verdict: "PASS", minConfidence: 70, sameLocation: true, obstructionAfter: false } },
  { id: "not-cleaned", title: "Still blocked", description: "Same drain, garbage still present.", before, after: afterDirty, expect: { verdict: "REVIEW", sameLocation: true, obstructionAfter: true } },
  { id: "wrong-location", title: "Different location", description: "After photo taken at another site.", before, after: otherLocation, expect: { verdict: "REVIEW", sameLocation: false } },
  { id: "reused", title: "Reused photo", description: "Same image submitted twice.", before, after: before, expect: { verdict: "REVIEW", maxConfidence: 10 } },
];

export async function urlToJpegDataUrl(url: string): Promise<string> {
  const img = await new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.crossOrigin = "anonymous"; i.onload = () => res(i); i.onerror = () => rej(new Error("Could not load test photo.")); i.src = url; });
  const scale = Math.min(1, 900 / Math.max(img.width, img.height));
  const c = document.createElement("canvas");
  c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
  c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.75);
}

export interface Actual { verdict: "PASS" | "REVIEW"; confidence: number; sameLocation: boolean; obstructionAfter: boolean }

export function checkExpectation(e: Expectation, a: Actual): string[] {
  const fails: string[] = [];
  if (a.verdict !== e.verdict) fails.push(`verdict ${a.verdict} ≠ ${e.verdict}`);
  if (e.minConfidence !== undefined && a.confidence < e.minConfidence) fails.push(`confidence ${a.confidence} < ${e.minConfidence}`);
  if (e.maxConfidence !== undefined && a.confidence > e.maxConfidence) fails.push(`confidence ${a.confidence} > ${e.maxConfidence}`);
  if (e.sameLocation !== undefined && a.sameLocation !== e.sameLocation) fails.push(`location match ${a.sameLocation} ≠ ${e.sameLocation}`);
  if (e.obstructionAfter !== undefined && a.obstructionAfter !== e.obstructionAfter) fails.push(`still blocked ${a.obstructionAfter} ≠ ${e.obstructionAfter}`);
  return fails;
}
