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
						<div class="relative">
							<button
								@click="categoryExpanded = !categoryExpanded"
								class="flex items-center justify-between w-full p-3 form-select transition-colors min-w-[200px]"
								ref="categoryButton"
							>
								<span class="flex items-center gap-2 text-sm font-medium">
									<Icon
										v-if="selectedCategory"
										:name="getCategoryIcon(selectedCategory)"
										class="h-4 w-4"
									/>
									<Icon
										v-else
										name="heroicons:squares-2x2"
										class="h-4 w-4 text-muted"
									/>
									{{
										selectedCategory
											? getCategoryLabel(selectedCategory)
											: "All Categories"
									}}
								</span>
								<Icon
									:name="
										categoryExpanded
											? 'heroicons:chevron-up'
											: 'heroicons:chevron-down'
									"
									class="h-4 w-4"
								/>
							</button>
						</div>

						<!-- Teleported Category Dropdown -->
						<Teleport to="body">
							<div
								v-if="categoryExpanded"
								class="fixed glass rounded-lg shadow-xl z-[9999]"
								:style="categoryDropdownStyle"
							>
								<div class="p-2">
									<button
										@click="selectCategory('')"
										class="flex items-center form-select gap-3 w-full p-2 transition-colors"
										:class="{
											'bg-primary/10 text-primary': selectedCategory === '',
										}"
									>
										<Icon
											name="heroicons:squares-2x2"
											class="h-4 w-4"
										/>
										All Categories
									</button>
									<button
										v-for="category in categories"
										:key="category.slug"
										@click="selectCategory(category.slug)"
										class="flex items-center gap-3 w-full p-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
										:class="{
											'bg-primary/10 text-primary':
												selectedCategory === category.slug,
										}"
									>
										<Icon
											:name="category.icon"
											class="h-4 w-4"
										/>
										{{ category.name }}
									</button>
								</div>
							</div>
						</Teleport>

						<!-- Price Filter -->
						<div class="relative">
							<button
								@click="priceExpanded = !priceExpanded"
								class="flex items-center justify-between w-full p-3 form-select transition-colors min-w-[200px]"
								ref="priceButton"
							>
								<span class="flex items-center gap-2 text-sm font-medium">
									<Icon
										name="heroicons:currency-dollar"
										class="h-4 w-4 text-muted"
									/>
									{{ getPriceLabel(selectedPrice) }}
								</span>
								<Icon
									:name="
										priceExpanded
											? 'heroicons:chevron-up'
											: 'heroicons:chevron-down'
									"
									class="h-4 w-4"
								/>
							</button>
						</div>

						<!-- Teleported Price Dropdown -->
						<Teleport to="body">
							<div
								v-if="priceExpanded"
								class="fixed glass rounded-lg shadow-xl z-[9999]"
								:style="priceDropdownStyle"
							>
								<div class="p-2">
									<button
										@click="selectPrice('')"
										class="flex items-center gap-3 w-full p-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
										:class="{
											'bg-primary/10 text-primary': selectedPrice === '',
										}"
									>
										<Icon
											name="heroicons:currency-dollar"
											class="h-4 w-4"
										/>
										All Pricing
									</button>
									<button
										@click="selectPrice('free')"
										class="flex items-center gap-3 w-full p-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
										:class="{
											'bg-primary/10 text-primary': selectedPrice === 'free',
										}"
									>
										<Icon
											name="heroicons:gift"
											class="h-4 w-4"
										/>
										Free
									</button>
									<button
										@click="selectPrice('free-plan')"
										class="flex items-center gap-3 w-full p-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
										:class="{
											'bg-primary/10 text-primary':
												selectedPrice === 'free-plan',
										}"
									>
										<Icon
											name="heroicons:sparkles"
											class="h-4 w-4"
										/>
										Free Plan Available
									</button>
									<button
										@click="selectPrice('paid')"
										class="flex items-center gap-3 w-full p-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
										:class="{
											'bg-primary/10 text-primary': selectedPrice === 'paid',
										}"
									>
										<Icon
											name="heroicons:credit-card"
											class="h-4 w-4"
										/>
										Paid
									</button>
								</div>
							</div>
						</Teleport>

						<!-- Sort Options -->
						<div class="relative">
							<button
								@click="sortExpanded = !sortExpanded"
								class="flex items-center justify-between w-full p-3 form-select transition-colors min-w-[200px]"
								ref="sortButton"
							>
								<span class="flex items-center gap-2 text-sm font-medium">
									<Icon
										:name="getSortIcon(sortBy)"
										class="h-4 w-4 text-muted"
									/>
									{{ getSortLabel(sortBy) }}
								</span>
								<Icon
									:name="
										sortExpanded
											? 'heroicons:chevron-up'
											: 'heroicons:chevron-down'
									"
									class="h-4 w-4"
								/>
							</button>
						</div>

						<!-- Teleported Sort Dropdown -->
						<Teleport to="body">
							<div
								v-if="sortExpanded"
								class="fixed glass rounded-lg shadow-xl z-[9999]"
								:style="sortDropdownStyle"
							>
								<div class="p-2">
									<button
										@click="selectSort('name')"
										class="flex items-center gap-3 w-full p-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
										:class="{
											'bg-primary/10 text-primary': sortBy === 'name',
										}"
									>
										<Icon
											name="heroicons:bars-3-bottom-left"
											class="h-4 w-4"
										/>
										Sort by Name
									</button>
									<button
										@click="selectSort('category')"
										class="flex items-center gap-3 w-full p-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
										:class="{
											'bg-primary/10 text-primary': sortBy === 'category',
										}"
									>
										<Icon
											name="heroicons:squares-2x2"
											class="h-4 w-4"
										/>
										Sort by Category
									</button>
									<button
										@click="selectSort('price')"
										class="flex items-center gap-3 w-full p-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
										:class="{
											'bg-primary/10 text-primary': sortBy === 'price',
										}"
									>
										<Icon
											name="heroicons:currency-dollar"
											class="h-4 w-4"
										/>
										Sort by Price
									</button>
									<button
										@click="selectSort('date')"
										class="flex items-center gap-3 w-full p-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
										:class="{
											'bg-primary/10 text-primary': sortBy === 'date',
										}"
									>
										<Icon
											name="heroicons:calendar-days"
											class="h-4 w-4"
										/>
										Sort by Date Added
									</button>
								</div>
							</div>
						</Teleport>
					</div>

					<!-- Keywords Filter -->
					<div class="relative">
						<button
							@click="keywordsExpanded = !keywordsExpanded"
							class="flex items-center justify-between w-full p-3 border rounded-lg form-select transition-colors"
							ref="keywordsButton"
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
								class="h-4 w-4"
							/>
						</button>
					</div>

					<!-- Teleported Keywords Dropdown -->
					<Teleport to="body">
						<div
							v-if="keywordsExpanded"
							class="fixed glass rounded-lg shadow-xl z-[9999]"
							:style="keywordsDropdownStyle"
						>
							<div class="p-4">
								<div class="flex flex-wrap gap-2">
									<button
										v-for="keyword in availableKeywords"
										:key="keyword"
										@click="toggleKeyword(keyword)"
										:class="[
											'px-2 py-1 btn-secondary text-xs rounded-full transition-colors',
											selectedKeywords.includes(keyword)
												? 'bg-primary text-white'
												: 'bg-gray-100 ',
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
										class="text-xs flex items-center text-red-500 hover:text-red-600"
									>
										Clear all keywords
									</button>
								</div>
							</div>
						</div>
					</Teleport>

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
								class="hover:text-red-400 flex items-center"
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
								class="hover:text-red-400 flex items-center"
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
								class="hover:text-red-400 flex items-center"
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

