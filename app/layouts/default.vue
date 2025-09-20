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
	body {
		background-color: #111827;
		color: white;
		background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
		min-height: 100vh;
	}

	.glass {
		backdrop-filter: blur(12px);
		background-color: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
	}

	.glass-hover {
		transition: all 0.3s ease;
	}

	.glass-hover:hover {
		background-color: rgba(255, 255, 255, 0.1);
		border-color: rgba(34, 197, 94, 0.3);
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
</style>
