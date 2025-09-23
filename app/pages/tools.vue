<template>
	<div class="!pt-40 section">
		<div class="container">
			<!-- Header -->
			<div class="mb-8">
				<h1 class="text-h1 mb-4">
					Browse <span class="gradient-text">Tools</span>
				</h1>
				<p class="text-muted">
					Discover productivity tools curated by the developer community
				</p>
			</div>

			<!-- Advanced Search and Filters -->
			<div class="card mb-8">
				<div class="space-y-4">
					<!-- Search Input -->
					<div class="relative">
						<Icon
							name="heroicons:magnifying-glass"
							class="absolute text-primary right-3 top-1/2 transform -translate-y-1/2 h-5 w-5"
						/>
						<input
							v-model="searchQuery"
							type="text"
							placeholder="Search by title, description, or URL..."
							class="form-input pl-10"
						/>
					</div>

					<!-- Filters Row -->
					<div class="flex flex-col lg:flex-row gap-4">
						<!-- Category Filter -->
						<select
							v-model="selectedCategory"
							class="form-select"
						>
							<option value="">All Categories</option>
							<option value="frontend">Frontend</option>
							<option value="backend">Backend</option>
							<option value="ai-helpers">AI Helpers</option>
							<option value="documentation">Documentation</option>
							<option value="design">Design</option>
							<option value="devops">DevOps</option>
							<option value="testing">Testing</option>
						</select>

						<!-- Price Filter -->
						<select
							v-model="selectedPrice"
							class="form-select"
						>
							<option value="">All Pricing</option>
							<option value="free">Free</option>
							<option value="free-plan">Free Plan Available</option>
							<option value="paid">Paid</option>
						</select>

						<!-- Sort Options -->
						<select
							v-model="sortBy"
							class="form-select"
						>
							<option value="rating">Sort by Rating</option>
							<option value="name">Sort by Name</option>
							<option value="category">Sort by Category</option>
							<option value="price">Sort by Price</option>
						</select>
					</div>

					<!-- Keywords Filter -->
					<div>
						<button
							@click="keywordsExpanded = !keywordsExpanded"
							class="flex items-center justify-between w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
						>
							<span class="text-sm font-medium">
								Filter by Keywords
								<span
									v-if="selectedKeywords.length > 0"
									class="text-primary ml-1"
								>
									({{ selectedKeywords.length }} selected)
								</span>
							</span>
							<Icon
								:name="
									keywordsExpanded
										? 'heroicons:chevron-up'
										: 'heroicons:chevron-down'
								"
								class="h-4 w-4 text-muted"
							/>
						</button>

						<div
							v-if="keywordsExpanded"
							class="mt-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-800/50"
						>
							<div class="flex flex-wrap gap-2">
								<button
									v-for="keyword in availableKeywords"
									:key="keyword"
									@click="toggleKeyword(keyword)"
									:class="[
										'px-2 py-1 btn-secondary text-xs rounded-full transition-colors',
										selectedKeywords.includes(keyword)
											? 'bg-primary text-white'
											: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
									]"
								>
									{{ keyword }}
								</button>
							</div>

							<div
								v-if="selectedKeywords.length > 0"
								class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
							>
								<button
									@click="clearSelectedKeywords"
									class="text-xs text-red-500 hover:text-red-600"
								>
									Clear all keywords
								</button>
							</div>
						</div>
					</div>

					<!-- Active Filters Display -->
					<div
						v-if="hasActiveFilters"
						class="flex items-center flex-wrap gap-2"
					>
						<span class="text-small text-muted">Active filters:</span>
						<span
							v-if="selectedCategory"
							class="px-2 py-1 bg-primary/10 text-primary rounded-full text-small flex items-center gap-1"
						>
							Category: {{ selectedCategory }}
							<button
								@click="selectedCategory = ''"
								class="hover:text-red-400"
							>
								<Icon
									name="heroicons:x-mark"
									class="h-3 w-3"
								/>
							</button>
						</span>
						<span
							v-if="selectedPrice"
							class="px-2 py-1 bg-primary/10 text-primary rounded-full text-small flex items-center gap-1"
						>
							Price: {{ selectedPrice }}
							<button
								@click="selectedPrice = ''"
								class="hover:text-red-400"
							>
								<Icon
									name="heroicons:x-mark"
									class="h-3 w-3"
								/>
							</button>
						</span>
						<span
							v-for="keyword in selectedKeywords"
							:key="keyword"
							class="px-2 py-1 bg-primary/10 text-primary rounded-full text-small flex items-center gap-1"
						>
							{{ keyword }}
							<button
								@click="removeKeyword(keyword)"
								class="hover:text-red-400"
							>
								<Icon
									name="heroicons:x-mark"
									class="h-3 w-3"
								/>
							</button>
						</span>
						<button
							@click="clearAllFilters"
							class="px-2 py-1 text-red-400 hover:bg-red-400/10 rounded-full text-small"
						>
							Clear all
						</button>
					</div>
				</div>
			</div>

			<!-- Results Summary -->
			<div class="mb-6">
				<p class="text-muted">
					{{ filteredTools.length }} tool{{
						filteredTools.length !== 1 ? "s" : ""
					}}
					found
				</p>
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
				class="text-center section-sm"
			>
				<Icon
					name="heroicons:magnifying-glass"
					class="h-16 w-16 text-subtle mx-auto mb-4"
				/>
				<h3 class="text-h4 text-muted mb-2">No tools found</h3>
				<p class="text-subtle">Try adjusting your search or filters</p>
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
	const selectedPrice = ref("");
	const selectedKeywords = ref([]);
	const sortBy = ref("rating");
	const keywordsExpanded = ref(false);

	// Initialize from URL query params
	onMounted(() => {
		const route = useRoute();
		if (route.query.search) {
			searchQuery.value = route.query.search;
		}
		if (route.query.category) {
			selectedCategory.value = route.query.category;
		}
		if (route.query.price) {
			selectedPrice.value = route.query.price;
		}
		if (route.query.keywords) {
			selectedKeywords.value = Array.isArray(route.query.keywords)
				? route.query.keywords
				: [route.query.keywords];
		}
	});

	// Enhanced mock data with more properties
	const tools = ref([
		{
			id: 1,
			name: "VS Code",
			description:
				"Free, powerful code editor with extensive extensions and built-in Git support.",
			icon: "simple-icons:visualstudiocode",
			tags: ["Editor", "Free", "Extensions"],
			keywords: ["code", "editor", "microsoft", "programming", "development"],
			rating: 4.9,
			category: "frontend",
			price: "free",
			url: "https://code.visualstudio.com",
		},
		{
			id: 2,
			name: "Figma",
			description:
				"Collaborative interface design tool with real-time collaboration features.",
			icon: "simple-icons:figma",
			tags: ["Design", "Collaboration", "UI/UX"],
			keywords: ["design", "ui", "ux", "prototype", "collaboration"],
			rating: 4.8,
			category: "design",
			price: "free-plan",
			url: "https://figma.com",
		},
		{
			id: 3,
			name: "Notion",
			description:
				"All-in-one workspace for notes, tasks, wikis, and databases.",
			icon: "simple-icons:notion",
			tags: ["Productivity", "Notes", "Database"],
			keywords: ["notes", "productivity", "workspace", "organization"],
			rating: 4.7,
			category: "documentation",
			price: "free-plan",
			url: "https://notion.so",
		},
		// Add more tools...
	]);

	// Get all unique keywords from tools
	const availableKeywords = computed(() => {
		const keywords = new Set();
		tools.value.forEach((tool) => {
			tool.keywords.forEach((keyword) => {
				keywords.add(keyword);
			});
		});
		return Array.from(keywords).sort();
	});

	const hasActiveFilters = computed(() => {
		return (
			selectedCategory.value ||
			selectedPrice.value ||
			selectedKeywords.value.length > 0 ||
			searchQuery.value
		);
	});

	const toggleKeyword = (keyword) => {
		const index = selectedKeywords.value.indexOf(keyword);
		if (index > -1) {
			selectedKeywords.value.splice(index, 1);
		} else {
			selectedKeywords.value.push(keyword);
		}
	};

	const removeKeyword = (keyword) => {
		selectedKeywords.value = selectedKeywords.value.filter(
			(k) => k !== keyword
		);
	};

	const clearSelectedKeywords = () => {
		selectedKeywords.value = [];
	};

	const clearAllFilters = () => {
		searchQuery.value = "";
		selectedCategory.value = "";
		selectedPrice.value = "";
		selectedKeywords.value = [];
		keywordsExpanded.value = false;
	};

	const filteredTools = computed(() => {
		let filtered = tools.value;

		// Filter by search query (title, description, URL)
		if (searchQuery.value) {
			const query = searchQuery.value.toLowerCase();
			filtered = filtered.filter((tool) => {
				return (
					tool.name.toLowerCase().includes(query) ||
					tool.description.toLowerCase().includes(query) ||
					tool.url.toLowerCase().includes(query) ||
					tool.tags.some((tag) => tag.toLowerCase().includes(query))
				);
			});
		}

		// Filter by category
		if (selectedCategory.value) {
			filtered = filtered.filter(
				(tool) => tool.category === selectedCategory.value
			);
		}

		// Filter by price
		if (selectedPrice.value) {
			filtered = filtered.filter((tool) => tool.price === selectedPrice.value);
		}

		// Filter by keywords
		if (selectedKeywords.value.length > 0) {
			filtered = filtered.filter((tool) =>
				selectedKeywords.value.some((selectedKeyword) =>
					tool.keywords.includes(selectedKeyword)
				)
			);
		}

		// Sort
		filtered.sort((a, b) => {
			switch (sortBy.value) {
				case "name":
					return a.name.localeCompare(b.name);
				case "category":
					return a.category.localeCompare(b.category);
				case "price":
					const priceOrder = { free: 0, "free-plan": 1, paid: 2 };
					return priceOrder[a.price] - priceOrder[b.price];
				case "rating":
				default:
					return b.rating - a.rating;
			}
		});

		return filtered;
	});

	// Watch for URL updates
	watch(
		[searchQuery, selectedCategory, selectedPrice, selectedKeywords],
		() => {
			const query = {};
			if (searchQuery.value) query.search = searchQuery.value;
			if (selectedCategory.value) query.category = selectedCategory.value;
			if (selectedPrice.value) query.price = selectedPrice.value;
			if (selectedKeywords.value.length > 0)
				query.keywords = selectedKeywords.value;

			navigateTo({ query }, { replace: true });
		}
	);
</script>