<script setup lang="ts">
	const apiBase = "http://localhost:5050/api/v1";

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

	// Fetch categories from backend like in submit page
	const { data: catData } = await useFetch(`${apiBase}/categories`);
	const categories = computed(() =>
		(catData.value?.data ?? []).map((c: any) => ({
			slug: c.slug,
			name: c.name,
			icon: c.icon,
		}))
	);

	const searchQuery = ref("");
	const selectedCategory = ref("");
	const selectedPrice = ref("");
	const selectedKeywords = ref([]);
	const sortBy = ref("name");
	const keywordsExpanded = ref(false);
	const categoryExpanded = ref(false);
	const priceExpanded = ref(false);
	const sortExpanded = ref(false);
	const categoryButton = ref(null);
	const keywordsButton = ref(null);
	const priceButton = ref(null);
	const sortButton = ref(null);

	const categoryDropdownStyle = ref({});
	const keywordsDropdownStyle = ref({});
	const priceDropdownStyle = ref({});
	const sortDropdownStyle = ref({});

	const keywordsKey = computed(
		() => selectedKeywords.value.slice().sort().join("|") // a stable string
	);

	const updateDropdownPositions = () => {
		if (categoryButton.value && categoryExpanded.value) {
			const rect = categoryButton.value.getBoundingClientRect();
			categoryDropdownStyle.value = {
				top: `${rect.bottom + 8}px`,
				left: `${rect.left}px`,
				width: `${rect.width}px`,
			};
		}

		if (priceButton.value && priceExpanded.value) {
			const rect = priceButton.value.getBoundingClientRect();
			priceDropdownStyle.value = {
				top: `${rect.bottom + 8}px`,
				left: `${rect.left}px`,
				width: `${rect.width}px`,
			};
		}

		if (sortButton.value && sortExpanded.value) {
			const rect = sortButton.value.getBoundingClientRect();
			sortDropdownStyle.value = {
				top: `${rect.bottom + 8}px`,
				left: `${rect.left}px`,
				width: `${rect.width}px`,
			};
		}

		if (keywordsButton.value && keywordsExpanded.value) {
			const rect = keywordsButton.value.getBoundingClientRect();
			keywordsDropdownStyle.value = {
				top: `${rect.bottom + 8}px`,
				left: `${rect.left}px`,
				right: `${window.innerWidth - rect.right}px`,
			};
		}
	};

	const buildParams = () => ({
		search: searchQuery.value || undefined,
		category: selectedCategory.value || undefined,
		price: selectedPrice.value || undefined,
		keywords: selectedKeywords.value.length
			? selectedKeywords.value
			: undefined,
		sort: sortBy.value || "name",
		page: 1,
		limit: 24,
	});

	const {
		data: apiData,
		pending,
		refresh,
	} = await useAsyncData(
		"tools-list",
		() => $fetch(`${apiBase}/tools`, { params: buildParams() }),
		{
			watch: [
				searchQuery,
				selectedCategory,
				selectedPrice,
				keywordsKey,
				sortBy,
			],
		}
	);

	watch(
		[categoryExpanded, keywordsExpanded, priceExpanded, sortExpanded],
		() => {
			nextTick(() => {
				updateDropdownPositions();
			});
		}
	);

	onMounted(() => {
		window.addEventListener("resize", updateDropdownPositions);
		window.addEventListener("scroll", updateDropdownPositions);

		const handleClickOutside = (event) => {
			if (
				categoryExpanded.value &&
				!categoryButton.value?.contains(event.target) &&
				!event.target.closest(".fixed")
			) {
				categoryExpanded.value = false;
			}
			if (
				priceExpanded.value &&
				!priceButton.value?.contains(event.target) &&
				!event.target.closest(".fixed")
			) {
				priceExpanded.value = false;
			}
			if (
				sortExpanded.value &&
				!sortButton.value?.contains(event.target) &&
				!event.target.closest(".fixed")
			) {
				sortExpanded.value = false;
			}
			if (
				keywordsExpanded.value &&
				!keywordsButton.value?.contains(event.target) &&
				!event.target.closest(".fixed")
			) {
				keywordsExpanded.value = false;
			}
		};
		document.addEventListener("click", handleClickOutside);

		onUnmounted(() => {
			window.removeEventListener("resize", updateDropdownPositions);
			window.removeEventListener("scroll", updateDropdownPositions);
			document.removeEventListener("click", handleClickOutside);
		});
	});

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

	// Get all unique keywords from tools
	const availableKeywords = computed(() => {
		const keywords = new Set();
		filteredTools.value.forEach((tool) => {
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

	const toggleKeyword = (keyword: string) => {
		const had = selectedKeywords.value.includes(keyword);
		selectedKeywords.value = had
			? selectedKeywords.value.filter((k) => k !== keyword) // new array
			: [...selectedKeywords.value, keyword]; // new array
	};

	const removeKeyword = (keyword) => {
		selectedKeywords.value = selectedKeywords.value.filter(
			(k) => k !== keyword
		);
	};

	const clearSelectedKeywords = () => {
		selectedKeywords.value = []; // new array
	};

	const clearAllFilters = () => {
		searchQuery.value = "";
		selectedCategory.value = "";
		selectedPrice.value = "";
		selectedKeywords.value = [];
		keywordsExpanded.value = false;
		categoryExpanded.value = false;
		priceExpanded.value = false;
		sortExpanded.value = false;
	};

	const selectCategory = (category) => {
		selectedCategory.value = category;
		categoryExpanded.value = false;
	};

	const selectPrice = (price) => {
		selectedPrice.value = price;
		priceExpanded.value = false;
	};

	const selectSort = (sort) => {
		sortBy.value = sort;
		sortExpanded.value = false;
	};

	const getCategoryIcon = (category: string) => {
		const found = categories.value.find((c) => c.slug === category);
		return found ? found.icon : "heroicons:squares-2x2";
	};

	const getCategoryLabel = (category: string) => {
		const found = categories.value.find((c) => c.slug === category);
		return found ? found.name : category;
	};

	const getPriceLabel = (price) => {
		const labels = {
			"": "All Pricing",
			free: "Free",
			"free-plan": "Free Plan Available",
			paid: "Paid",
		};
		return labels[price] || "All Pricing";
	};

	const getSortLabel = (sort) => {
		const labels = {
			name: "Sort by Name",
			category: "Sort by Category",
			price: "Sort by Price",
			date: "Sort by Date Added",
		};
		return labels[sort] || "Sort by Name";
	};

	const getSortIcon = (sort) => {
		const icons = {
			name: "heroicons:bars-3-bottom-left",
			category: "heroicons:squares-2x2",
			price: "heroicons:currency-dollar",
			date: "heroicons:calendar-days",
		};
		return icons[sort] || "heroicons:star";
	};

	const filteredTools = computed(() => apiData.value?.data ?? []);

	// Watch for URL updates
	watch([searchQuery, selectedCategory, selectedPrice, keywordsKey], () => {
		// 👈
		const query: any = {};
		if (searchQuery.value) query.search = searchQuery.value;
		if (selectedCategory.value) query.category = selectedCategory.value;
		if (selectedPrice.value) query.price = selectedPrice.value;
		if (selectedKeywords.value.length > 0)
			query.keywords = selectedKeywords.value;
		navigateTo({ query }, { replace: true });
	});
</script>
