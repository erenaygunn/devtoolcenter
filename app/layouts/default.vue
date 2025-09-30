<template>
	<div class="min-h-screen flex flex-col bg-black/10">
		<!-- Animated background -->
		<div class="fixed inset-0 overflow-hidden pointer-events-none">
			<!-- Primary floating light -->
			<div
				class="absolute top-20 left-20 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl animate-float-slow"
			></div>
			<!-- Secondary pulsing light -->
			<div
				class="absolute bottom-20 right-20 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl animate-pulse-slow"
				style="animation-delay: 2s"
			></div>
			<!-- Tertiary drifting light -->
			<div
				class="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-200/5 rounded-full blur-3xl animate-drift"
				style="animation-delay: 4s"
			></div>
			<!-- Additional floating light -->
			<div
				class="absolute top-1/3 right-1/3 w-48 h-48 bg-cyan-400/10 rounded-full blur-2xl animate-float-slower"
				style="animation-delay: 1s"
			></div>
			<!-- Subtle rotating light -->
			<div
				class="absolute bottom-1/3 left-1/4 w-80 h-80 bg-cyan-400/4 rounded-full blur-3xl animate-rotate-slow"
				style="animation-delay: 6s"
			></div>
			<!-- Small accent light -->
			<div
				class="absolute top-2/3 right-1/4 w-32 h-32 bg-cyan-300/20 rounded-full blur-xl animate-float"
				style="animation-delay: 3s"
			></div>
		</div>

		<AppHeader />
		<main class="flex-1 relative z-10">
			<slot />
		</main>
		<AppFooter />
	</div>

	<div class="black-overlay bg-black/30 fixed inset-0 z-30 h-full"></div>
</template>

