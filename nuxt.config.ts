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
		},
	},
});
