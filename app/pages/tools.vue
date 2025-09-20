<template>
	<div class="pt-16 py-8 px-4 sm:px-6 lg:px-8">
		<div class="max-w-7xl mx-auto">
			<!-- Header -->
			<div class="mb-8">
				<h1 class="text-4xl font-bold text-white mb-4">Browse Tools</h1>
				<p class="text-gray-400">
					Discover productivity tools curated by the developer community
				</p>
			</div>

			<!-- Search and Filters -->
			<div class="glass rounded-xl p-6 mb-8">
				<div class="flex flex-col lg:flex-row gap-4">
					<div class="flex-1">
						<div class="relative">
							<Icon
								name="heroicons:magnifying-glass"
								class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
							/>
							<input
								v-model="searchQuery"
								type="text"
								placeholder="Search tools..."
								class="w-full pl-10 pr-4 py-3 glass rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50"
							/>
						</div>
					</div>

					<select
						v-model="selectedCategory"
						class="glass rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-400/50"
					>
						<option value="">All Categories</option>
						<option value="frontend">Frontend</option>
						<option value="backend">Backend</option>
						<option value="ai-helpers">AI Helpers</option>
						<option value="documentation">Documentation</option>
					</select>

					<select
						v-model="sortBy"
						class="glass rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-400/50"
					>
						<option value="rating">Sort by Rating</option>
						<option value="name">Sort by Name</option>
						<option value="category">Sort by Category</option>
					</select>
				</div>
			</div>

			<!-- Tools Grid -->
			<div class="grid lg:grid-cols-2 gap-6">
				<ToolCard
					v-for="tool in filteredTools"
					:key="tool.id"
					:tool="tool"
				/>
			</div>

			<!-- Empty State -->
			<div
				v-if="filteredTools.length === 0"
				class="text-center py-12"
			>
				<Icon
					name="heroicons:magnifying-glass"
					class="h-16 w-16 text-gray-500 mx-auto mb-4"
				/>
				<h3 class="text-xl font-semibold text-gray-400 mb-2">No tools found</h3>
				<p class="text-gray-500">Try adjusting your search or filters</p>
			</div>
		</div>
	</div>
</template>

<script setup>
	useHead({
		title: "Browse Tools - DevShelf",
		meta: [
			{
				name: "description",
				content:
					"Browse and discover the best free productivity tools for developers, curated by the community.",
			},
		],
	});

	const searchQuery = ref("");
	const selectedCategory = ref("");
	const sortBy = ref("rating");

	// Mock data - replace with actual API call
	const tools = ref([
		{
			id: 1,
			name: "VS Code",
			description:
				"Free, powerful code editor with extensive extensions and built-in Git support.",
			icon: "simple-icons:visualstudiocode",
			tags: ["Editor", "Free", "Extensions"],
			rating: 4.9,
			category: "frontend",
			url: "https://code.visualstudio.com",
		},
		// Add more tools...
	]);

	const filteredTools = computed(() => {
		let filtered = tools.value;

		// Filter by search query
		if (searchQuery.value) {
			filtered = filtered.filter(
				(tool) =>
					tool.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
					tool.description
						.toLowerCase()
						.includes(searchQuery.value.toLowerCase())
			);
		}

		// Filter by category
		if (selectedCategory.value) {
			filtered = filtered.filter(
				(tool) => tool.category === selectedCategory.value
			);
		}

		// Sort
		filtered.sort((a, b) => {
			switch (sortBy.value) {
				case "name":
					return a.name.localeCompare(b.name);
				case "category":
					return a.category.localeCompare(b.category);
				case "rating":
				default:
					return b.rating - a.rating;
			}
		});

		return filtered;
	});
</script>
