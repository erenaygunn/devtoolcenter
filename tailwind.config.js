module.exports = {
	darkMode: "class",
	content: [
		"./components/**/*.{js,vue,ts}",
		"./layouts/**/*.vue",
		"./pages/**/*.vue",
		"./plugins/**/*.{js,ts}",
		"./nuxt.config.{js,ts}",
		"./app/**/*.{js,vue,ts}",
	],
	theme: {
		extend: {
			colors: {
				"neon-green": "#22c55e",
				"glass-white": "rgba(255, 255, 255, 0.05)",
				"glass-border": "rgba(255, 255, 255, 0.1)",
			},
			animation: {
				float: "float 6s ease-in-out infinite",
				glow: "glow 2s ease-in-out infinite alternate",
			},
			keyframes: {
				float: {
					"0%, 100%": { transform: "translateY(0px)" },
					"50%": { transform: "translateY(-20px)" },
				},
				glow: {
					from: { boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)" },
					to: { boxShadow: "0 0 30px rgba(34, 197, 94, 0.6)" },
				},
			},
		},
	},
	plugins: [],
};
