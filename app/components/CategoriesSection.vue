<template>
	<section class="section">
		<div class="container">
			<div class="text-center mb-12">
				<h2 class="text-h2 mb-4">Browse by Category</h2>
				<p class="text-muted">
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
</template>

<script setup>
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
