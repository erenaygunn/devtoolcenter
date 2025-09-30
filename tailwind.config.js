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
				"neon-green": "#00e5ff", // remapped to neon blue to preserve class usages
				"neon-blue": "#00e5ff",
				"glass-white": "rgba(255, 255, 255, 0.05)",
				"glass-border": "rgba(255, 255, 255, 0.1)",
				primary: "#00e5ff",
				secondary: "#d1d5db",
			},
			animation: {
				float: "float 6s ease-in-out infinite",
				glow: "glow 2s ease-in-out infinite alternate",
				"float-slow": "float-slow 8s ease-in-out infinite",
				"float-slower": "float-slower 12s ease-in-out infinite",
				"pulse-slow": "pulse-slow 4s ease-in-out infinite",
				"rotate-slow": "rotate-slow 20s linear infinite",
				drift: "drift 15s ease-in-out infinite",
			},
			keyframes: {
				float: {
					"0%, 100%": { transform: "translateY(0px)" },
					"50%": { transform: "translateY(-20px)" },
				},
				"float-slow": {
					"0%, 100%": { transform: "translateY(0px) translateX(0px)" },
					"33%": { transform: "translateY(-15px) translateX(10px)" },
					"66%": { transform: "translateY(-30px) translateX(-5px)" },
				},
				"float-slower": {
					"0%, 100%": { transform: "translateY(0px) translateX(0px)" },
					"25%": { transform: "translateY(-10px) translateX(-15px)" },
					"50%": { transform: "translateY(-25px) translateX(10px)" },
					"75%": { transform: "translateY(-5px) translateX(20px)" },
				},
				"pulse-slow": {
					"0%, 100%": { transform: "scale(1)", opacity: "0.7" },
					"50%": { transform: "scale(1.1)", opacity: "1" },
				},
				"rotate-slow": {
					"0%": { transform: "rotate(0deg)" },
					"100%": { transform: "rotate(360deg)" },
				},
				drift: {
					"0%, 100%": { transform: "translateX(0px) translateY(0px)" },
					"33%": { transform: "translateX(30px) translateY(-20px)" },
					"66%": { transform: "translateX(-20px) translateY(15px)" },
				},
				glow: {
					from: { boxShadow: "0 0 20px rgba(0, 229, 255, 0.3)" },
					to: { boxShadow: "0 0 30px rgba(0, 229, 255, 0.6)" },
				},
			},
		},
	},
	plugins: [],
};
