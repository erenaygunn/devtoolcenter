// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	modules: ["@nuxt/icon", "@nuxt/image", "@nuxtjs/tailwindcss"],
	app: {
		head: {
			htmlAttrs: {
				class: "dark",
			},
		},
	},

	runtimeConfig: {
		// private server-only vars (not exposed to client)
		adminSecret: process.env.ADMIN_SECRET,

		// public vars (exposed to client, safe)
		public: {
			apiBase:
				process.env.NUXT_PUBLIC_API_BASE || "http://localhost:5050/api/v1",
			maxSubmissionsPerDay: 5,
			enableRateLimit: true,
			// GA4 Measurement ID (optional). Put in .env as NUXT_PUBLIC_GA_ID=G-XXXXXXX
			googleAnalyticsId: process.env.NUXT_PUBLIC_GA_ID || "",
		},
	},

	// Security configuration
	nitro: {
		routeRules: {
			"/api/**": {
				headers: {
					"X-Content-Type-Options": "nosniff",
					"X-Frame-Options": "DENY",
					"X-XSS-Protection": "1; mode=block",
					"Referrer-Policy": "strict-origin-when-cross-origin",
				},
			},
		},
	},

	// Add security middleware
	ssr: true,
});
