interface AppEnv {
	TRACES_BUCKET: R2Bucket;
	DASHBOARD_PASSWORD: string;
	ASSETS: { fetch: (request: Request) => Promise<Response> };
}

const BUCKET_PREFIX = "openrouter-traces/";
const TOKEN_TTL = 60 * 60 * 24; // 24h in seconds
const CORS_HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function json(data: unknown, status = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: { "Content-Type": "application/json", ...CORS_HEADERS },
	});
}

async function createToken(password: string): Promise<string> {
	const payload = { exp: Math.floor(Date.now() / 1000) + TOKEN_TTL };
	const payloadB64 = btoa(JSON.stringify(payload));
	const key = await crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(password),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"]
	);
	const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
	const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
	return `${payloadB64}.${sigB64}`;
}

async function verifyToken(token: string, password: string): Promise<boolean> {
	try {
		const [payloadB64, sigB64] = token.split(".");
		if (!payloadB64 || !sigB64) return false;
		const key = await crypto.subtle.importKey(
			"raw",
			new TextEncoder().encode(password),
			{ name: "HMAC", hash: "SHA-256" },
			false,
			["verify"]
		);
		const sig = Uint8Array.from(atob(sigB64), (c) => c.charCodeAt(0));
		const valid = await crypto.subtle.verify("HMAC", key, sig, new TextEncoder().encode(payloadB64));
		if (!valid) return false;
		const payload = JSON.parse(atob(payloadB64));
		return payload.exp > Math.floor(Date.now() / 1000);
	} catch {
		return false;
	}
}

async function handleLogin(request: Request, env: AppEnv): Promise<Response> {
	if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
	try {
		const body = (await request.json()) as { password?: string };
		if (!body.password || body.password !== env.DASHBOARD_PASSWORD) {
			return json({ error: "Invalid password" }, 401);
		}
		const token = await createToken(env.DASHBOARD_PASSWORD);
		return json({ token });
	} catch {
		return json({ error: "Invalid request body" }, 400);
	}
}

async function handleListDates(env: AppEnv): Promise<Response> {
	const listed = await env.TRACES_BUCKET.list({ prefix: BUCKET_PREFIX, delimiter: "/" });
	const dates = (listed.delimitedPrefixes || [])
		.map((p: string) => p.replace(BUCKET_PREFIX, "").replace("/", ""))
		.filter((d: string) => d.length > 0)
		.sort()
		.reverse();
	return json({ dates });
}

async function handleListTraces(url: URL, env: AppEnv): Promise<Response> {
	const date = url.searchParams.get("date");
	if (!date) return json({ error: "Missing date parameter" }, 400);

	const prefix = `${BUCKET_PREFIX}${date}/`;
	let cursor: string | undefined;
	const traces: { key: string; filename: string; size: number; uploaded: string }[] = [];

	do {
		const listed = await env.TRACES_BUCKET.list({ prefix, cursor, limit: 500 });
		for (const obj of listed.objects) {
			traces.push({
				key: obj.key,
				filename: obj.key.split("/").pop() || obj.key,
				size: obj.size,
				uploaded: obj.uploaded.toISOString(),
			});
		}
		cursor = listed.truncated ? listed.cursor : undefined;
	} while (cursor);

	traces.sort((a, b) => b.uploaded.localeCompare(a.uploaded));
	return json({ date, count: traces.length, traces });
}

async function handleGetTrace(url: URL, env: AppEnv): Promise<Response> {
	const key = url.searchParams.get("key");
	if (!key) return json({ error: "Missing key parameter" }, 400);

	const obj = await env.TRACES_BUCKET.get(key);
	if (!obj) return json({ error: "Trace not found" }, 404);

	const data = await obj.json();
	return json({ trace: data });
}