<style>
	/* Base Styles */
	* {
		font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
			sans-serif;
	}

	body {
		background-color: #111827;
		color: white;
		background: linear-gradient(135deg, #000b13 0%, #0e131a 50%, #02070d 100%);
		min-height: 100vh;
		line-height: 1.6;
	}

	/* Glass tokens */
	:root {
		--glass-blur: 14px;
		--glass-bg: rgba(17, 24, 39, 0.28); /* more transparent base */
		--glass-bg-strong: rgba(17, 24, 39, 0.42);
		--glass-bg-subtle: rgba(17, 24, 39, 0.18);
		--glass-border: rgba(255, 255, 255, 0.08);
		--glass-border-strong: rgba(255, 255, 255, 0.12);
		--glass-border-subtle: rgba(255, 255, 255, 0.06);
		--glass-shadow: 0 8px 28px rgba(2, 6, 23, 0.35);
		--glass-inner-top: inset 0 1px 0 rgba(255, 255, 255, 0.06);
		--glass-inner-bottom: inset 0 -1px 0 rgba(255, 255, 255, 0.02);
		--glass-saturate: 130%;
		--glass-contrast: 1.06;
		--glass-brightness: 1.05;
		--lens-highlight-opacity: 0.6;
		--lens-vignette-dark: 0.08;
		--lens-chromatic-opacity: 0.25;
	}

	.overlay-active .black-overlay {
		display: block;
	}

	.black-overlay {
		display: none;
	}

	/* Typography System */
	h1,
	.text-h1 {
		font-size: 4.5rem;
		font-weight: 700;
		line-height: 1.2;
		letter-spacing: -0.025em;
		color: white;
	}

	h2,
	.text-h2 {
		font-size: 2.25rem;
		font-weight: 600;
		line-height: 1.3;
		letter-spacing: -0.025em;
		color: white;
	}

	h3,
	.text-h3 {
		font-size: 1.875rem;
		font-weight: 600;
		line-height: 1.4;
		color: white;
	}

	h4,
	.text-h4 {
		font-size: 1.5rem;
		font-weight: 600;
		line-height: 1.4;
		color: white;
	}

	h5,
	.text-h5 {
		font-size: 1.25rem;
		font-weight: 600;
		line-height: 1.5;
		color: white;
	}

	h6,
	.text-h6 {
		font-size: 1.125rem;
		font-weight: 600;
		line-height: 1.5;
		color: white;
	}

	p,
	.text-body {
		font-size: 1rem;
		font-weight: 400;
		line-height: 1.6;
		color: #d1d5db;
	}

	.text-body-lg {
		font-size: 1.525rem;
		font-weight: 400;
		line-height: 1.7;
		color: #d1d5db;
	}

	.text-body-sm {
		font-size: 0.875rem;
		font-weight: 400;
		line-height: 1.5;
		color: #9ca3af;
	}

	small,
	.text-small {
		font-size: 0.75rem;
		font-weight: 400;
		line-height: 1.4;
		color: #9ca3af;
	}

	span,
	.text-span {
		font-size: inherit;
		font-weight: inherit;
		line-height: inherit;
		color: inherit;
	}

	/* Button System */
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.75rem 1.5rem;
		border-radius: 0.75rem;
		font-weight: 600;
		font-size: 0.875rem;
		line-height: 1.25rem;
		transition: all 0.3s ease-in-out;
		cursor: pointer;
		border: none;
		text-decoration: none;
		white-space: nowrap;
	}

	.btn-primary {
		background: linear-gradient(135deg, #00e5ff, #00bcd4);
		color: white;
		border: 1px solid rgba(0, 229, 255, 0.35);
		box-shadow: 0 0 20px rgba(0, 229, 255, 0.3);
	}

	.btn-primary:hover {
		background: linear-gradient(135deg, #00bcd4, #0097a7);
		box-shadow: 0 0 30px rgba(0, 229, 255, 0.55);
		transform: translateY(-1px);
	}

	.btn-sm {
		padding: 0.5rem 1rem;
		font-size: 0.75rem;
		border-radius: 0.5rem;
	}

	.btn-lg {
		padding: 1rem 2rem;
		font-size: 1rem;
		border-radius: 1rem;
	}

	.header-link::after {
		content: "";
		display: block;
		width: 0;
		height: 2px;
		background: transparent;
		transition: width 0.3s, background-color 0.3s;
	}

	.header-link:hover::after {
		width: 100%;
		background: #00e5ff;
	}

	.header-link.router-link-active {
		color: #00e5ff !important;
		transition: all 0.3s;
	}

	.header-link.router-link-active::after {
		content: "";
		display: block;
		width: 100%;
		height: 2px;
		background: #00e5ff;
		border-radius: 1px;
	}

	/* Glass Effects */
	.glass {
		backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate))
			contrast(var(--glass-contrast)) brightness(var(--glass-brightness));
		-webkit-backdrop-filter: blur(var(--glass-blur))
			saturate(var(--glass-saturate)) contrast(var(--glass-contrast))
			brightness(var(--glass-brightness));
		background: linear-gradient(
				to bottom right,
				rgba(255, 255, 255, 0.06),
				rgba(255, 255, 255, 0.015)
			),
			var(--glass-bg);
		border: 1px solid var(--glass-border);
		box-shadow: var(--glass-shadow), var(--glass-inner-top),
			var(--glass-inner-bottom);
	}

	.glass-hover {
		transition: all 0.3s ease;
	}

	.glass-hover:hover {
		background: linear-gradient(
				to bottom right,
				rgba(255, 255, 255, 0.12),
				rgba(255, 255, 255, 0.04)
			),
			var(--glass-bg);
		border-color: rgba(255, 255, 255, 0.16);
		transform: translateY(-1px);
	}

	.glass-strong {
		backdrop-filter: blur(calc(var(--glass-blur) + 4px))
			saturate(calc(var(--glass-saturate) + 10%))
			contrast(calc(var(--glass-contrast) + 0.02))
			brightness(var(--glass-brightness));
		-webkit-backdrop-filter: blur(calc(var(--glass-blur) + 4px))
			saturate(calc(var(--glass-saturate) + 10%))
			contrast(calc(var(--glass-contrast) + 0.02))
			brightness(var(--glass-brightness));
		background: linear-gradient(
				to bottom right,
				rgba(255, 255, 255, 0.08),
				rgba(255, 255, 255, 0.02)
			),
			var(--glass-bg-strong);
		border: 1px solid var(--glass-border-strong);
		box-shadow: var(--glass-shadow), var(--glass-inner-top),
			var(--glass-inner-bottom);
	}

	.glass-subtle {
		backdrop-filter: blur(calc(var(--glass-blur) - 6px))
			saturate(var(--glass-saturate)) contrast(var(--glass-contrast))
			brightness(var(--glass-brightness));
		-webkit-backdrop-filter: blur(calc(var(--glass-blur) - 6px))
			saturate(var(--glass-saturate)) contrast(var(--glass-contrast))
			brightness(var(--glass-brightness));
		background: linear-gradient(
				to bottom right,
				rgba(255, 255, 255, 0.06),
				rgba(255, 255, 255, 0.015)
			),
			var(--glass-bg-subtle);
		border: 1px solid var(--glass-border-subtle);
		box-shadow: 0 4px 16px rgba(2, 6, 23, 0.25), var(--glass-inner-top);
	}

	/* Optional: lens-like glass variant for subtle distortion */
	.glass-lens {
		position: relative;
		overflow: hidden;
		backdrop-filter: blur(calc(var(--glass-blur) + 2px))
			saturate(calc(var(--glass-saturate) + 10%))
			contrast(calc(var(--glass-contrast) + 0.03))
			brightness(calc(var(--glass-brightness) + 0.02));
		-webkit-backdrop-filter: blur(calc(var(--glass-blur) + 2px))
			saturate(calc(var(--glass-saturate) + 10%))
			contrast(calc(var(--glass-contrast) + 0.03))
			brightness(calc(var(--glass-brightness) + 0.02));
	}

	/* radial highlight and very light vignette to suggest lens curvature */
	.glass-lens::after {
		content: "";
		position: absolute;
		inset: -2%;
		pointer-events: none;
		background: radial-gradient(
				circle at var(--lens-x, 50%) var(--lens-y, 45%),
				rgba(255, 255, 255, calc(var(--lens-highlight-opacity) * 0.2)) 0%,
				rgba(255, 255, 255, calc(var(--lens-highlight-opacity) * 0.12)) 30%,
				rgba(255, 255, 255, calc(var(--lens-highlight-opacity) * 0.04)) 60%,
				rgba(255, 255, 255, 0) 100%
			),
			radial-gradient(
				circle at 50% 60%,
				rgba(0, 0, 0, var(--lens-vignette-dark)) 70%,
				rgba(0, 0, 0, calc(var(--lens-vignette-dark) * 1.6)) 100%
			);
		mix-blend-mode: overlay;
		opacity: 0.75;
	}

	/* tiny chromatic edge hint (very subtle) */
	.glass-lens::before {
		content: "";
		position: absolute;
		inset: -1px;
		pointer-events: none;
		background: linear-gradient(
			135deg,
			rgba(59, 130, 246, 0.05),
			rgba(34, 197, 94, 0.05)
		);
		mix-blend-mode: screen;
		opacity: var(--lens-chromatic-opacity);
	}

	/* Color System */
	.text-primary {
		color: #00e5ff;
	}

	.text-primary-light {
		color: #4ade80;
	}

	.text-primary-dark {
		color: #16a34a;
	}

	.text-secondary {
		color: #d1d5db;
	}

	.text-muted {
		color: #9ca3af !important;
	}

	.text-subtle {
		color: #6b7280;
	}

	.neon-green {
		color: #00e5ff;
		text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
	}

	.neon-glow {
		box-shadow: 0 0 20px rgba(0, 229, 255, 0.35);
	}

	.gradient-text {
		background: linear-gradient(45deg, #00e5ff, #00bcd4, #3b82f6);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	/* Layout & Spacing */
	.container {
		max-width: 1280px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.container-sm {
		max-width: 768px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.container-lg {
		max-width: 1536px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	section {
		overflow: hidden;
	}

	.section {
		padding: 5rem 0;
	}

	.section-sm {
		padding: 2rem 0;
	}

	.section-lg {
		padding: 5rem 0;
	}

	.section-xl {
		padding: 8rem 0;
	}

	/* Form Elements */
	.form-input {
		width: 100%;
		padding: 0.75rem 1rem;
		backdrop-filter: saturate(140%) blur(var(--glass-blur));
		-webkit-backdrop-filter: saturate(140%) blur(var(--glass-blur));
		background: linear-gradient(
				to bottom right,
				rgba(255, 255, 255, 0.06),
				rgba(255, 255, 255, 0.02)
			),
			var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: 0.5rem;
		color: white;
		font-size: 0.875rem;
		transition: all 0.2s ease;
	}

	.form-input::placeholder {
		color: #9ca3af;
	}

	.form-input:focus {
		outline: none;
		border-color: rgba(0, 229, 255, 0.5);
		box-shadow: 0 0 0 3px rgba(0, 229, 255, 0.15);
	}

	.form-select {
		width: 100%;
		padding: 0.75rem 1rem;
		backdrop-filter: saturate(140%) blur(var(--glass-blur));
		-webkit-backdrop-filter: saturate(140%) blur(var(--glass-blur));
		background: linear-gradient(
				to bottom right,
				rgba(255, 255, 255, 0.06),
				rgba(255, 255, 255, 0.02)
			),
			var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: 0.5rem;
		color: white;
		font-size: 0.875rem;
		transition: all 0.2s ease;
		cursor: pointer;
	}

	.form-select:focus {
		outline: none;
		border-color: rgba(0, 229, 255, 0.5);
		box-shadow: 0 0 0 3px rgba(0, 229, 255, 0.15);
	}

	.form-textarea {
		width: 100%;
		padding: 0.75rem 1rem;
		backdrop-filter: saturate(140%) blur(var(--glass-blur));
		-webkit-backdrop-filter: saturate(140%) blur(var(--glass-blur));
		background: linear-gradient(
				to bottom right,
				rgba(255, 255, 255, 0.06),
				rgba(255, 255, 255, 0.02)
			),
			var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: 0.5rem;
		color: white;
		font-size: 0.875rem;
		transition: all 0.2s ease;
		resize: vertical;
		min-height: 120px;
	}

	select {
		appearance: none;
	}

	.form-textarea::placeholder {
		color: #9ca3af;
	}

	.form-textarea:focus {
		outline: none;
		border-color: rgba(0, 229, 255, 0.5);
		box-shadow: 0 0 0 3px rgba(0, 229, 255, 0.15);
	}

	/* Card Styles */
	.card {
		backdrop-filter: saturate(140%) blur(var(--glass-blur));
		-webkit-backdrop-filter: saturate(140%) blur(var(--glass-blur));
		background: linear-gradient(
				to bottom right,
				rgba(255, 255, 255, 0.07),
				rgba(255, 255, 255, 0.02)
			),
			var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: 1rem;
		padding: 1.5rem;
		box-shadow: var(--glass-shadow), var(--glass-inner-top),
			var(--glass-inner-bottom);
		transition: all 0.3s ease;
	}

	.card-hover:hover {
		background: linear-gradient(
				to bottom right,
				rgba(255, 255, 255, 0.1),
				rgba(255, 255, 255, 0.03)
			),
			var(--glass-bg);
		border-color: rgba(255, 255, 255, 0.16);
		transform: translateY(-2px);
	}

	/* Buttons - glass variants */
	.btn-secondary {
		backdrop-filter: saturate(140%) blur(calc(var(--glass-blur) - 4px));
		-webkit-backdrop-filter: saturate(140%) blur(calc(var(--glass-blur) - 4px));
		background: linear-gradient(
				to bottom right,
				rgba(255, 255, 255, 0.06),
				rgba(255, 255, 255, 0.02)
			),
			var(--glass-bg);
		border: 1px solid var(--glass-border);
		color: #e5e7eb;
	}

	.btn-secondary:hover {
		background: linear-gradient(
				to bottom right,
				rgba(255, 255, 255, 0.1),
				rgba(255, 255, 255, 0.03)
			),
			var(--glass-bg);
		border-color: rgba(255, 255, 255, 0.18);
		transform: translateY(-1px);
	}

	.btn-tertiary {
		backdrop-filter: saturate(140%) blur(calc(var(--glass-blur) - 4px));
		-webkit-backdrop-filter: saturate(140%) blur(calc(var(--glass-blur) - 4px));
		background: linear-gradient(
				to bottom right,
				rgba(255, 255, 255, 0.05),
				rgba(255, 255, 255, 0.015)
			),
			var(--glass-bg-subtle);
		border: 1px solid var(--glass-border-subtle);
		color: #d1d5db;
	}

	.btn-tertiary:hover {
		background: linear-gradient(
				to bottom right,
				rgba(255, 255, 255, 0.08),
				rgba(255, 255, 255, 0.02)
			),
			var(--glass-bg);
		border-color: rgba(255, 255, 255, 0.16);
		color: #e5e7eb;
		transform: translateY(-1px);
	}

	/* Fallback for browsers without backdrop-filter */
	@supports not (
		(backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))
	) {
		.glass,
		.glass-strong,
		.glass-subtle,
		.card,
		.form-input,
		.form-select,
		.form-textarea,
		.btn-secondary,
		.btn-tertiary {
			background-color: rgba(17, 24, 39, 0.85) !important;
		}
	}

	/* Utility Classes */

	/* Responsive Typography */
	@media (max-width: 768px) {
		h1,
		.text-h1 {
			font-size: 3rem;
		}

		h2,
		.text-h2 {
			font-size: 1.875rem;
		}

		h3,
		.text-h3 {
			font-size: 1.5rem;
		}

		.container {
			padding: 0 1rem;
		}

		.section {
			padding: 4rem 0;
		}

		.section-lg {
			padding: 4rem 0;
		}

		/* Footer specific mobile adjustments */
		footer .container {
			padding: 2rem 1rem;
		}

		footer .grid {
			gap: 1.5rem;
		}
	}

	/* Swiper Custom Styles */
	.swiper-container {
		overflow: visible;
		padding-bottom: 2rem;
	}

	.swiper-slide {
		height: auto;
	}

	.swiper-pagination {
		position: relative;
		bottom: auto;
		margin-top: 1rem;
	}

	.swiper-pagination-bullet {
		background-color: rgba(255, 255, 255, 0.3);
		opacity: 1;
	}

	.swiper-pagination-bullet-active {
		background-color: #00e5ff;
	}
</style>
