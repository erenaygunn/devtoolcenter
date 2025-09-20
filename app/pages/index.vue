<template>
	<div class="pt-16">
		<!-- Hero Section -->
		<section class="py-20 px-4 sm:px-6 lg:px-8">
			<div class="max-w-7xl mx-auto text-center">
				<div class="mb-8">
					<h1 class="text-5xl md:text-7xl font-bold mb-6">
						<span class="gradient-text">DevShelf</span>
					</h1>
					<p class="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
						Discover the best
						<span class="neon-green">free productivity tools</span> for
						developers. Community-driven, open-source, and always growing.
					</p>
				</div>

				<div
					class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
				>
					<NuxtLink
						to="/tools"
						class="glass glass-hover px-8 py-4 rounded-xl font-semibold text-green-400 border border-green-400/30 hover:bg-green-400/10 transition-all neon-glow"
					>
						<Icon
							name="heroicons:magnifying-glass"
							class="h-5 w-5 inline mr-2"
						/>
						Browse Tools
					</NuxtLink>
					<NuxtLink
						to="/submit"
						class="glass glass-hover px-8 py-4 rounded-xl font-semibold text-gray-300 hover:text-green-400 transition-all"
					>
						<Icon
							name="heroicons:plus"
							class="h-5 w-5 inline mr-2"
						/>
						Submit Tool
					</NuxtLink>
				</div>

				<!-- Stats -->
				<div class="grid grid-cols-3 gap-8 max-w-md mx-auto">
					<div class="text-center">
						<div class="text-3xl font-bold neon-green">150+</div>
						<div class="text-gray-400 text-sm">Tools</div>
					</div>
					<div class="text-center">
						<div class="text-3xl font-bold neon-green">12</div>
						<div class="text-gray-400 text-sm">Categories</div>
					</div>
					<div class="text-center">
						<div class="text-3xl font-bold neon-green">5K+</div>
						<div class="text-gray-400 text-sm">Users</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Featured Tools -->
		<section class="py-16 px-4 sm:px-6 lg:px-8">
			<div class="max-w-7xl mx-auto">
				<div class="text-center mb-12">
					<h2 class="text-3xl font-bold text-white mb-4">Featured Tools</h2>
					<p class="text-gray-400">
						Hand-picked tools that stand out in the community
					</p>
				</div>

				<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					<ToolCard
						v-for="tool in featuredTools"
						:key="tool.id"
						:tool="tool"
					/>
				</div>

				<div class="text-center mt-8">
					<NuxtLink
						to="/tools"
						class="glass glass-hover px-6 py-3 rounded-lg text-green-400 border border-green-400/30 hover:bg-green-400/10 transition-all inline-flex items-center"
					>
						View All Tools
						<Icon
							name="heroicons:arrow-right"
							class="h-4 w-4 ml-2"
						/>
					</NuxtLink>
				</div>
			</div>
		</section>

		<!-- Categories -->
		<section class="py-16 px-4 sm:px-6 lg:px-8">
			<div class="max-w-7xl mx-auto">
				<div class="text-center mb-12">
					<h2 class="text-3xl font-bold text-white mb-4">Browse by Category</h2>
					<p class="text-gray-400">
						Tools organized into clear categories for easy discovery
					</p>
				</div>

				<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
					<CategoryCard
						v-for="category in categories"
						:key="category.id"
						:category="category"
					/>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
	useHead({
		title: "DevShelf - Discover the Best Free Developer Tools",
		meta: [
			{
				name: "description",
				content:
					"Open-source, community-driven platform for discovering the best free productivity tools for developers.",
			},
		],
	});

	const featuredTools = ref([
		{
			id: 1,
			name: "VS Code",
			description:
				"Free, powerful code editor with extensive extensions and built-in Git support.",
			icon: "simple-icons:visualstudiocode",
			tags: ["Editor", "Free", "Extensions"],
			rating: 4.9,
			category: "Development",
			url: "https://code.visualstudio.com",
		},
		{
			id: 2,
			name: "Figma",
			description:
				"Collaborative design tool for creating user interfaces and prototypes.",
			icon: "simple-icons:figma",
			tags: ["Design", "Collaboration", "Prototyping"],
			rating: 4.8,
			category: "Design",
			url: "https://figma.com",
		},
		{
			id: 3,
			name: "GitHub",
			description:
				"Version control and collaboration platform for developers worldwide.",
			icon: "simple-icons:github",
			tags: ["Git", "Collaboration", "Open Source"],
			rating: 4.9,
			category: "Version Control",
			url: "https://github.com",
		},
	]);

	const categories = ref([
		{
			id: 1,
			name: "Frontend",
			slug: "frontend",
			description: "UI frameworks, libraries, and design tools",
			icon: "heroicons:paint-brush",
			toolCount: 25,
		},
		{
			id: 2,
			name: "Backend",
			slug: "backend",
			description: "APIs, databases, and server tools",
			icon: "heroicons:server",
			toolCount: 18,
		},
		{
			id: 3,
			name: "AI Helpers",
			slug: "ai-helpers",
			description: "AI-powered coding assistants and tools",
			icon: "heroicons:cpu-chip",
			toolCount: 12,
		},
		{
			id: 4,
			name: "Documentation",
			slug: "documentation",
			description: "Tools for creating and maintaining docs",
			icon: "heroicons:document-text",
			toolCount: 8,
		},
	]);
</script>
