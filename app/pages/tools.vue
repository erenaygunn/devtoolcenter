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
                                                                @click="toggleCategoryDropdown()"
                                                                class="flex items-center justify-between w-full p-3 form-select transition-colors min-w-[200px]"
                                                                ref="categoryTriggerRef"
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
                                                                                isCategoryOpen
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
                                                                v-if="isCategoryOpen"
                                                                class="fixed glass rounded-lg shadow-xl z-[9999]"
                                                                :style="categoryStyle"
                                                                ref="categoryContentRef"
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
                                                                @click="togglePriceDropdown()"
                                                                class="flex items-center justify-between w-full p-3 form-select transition-colors min-w-[200px]"
                                                                ref="priceTriggerRef"
                                                        >
                                                                <span class="flex items-center gap-2 text-sm font-medium">
                                                                        <Icon
                                                                                :name="getPricingIcon(selectedPrice)"
                                                                                class="h-4 w-4 text-muted"
                                                                        />
                                                                        {{ getPricingLabel(selectedPrice) }}
                                                                </span>
                                                                <Icon
                                                                        :name="
                                                                                isPriceOpen
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
                                                                v-if="isPriceOpen"
                                                                class="fixed glass rounded-lg shadow-xl z-[9999]"
                                                                :style="priceStyle"
                                                                ref="priceContentRef"
                                                        >
                                                                <div class="p-2">
                                                                        <button
                                                                                v-for="option in pricingFilters"
                                                                                :key="option.value || 'all-pricing'"
                                                                                @click="selectPrice(option.value)"
                                                                                class="flex items-center gap-3 w-full p-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                                                                                :class="{
                                                                                        'bg-primary/10 text-primary': selectedPrice === option.value,
                                                                                }"
                                                                        >
                                                                                <Icon
                                                                                        :name="option.icon"
                                                                                        class="h-4 w-4"
                                                                                />
                                                                                {{ option.label }}
                                                                        </button>
                                                                </div>
                                                        </div>
                                                </Teleport>

                                                <!-- Sort Options -->
                                                <div class="relative">
                                                        <button
                                                                @click="toggleSortDropdown()"
                                                                class="flex items-center justify-between w-full p-3 form-select transition-colors min-w-[200px]"
                                                                ref="sortTriggerRef"
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
                                                                                isSortOpen
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
                                                                v-if="isSortOpen"
                                                                class="fixed glass rounded-lg shadow-xl z-[9999]"
                                                                :style="sortStyle"
                                                                ref="sortContentRef"
                                                        >
                                                                <div class="p-2">
                                                                        <button
                                                                                v-for="option in sortOptions"
                                                                                :key="option.value"
                                                                                @click="selectSort(option.value)"
                                                                                class="flex items-center gap-3 w-full p-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                                                                                :class="{
                                                                                        'bg-primary/10 text-primary': sortBy === option.value,
                                                                                }"
                                                                        >
                                                                                <Icon
                                                                                        :name="option.icon"
                                                                                        class="h-4 w-4"
                                                                                />
                                                                                {{ option.label }}
                                                                        </button>
                                                                </div>
                                                        </div>
                                                </Teleport>
					</div>

                                        <!-- Keywords Filter -->
                                        <div class="relative">
                                                <button
                                                        @click="toggleKeywordsDropdown()"
                                                        class="flex items-center justify-between w-full p-3 border rounded-lg form-select transition-colors"
                                                        ref="keywordsTriggerRef"
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
                                                                        isKeywordsOpen
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
                                                        v-if="isKeywordsOpen"
                                                        class="fixed glass rounded-lg shadow-xl z-[9999]"
                                                        :style="keywordsDropdownStyle"
                                                        ref="keywordsContentRef"
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
                                                        Price: {{ getPricingLabel(selectedPrice) }}
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
        import { nextTick } from "vue";
        import {
                getPricingIcon,
                getPricingLabel,
                pricingFilters,
                sortOptions,
                getSortIcon,
                getSortLabel,
        } from "~/utils/toolOptions";

        const { buildUrl } = useApiEndpoints();
        const { categories, getCategoryLabel, getCategoryIcon } = useCategories();

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
        const selectedKeywords = ref<string[]>([]);
        const sortBy = ref("name");

        const {
                isOpen: isCategoryOpen,
                triggerRef: categoryTriggerRef,
                contentRef: categoryContentRef,
                style: categoryStyle,
                toggle: toggleCategoryDropdown,
                close: closeCategoryDropdown,
                updatePosition: updateCategoryPosition,
        } = useFloatingDropdown();

        const {
                isOpen: isPriceOpen,
                triggerRef: priceTriggerRef,
                contentRef: priceContentRef,
                style: priceStyle,
                toggle: togglePriceDropdown,
                close: closePriceDropdown,
                updatePosition: updatePricePosition,
        } = useFloatingDropdown();

        const {
                isOpen: isSortOpen,
                triggerRef: sortTriggerRef,
                contentRef: sortContentRef,
                style: sortStyle,
                toggle: toggleSortDropdown,
                close: closeSortDropdown,
                updatePosition: updateSortPosition,
        } = useFloatingDropdown();

        const {
                isOpen: isKeywordsOpen,
                triggerRef: keywordsTriggerRef,
                contentRef: keywordsContentRef,
                style: keywordsStyle,
                toggle: toggleKeywordsDropdown,
                close: closeKeywordsDropdown,
                updatePosition: updateKeywordsPosition,
        } = useFloatingDropdown();

        const keywordsDropdownStyle = computed(() => ({
                ...keywordsStyle.value,
                minWidth: `${Math.max(parseInt(keywordsStyle.value?.width || "0"), 280)}px`,
        }));

        const keywordsKey = computed(() => selectedKeywords.value.slice().sort().join("|"));

        const buildParams = () => ({
                search: searchQuery.value || undefined,
                category: selectedCategory.value || undefined,
                price: selectedPrice.value || undefined,
                keywords: selectedKeywords.value.length ? selectedKeywords.value : undefined,
                sort: sortBy.value || "name",
                page: 1,
                limit: 24,
        });

        const {
                data: apiData,
        } = await useAsyncData(
                "tools-list",
                () => $fetch(buildUrl("/tools"), { params: buildParams() }),
                {
                        watch: [searchQuery, selectedCategory, selectedPrice, keywordsKey, sortBy],
                }
        );

        const filteredTools = computed(() => apiData.value?.data ?? []);

        const availableKeywords = computed(() => {
                const keywords = new Set<string>();
                filteredTools.value.forEach((tool: any) => {
                        (tool.keywords || []).forEach((keyword: string) => {
                                keywords.add(keyword);
                        });
                });
                return Array.from(keywords).sort();
        });

        const hasActiveFilters = computed(() => {
                return (
                        !!selectedCategory.value ||
                        !!selectedPrice.value ||
                        selectedKeywords.value.length > 0 ||
                        !!searchQuery.value
                );
        });

        const toggleKeyword = (keyword: string) => {
                if (selectedKeywords.value.includes(keyword)) {
                        selectedKeywords.value = selectedKeywords.value.filter((k) => k !== keyword);
                        return;
                }
                selectedKeywords.value = [...selectedKeywords.value, keyword];
        };

        const removeKeyword = (keyword: string) => {
                selectedKeywords.value = selectedKeywords.value.filter((k) => k !== keyword);
        };

        const clearSelectedKeywords = () => {
                selectedKeywords.value = [];
        };

        const clearAllFilters = () => {
                searchQuery.value = "";
                selectedCategory.value = "";
                selectedPrice.value = "";
                selectedKeywords.value = [];
                closeCategoryDropdown();
                closePriceDropdown();
                closeSortDropdown();
                closeKeywordsDropdown();
        };

        const selectCategory = (category: string) => {
                selectedCategory.value = category;
                closeCategoryDropdown();
        };

        const selectPrice = (price: string) => {
                selectedPrice.value = price;
                closePriceDropdown();
        };

        const selectSort = (sort: string) => {
                sortBy.value = sort;
                closeSortDropdown();
        };

        watch(() => isCategoryOpen.value, (open) => {
                if (open) {
                        nextTick(updateCategoryPosition);
                }
        });

        watch(() => isPriceOpen.value, (open) => {
                if (open) {
                        nextTick(updatePricePosition);
                }
        });

        watch(() => isSortOpen.value, (open) => {
                if (open) {
                        nextTick(updateSortPosition);
                }
        });

        watch([() => isKeywordsOpen.value, selectedKeywords, filteredTools], ([open]) => {
                if (open) {
                        nextTick(updateKeywordsPosition);
                }
        });

        onMounted(() => {
                const route = useRoute();
                if (route.query.search) {
                        searchQuery.value = String(route.query.search);
                }
                if (route.query.category) {
                        selectedCategory.value = String(route.query.category);
                }
                if (route.query.price) {
                        selectedPrice.value = String(route.query.price);
                }
                if (route.query.keywords) {
                        selectedKeywords.value = Array.isArray(route.query.keywords)
                                ? route.query.keywords.map(String)
                                : [String(route.query.keywords)];
                }
        });

        watch([searchQuery, selectedCategory, selectedPrice, keywordsKey], () => {
                const query: Record<string, any> = {};
                if (searchQuery.value) query.search = searchQuery.value;
                if (selectedCategory.value) query.category = selectedCategory.value;
                if (selectedPrice.value) query.price = selectedPrice.value;
                if (selectedKeywords.value.length > 0) query.keywords = selectedKeywords.value;
                navigateTo({ query }, { replace: true });
        });
</script>

