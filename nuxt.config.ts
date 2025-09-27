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
			adminToken: process.env.NUXT_PUBLIC_ADMIN_TOKEN,
		},
	},
});