async function handleGetTraceSummaries(url: URL, env: AppEnv): Promise<Response> {
	const date = url.searchParams.get("date");
	if (!date) return json({ error: "Missing date parameter" }, 400);

	const sortOrder = url.searchParams.get("sort") === "asc" ? "asc" : "desc";

	const prefix = `${BUCKET_PREFIX}${date}/`;
	let cursor: string | undefined;
	const entries: { key: string; uploaded: string }[] = [];

	do {
		const listed = await env.TRACES_BUCKET.list({ prefix, cursor, limit: 500 });
		for (const obj of listed.objects) {
			entries.push({ key: obj.key, uploaded: obj.uploaded.toISOString() });
		}
		cursor = listed.truncated ? listed.cursor : undefined;
	} while (cursor);

	// Sort by uploaded timestamp
	entries.sort((a, b) =>
		sortOrder === "asc"
			? a.uploaded.localeCompare(b.uploaded)
			: b.uploaded.localeCompare(a.uploaded)
	);

	const page = parseInt(url.searchParams.get("page") || "1");
	const pageSize = parseInt(url.searchParams.get("pageSize") || "20");
	const start = (page - 1) * pageSize;
	const end = Math.min(start + pageSize, entries.length);
	const pageKeys = entries.slice(start, end).map((e) => e.key);

	const summaries = await Promise.all(
		pageKeys.map(async (key) => {
			try {
				const obj = await env.TRACES_BUCKET.get(key);
				if (!obj) return null;
				const data = (await obj.json()) as any;
				const t = data.trace || data;
				const obs = t.observations?.[0];
				return {
					key,
					filename: key.split("/").pop() || key,
					id: t.id,
					name: t.name,
					timestamp: t.timestamp,
					model: obs?.model || t.output?.rawRequest?.model || "unknown",
					promptTokens: obs?.promptTokens || 0,
					completionTokens: obs?.completionTokens || 0,
					totalTokens: obs?.totalTokens || 0,
					totalCost: obs?.totalCost || 0,
					inputCost: obs?.inputCost || 0,
					outputCost: obs?.outputCost || 0,
					durationMs: obs?.startTime && obs?.endTime
						? new Date(obs.endTime).getTime() - new Date(obs.startTime).getTime()
						: null,
					finishReason: obs?.normalizedFinishReason || obs?.finishReason || null,
					providerName: obs?.providerName || null,
					apiKeyName: t.apiKeyName || null,
					messageCount: t.input?.messages?.length || 0,
				};
			} catch {
				return { key, filename: key.split("/").pop() || key, error: "Failed to parse" };
			}
		})
	);

	return json({
		date,
		page,
		pageSize,
		sort: sortOrder,
		totalCount: entries.length,
		totalPages: Math.ceil(entries.length / pageSize),
		summaries: summaries.filter(Boolean),
	});
}

export default {
	async fetch(request: Request, env: AppEnv): Promise<Response> {
		const url = new URL(request.url);

		if (request.method === "OPTIONS") {
			return new Response(null, { headers: CORS_HEADERS });
		}

		// API routes
		if (url.pathname.startsWith("/api/")) {
			// Login doesn't require auth
			if (url.pathname === "/api/login") {
				return handleLogin(request, env);
			}

			// All other API routes require auth
			const authHeader = request.headers.get("Authorization");
			const token = authHeader?.replace("Bearer ", "");
			if (!token || !(await verifyToken(token, env.DASHBOARD_PASSWORD))) {
				return json({ error: "Unauthorized" }, 401);
			}

			switch (url.pathname) {
				case "/api/dates":
					return handleListDates(env);
				case "/api/traces":
					return handleListTraces(url, env);
				case "/api/trace":
					return handleGetTrace(url, env);
				case "/api/summaries":
					return handleGetTraceSummaries(url, env);
				default:
					return json({ error: "Not found" }, 404);
			}
		}

		// Serve static assets for everything else
		return env.ASSETS.fetch(request);
	},
} satisfies ExportedHandler<AppEnv>;
