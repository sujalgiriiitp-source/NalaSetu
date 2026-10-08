//#region node_modules/.nitro/vite/services/ssr/assets/verify-BR5JF3IR.js
var ACCEPTED = [
	"image/jpeg",
	"image/png",
	"image/webp"
];
/** Validate & compress to JPEG data URL (max 900px). */
async function processPhoto(file) {
	if (!ACCEPTED.includes(file.type)) throw new Error("Only JPG, PNG or WEBP images are allowed.");
	if (file.size > 8388608) throw new Error("Image is larger than 8 MB.");
	const url = URL.createObjectURL(file);
	try {
		const img = await new Promise((res, rej) => {
			const i = new Image();
			i.onload = () => res(i);
			i.onerror = () => rej(/* @__PURE__ */ new Error("Could not read image."));
			i.src = url;
		});
		const scale = Math.min(1, 900 / Math.max(img.width, img.height));
		const c = document.createElement("canvas");
		c.width = Math.round(img.width * scale);
		c.height = Math.round(img.height * scale);
		c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
		return c.toDataURL("image/jpeg", .7);
	} finally {
		URL.revokeObjectURL(url);
	}
}
//#endregion
export { processPhoto as t };
