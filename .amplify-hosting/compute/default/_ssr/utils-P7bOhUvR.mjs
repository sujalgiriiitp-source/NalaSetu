import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-P7bOhUvR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ROLE_LABEL = {
	OFFICER: "Municipal Officer",
	CREW: "Crew Member",
	CITIZEN: "Citizen"
};
var ROLE_HOME = {
	OFFICER: "/dashboard",
	CREW: "/crew",
	CITIZEN: "/citizen/report"
};
var KEY = "nalasetu.session.v1";
var DemoAuthAdapter = {
	id: "demo",
	label: "Demo",
	async signIn() {
		await new Promise((r) => setTimeout(r, 500));
		throw new Error("Unable to sign in. Check your credentials.");
	},
	demoSignIn(role) {
		return {
			role,
			name: `Demo ${ROLE_LABEL[role]}`,
			provider: "demo",
			startedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
	},
	load() {
		try {
			const raw = sessionStorage.getItem(KEY) ?? localStorage.getItem(KEY);
			const s = raw ? JSON.parse(raw) : null;
			return s && s.role in ROLE_LABEL ? s : null;
		} catch {
			return null;
		}
	},
	save(s, remember) {
		this.clear();
		(remember ? localStorage : sessionStorage).setItem(KEY, JSON.stringify(s));
	},
	clear() {
		try {
			sessionStorage.removeItem(KEY);
			localStorage.removeItem(KEY);
		} catch {}
	}
};
var AuthCtx = (0, import_react.createContext)(null);
function AuthProvider({ children, adapter = DemoAuthAdapter }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	const [session, setSession] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setSession(adapter.load());
		setReady(true);
	}, [adapter]);
	const value = (0, import_react.useMemo)(() => ({
		ready,
		session,
		provider: adapter,
		async signIn(email, password, role, remember) {
			const s = await adapter.signIn(email, password, role);
			adapter.save(s, remember);
			setSession(s);
			return s;
		},
		demoSignIn(role, remember = false) {
			const s = adapter.demoSignIn(role);
			adapter.save(s, remember);
			setSession(s);
			return s;
		},
		signOut() {
			adapter.clear();
			setSession(null);
		}
	}), [
		ready,
		session,
		adapter
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthCtx.Provider, {
		value,
		children
	});
}
function useAuth() {
	const c = (0, import_react.useContext)(AuthCtx);
	if (!c) throw new Error("useAuth must be used inside AuthProvider");
	return c;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
export { useAuth as a, cn as i, ROLE_HOME as n, ROLE_LABEL as r, AuthProvider as t };
