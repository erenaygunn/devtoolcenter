<template>
	<div class="min-h-screen flex flex-col bg-gray-900">
		<!-- Animated background -->
		<div class="fixed inset-0 overflow-hidden pointer-events-none">
			<div
				class="absolute top-20 left-20 w-72 h-72 bg-green-400/10 rounded-full blur-3xl animate-float"
			></div>
			<div
				class="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-float"
				style="animation-delay: 2s"
			></div>
			<div
				class="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-400/5 rounded-full blur-3xl animate-float"
				style="animation-delay: 4s"
			></div>
		</div>

		<AppHeader />
		<main class="flex-1 relative z-10">
			<slot />
		</main>
		<AppFooter />
	</div>
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
		background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
		min-height: 100vh;
		line-height: 1.6;
	}

	/* Typography System */
	h1,
	.text-h1 {
		font-size: 3rem;
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
		font-size: 1.125rem;
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
		transition: all 0.2s ease-in-out;
		cursor: pointer;
		border: none;
		text-decoration: none;
		white-space: nowrap;
	}

	.btn-primary {
		background: linear-gradient(135deg, #22c55e, #16a34a);
		color: white;
		border: 1px solid rgba(34, 197, 94, 0.3);
		box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
	}

	.btn-primary:hover {
		background: linear-gradient(135deg, #16a34a, #15803d);
		box-shadow: 0 0 30px rgba(34, 197, 94, 0.5);
		transform: translateY(-1px);
	}

	.btn-secondary {
		backdrop-filter: blur(12px);
		background-color: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(34, 197, 94, 0.3);
		color: #22c55e;
	}

	.btn-secondary:hover {
		background-color: rgba(34, 197, 94, 0.1);
		border-color: rgba(34, 197, 94, 0.5);
		transform: translateY(-1px);
	}

	.btn-tertiary {
		backdrop-filter: blur(12px);
		background-color: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: #d1d5db;
	}

	.btn-tertiary:hover {
		background-color: rgba(255, 255, 255, 0.1);
		color: #22c55e;
		border-color: rgba(34, 197, 94, 0.3);
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

	/* Glass Effects */
	.glass {
		backdrop-filter: blur(12px);
		background-color: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow: 0 8px 32px 0 rgba(31, 135, 107, 0.37);
	}

	.glass-hover {
		transition: all 0.3s ease;
	}

	.glass-hover:hover {
		background-color: rgba(255, 255, 255, 0.1);
		border-color: rgba(34, 197, 94, 0.3);
	}

	.glass-strong {
		backdrop-filter: blur(16px);
		background-color: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.15);
	}

	.glass-subtle {
		backdrop-filter: blur(8px);
		background-color: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	/* Color System */
	.text-primary {
		color: #22c55e;
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
		color: #9ca3af;
	}

	.text-subtle {
		color: #6b7280;
	}

	.neon-green {
		color: #22c55e;
		text-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
	}

	.neon-glow {
		box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
	}

	.gradient-text {
		background: linear-gradient(45deg, #22c55e, #10b981, #06d6a0);
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
		padding: 4rem 0;
	}

	.section-sm {
		padding: 2rem 0;
	}

	.section-lg {
		padding: 6rem 0;
	}

	.section-xl {
		padding: 8rem 0;
	}

	/* Form Elements */
	.form-input {
		width: 100%;
		padding: 0.75rem 1rem;
		backdrop-filter: blur(12px);
		background-color: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
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
		border-color: rgba(34, 197, 94, 0.5);
		box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
	}

	.form-select {
		width: 100%;
		padding: 0.75rem 1rem;
		backdrop-filter: blur(12px);
		background-color: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 0.5rem;
		color: white;
		font-size: 0.875rem;
		transition: all 0.2s ease;
		cursor: pointer;
	}

	.form-select:focus {
		outline: none;
		border-color: rgba(34, 197, 94, 0.5);
		box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
	}

	.form-textarea {
		width: 100%;
		padding: 0.75rem 1rem;
		backdrop-filter: blur(12px);
		background-color: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 0.5rem;
		color: white;
		font-size: 0.875rem;
		transition: all 0.2s ease;
		resize: vertical;
		min-height: 120px;
	}

	.form-textarea::placeholder {
		color: #9ca3af;
	}

	.form-textarea:focus {
		outline: none;
		border-color: rgba(34, 197, 94, 0.5);
		box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
	}

	/* Card Styles */
	.card {
		backdrop-filter: blur(12px);
		background-color: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 1rem;
		padding: 1.5rem;
		transition: all 0.3s ease;
	}

	.card-hover {
		cursor: pointer;
	}

	.card-hover:hover {
		background-color: rgba(255, 255, 255, 0.08);
		border-color: rgba(34, 197, 94, 0.3);
		transform: translateY(-2px);
	}

	/* Utility Classes */
	.text-center {
		text-align: center;
	}
	.text-left {
		text-align: left;
	}
	.text-right {
		text-align: right;
	}

	.font-light {
		font-weight: 300;
	}
	.font-normal {
		font-weight: 400;
	}
	.font-medium {
		font-weight: 500;
	}
	.font-semibold {
		font-weight: 600;
	}
	.font-bold {
		font-weight: 700;
	}
	.font-extrabold {
		font-weight: 800;
	}

	.opacity-50 {
		opacity: 0.5;
	}
	.opacity-75 {
		opacity: 0.75;
	}
	.opacity-90 {
		opacity: 0.9;
	}

	.rounded-sm {
		border-radius: 0.25rem;
	}
	.rounded {
		border-radius: 0.5rem;
	}
	.rounded-lg {
		border-radius: 0.75rem;
	}
	.rounded-xl {
		border-radius: 1rem;
	}
	.rounded-2xl {
		border-radius: 1.5rem;
	}

	/* Responsive Typography */
	@media (max-width: 768px) {
		h1,
		.text-h1 {
			font-size: 2.25rem;
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
			padding: 2rem 0;
		}

		.section-lg {
			padding: 3rem 0;
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
		background-color: #22c55e;
	}
</style>
