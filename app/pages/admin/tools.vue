<script setup lang="ts">
	// Require authentication for this page
	definePageMeta({
		middleware: "admin",
	});

	const config = useRuntimeConfig();
	const apiBase = config.public.apiBase;
	const { logout, adminUser, getToken, initAuth, checkAuth, isAuthenticated } =
		useAdminAuth();

	// Authentication check on mount
	onMounted(async () => {
		if (process.client) {
			const isAuth = await checkAuth();
			if (!isAuth) {
				await navigateTo("/admin/login");
				return;
			}
			await initAuth();
		}
	});

	// Watch for authentication state changes
	watch(isAuthenticated, (newVal) => {
		if (process.client && !newVal) {
			navigateTo("/admin/login", { replace: true });
		}
	});

	// Get token for API calls
	const getAuthToken = () => getToken();

	const showEdit = ref(false);
	const editForm = ref<any>(null);

	// Initialize caching and debounced search for admin
	const { cachedFetch, invalidateCache } = useApiCache();

	// Set up debounced filters for admin interface
	const { filters, isSearching, pendingChanges, setSearchQuery, setSortBy } =
		useDebouncedFilters({
			debounceMs: 400, // Faster response for admin
			batchTimeout: 800,
			initialFilters: {
				searchQuery: "",
				sortBy: "date", // Default to date for admin
				selectedCategory: "",
				selectedPrice: "",
				selectedKeywords: [],
			},
			onFilterChange: async () => {
				await loadTools();
			},
		});

	// Dropdown state management
	const priceExpanded = ref(false);
	const categoryExpanded = ref(false);
	const sortExpanded = ref(false);

	// Computed values for template access
	const searchQuery = computed({
		get: () => filters.value.searchQuery,
		set: (value: string) => setSearchQuery(value),
	});

	const sortBy = computed({
		get: () => filters.value.sortBy,
		set: (value: string) => setSortBy(value),
	});

	const priceOptions = [
		{
			value: "free",
			label: "Free",
			description: "Completely free to use",
			icon: "heroicons:gift",
		},
		{
			value: "free-plan",
			label: "Free Plan Available",
			description: "Has free tier with paid upgrades",
			icon: "heroicons:star",
		},
		{
			value: "paid",
			label: "Paid",
			description: "Requires payment to use",
			icon: "heroicons:currency-dollar",
		},
	];

	const getPriceIcon = (price: string) => {
		const icons: Record<string, string> = {
			free: "heroicons:gift",
			"free-plan": "heroicons:star",
			paid: "heroicons:currency-dollar",
		};
		return icons[price] || "heroicons:currency-dollar";
	};

	const getPriceLabel = (price: string) => {
		const labels: Record<string, string> = {
			free: "Free",
			"free-plan": "Free Plan Available",
			paid: "Paid",
		};
		return labels[price] || price;
	};

	// Categories data
	const { data: catData } = await useFetch(`${apiBase}/categories`);
	const categories = computed(() =>
		((catData.value as any)?.data ?? []).map((c: any) => ({
			slug: c.slug,
			name: c.name,
			icon: c.icon,
		}))
	);

	const getCategoryIcon = (category: string) => {
		const icons: Record<string, string> = {
			frontend: "heroicons:code-bracket",
			backend: "heroicons:server",
			"ai-helpers": "heroicons:cpu-chip",
			documentation: "heroicons:document-text",
			design: "heroicons:paint-brush",
			devops: "heroicons:cog-6-tooth",
			testing: "heroicons:beaker",
		};
		return icons[category] || "heroicons:squares-2x2";
	};

	const getCategoryLabel = (category: string) => {
		const labels: Record<string, string> = {
			frontend: "Frontend",
			backend: "Backend",
			"ai-helpers": "AI Helpers",
			documentation: "Documentation",
			design: "Design",
			devops: "DevOps",
			testing: "Testing",
		};
		return labels[category] || category;
	};

	const getSortLabel = (sort: string) => {
		const labels: Record<string, string> = {
			name: "Sort by Name",
			category: "Sort by Category",
			price: "Sort by Price",
			date: "Sort by Date Added",
		};
		return labels[sort] || "Sort by Date Added";
	};

	const getSortIcon = (sort: string) => {
		const icons: Record<string, string> = {
			name: "heroicons:bars-3-bottom-left",
			category: "heroicons:squares-2x2",
			price: "heroicons:currency-dollar",
			date: "heroicons:calendar-days",
		};
		return icons[sort] || "heroicons:calendar-days";
	};

	const selectPrice = (price: string) => {
		editForm.value.price = price;
	};

	const selectCategory = (category: string) => {
		editForm.value.category = category;
	};

	const selectSort = (sort: string) => {
		sortBy.value = sort;
	};

	const buildParams = () => ({
		search: filters.value.searchQuery || undefined,
		sort: filters.value.sortBy || "date",
		order: "asc",
		limit: 100, // Get more tools for admin view
	});

	// Use cached data fetching for admin tools
	const {
		data: apiData,
		pending: loading,
		refresh: loadTools,
	} = await useAsyncData(
		"admin-tools-list",
		async () => {
			// Test if backend is available
			try {
				await $fetch(`${apiBase.replace("/api/v1", "")}/health`);
			} catch (healthError) {
				throw new Error("Backend server not available");
			}

			const token = getAuthToken();
			const requestOptions: any = {
				params: buildParams(),
			};

			// Only add headers if we have a token
			if (token) {
				requestOptions.headers = { Authorization: `Bearer ${token}` };
			}

			// Use cached fetch with shorter TTL for admin data
			return await cachedFetch(`${apiBase}/tools`, requestOptions, {
				ttl: 3 * 60 * 1000, // 3 minutes for admin tools
			});
		},
		{
			server: false,
			default: () => ({ data: [] }),
		}
	);

	// Convert reactive data to tools array
	const tools = computed(() => (apiData.value as any)?.data ?? []);
	onMounted(async () => {
		await initAuth();
	});

	const deleteTool = async (id: string) => {
		try {
			const token = getAuthToken();
			if (!token) {
				alert("Authentication required. Please log in again.");
				return;
			}

			if (!confirm("Are you sure you want to delete this tool?")) {
				return;
			}
			await $fetch(`${apiBase}/tools/${id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			// Invalidate caches after deletion
			invalidateCache("/tools");
			await loadTools();
		} catch (error: any) {
			if (error.status === 401) {
				alert("Authentication failed. Please log in again.");
				logout();
			} else {
				alert(`Failed to delete tool: ${error.message || "Unknown error"}`);
			}
		}
	};

	const editTool = (tool: any) => {
		editForm.value = {
			...tool,
			// Convert tags array to comma-separated string for input field
			tags: Array.isArray(tool.tags) ? tool.tags.join(", ") : tool.tags || "",
		};
		showEdit.value = true;
	};

	const saveTool = async () => {
		try {
			const token = getAuthToken();
			if (!token) {
				alert("Authentication required. Please log in again.");
				return;
			}

			// Prepare the data with tags converted back to array
			const toolData = {
				...editForm.value,
				// Convert comma-separated string back to array of trimmed tags
				tags: editForm.value.tags
					? editForm.value.tags
							.split(",")
							.map((tag: string) => tag.trim())
							.filter((tag: string) => tag.length > 0)
					: [],
				// Also update keywords field to match tags (if your backend expects this)
				keywords: editForm.value.tags
					? editForm.value.tags
							.split(",")
							.map((tag: string) => tag.trim())
							.filter((tag: string) => tag.length > 0)
					: [],
			};

			await $fetch(`${apiBase}/tools/${editForm.value._id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: toolData,
			});

			showEdit.value = false;
			await loadTools();
		} catch (error: any) {
			if (error.status === 401) {
				alert("Authentication failed. Please log in again.");
				logout();
			} else {
				alert(`Failed to save tool: ${error.message || "Unknown error"}`);
			}
		}
	};
</script>

<template>
	<AdminGuard>
		<div class="!pt-40 section">
			<div class="container">
				<!-- Admin Navigation -->
				<div class="mb-8">
					<BreadcrumbNav
						:items="[
							{ label: 'Home', to: '/' },
							{ label: 'Admin Panel', to: '/admin' },
							{ label: 'Tools' },
						]"
					/>

					<AdminHeader
						title="Manage Tools"
						description="View and manage all approved tools in the database"
						:admin-user="adminUser"
					>
						<template #actions>
							<NuxtLink
								to="/admin"
								class="btn btn-secondary"
							>
								<Icon
									name="heroicons:document-text"
									class="h-4 w-4 mr-2"
								/>
								Submissions
							</NuxtLink>
							<NuxtLink
								to="/submit"
								class="btn btn-tertiary"
							>
								<Icon
									name="heroicons:plus"
									class="h-4 w-4 mr-2"
								/>
								Add Tool
							</NuxtLink>
							<button
								@click="logout"
								class="btn btn-outline !border-red-500/30 !text-red-400 hover:!bg-red-500/10"
							>
								<Icon
									name="heroicons:arrow-right-start-on-rectangle"
									class="h-4 w-4 mr-2"
								/>
								Logout
							</button>
						</template>
					</AdminHeader>

					<!-- Stats Cards -->
					<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
						<StatsCard
							icon="heroicons:gift"
							label="Free Tools"
							:value="tools.filter((t) => t.price === 'free').length"
							color="green"
						/>
						<StatsCard
							icon="heroicons:star"
							label="Freemium"
							:value="tools.filter((t) => t.price === 'free-plan').length"
							color="yellow"
						/>
						<StatsCard
							icon="heroicons:currency-dollar"
							label="Paid"
							:value="tools.filter((t) => t.price === 'paid').length"
							color="blue"
						/>
					</div>
				</div>

				<!-- Search Bar and Sort -->
				<div class="card mb-6">
					<div class="flex flex-col lg:flex-row gap-4">
						<div class="relative w-full min-w-[300px]">
							<input
								v-model="searchQuery"
								type="text"
								placeholder="Search tools by name, category, URL, or tags..."
								class="form-input pl-10 w-full"
							/>
							<Icon
								name="heroicons:magnifying-glass"
								class="absolute text-primary right-3 top-1/2 transform -translate-y-1/2 h-5 w-5"
							/>
						</div>

						<!-- Sort Options -->
						<DropdownMenu
							v-model="sortExpanded"
							content-class="glass rounded-lg shadow-xl"
						>
							<template #trigger="{ toggle, setTriggerRef, triggerAttrs }">
								<button
									class="flex items-center justify-between w-full p-3 form-select transition-colors min-w-[200px]"
									:ref="setTriggerRef"
									v-bind="triggerAttrs"
									@click="toggle"
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
							</template>
							<template #content="{ close }">
								<div class="p-2">
									<button
										@click="
											() => {
												selectSort('date');
												close();
											}
										"
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
									<button
										@click="
											() => {
												selectSort('name');
												close();
											}
										"
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
										@click="
											() => {
												selectSort('category');
												close();
											}
										"
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
										@click="
											() => {
												selectSort('price');
												close();
											}
										"
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
								</div>
							</template>
						</DropdownMenu>
					</div>
				</div>

				<!-- Tools Table -->
				<div class="card overflow-hidden">
					<div class="overflow-x-auto">
						<table class="w-full">
							<thead>
								<tr class="border-b border-gray-200 dark:border-gray-700">
									<th class="px-4 md:px-6 py-4 text-left text-sm font-semibold">
										Name
									</th>
									<th
										class="px-4 md:px-6 py-4 text-left text-sm font-semibold hidden md:table-cell"
									>
										Category
									</th>
									<th
										class="px-4 md:px-6 py-4 text-left text-sm font-semibold hidden sm:table-cell"
									>
										Price
									</th>
									<th
										class="px-4 md:px-6 py-4 text-left text-sm font-semibold hidden lg:table-cell"
									>
										URL
									</th>
									<th
										class="px-4 md:px-6 py-4 text-left text-sm font-semibold hidden lg:table-cell"
									>
										Date
									</th>
									<th class="px-4 md:px-6 py-4 text-left text-sm font-semibold">
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="tool in tools"
									:key="tool._id"
									class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
								>
									<td class="px-4 md:px-6 py-4">
										<div class="font-semibold">{{ tool.name }}</div>
										<div class="text-sm text-muted md:hidden">
											{{ tool.category }}
										</div>
										<div
											class="text-xs text-muted sm:hidden flex items-center gap-1 mt-1"
											v-if="tool.price"
										>
											<Icon
												:name="getPriceIcon(tool.price)"
												class="h-3 w-3"
											/>
											{{ getPriceLabel(tool.price) }}
										</div>
									</td>
									<td class="px-4 md:px-6 py-4 hidden md:table-cell">
										<span
											class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
										>
											{{ tool.category }}
										</span>
									</td>
									<td class="px-4 md:px-6 py-4 hidden sm:table-cell">
										<div
											class="flex items-center gap-2"
											v-if="tool.price"
										>
											<Icon
												:name="getPriceIcon(tool.price)"
												class="h-4 w-4 text-primary"
											/>
											<span class="text-sm">{{
												getPriceLabel(tool.price)
											}}</span>
										</div>
										<span
											class="text-xs text-muted"
											v-else
											>Not specified</span
										>
									</td>
									<td class="px-4 md:px-6 py-4 hidden lg:table-cell">
										<a
											:href="tool.url"
											target="_blank"
											rel="noopener noreferrer"
											class="text-primary hover:underline text-sm break-all"
										>
											{{
												tool.url.length > 40
													? tool.url.slice(0, 40) + "..."
													: tool.url
											}}
										</a>
									</td>
									<td class="px-6 py-4">
										<div class="text-muted text-sm">
											{{ new Date(tool.createdAt).toLocaleDateString() }}
										</div>
									</td>
									<td class="px-4 md:px-6 py-4">
										<div class="flex flex-col sm:flex-row gap-1 sm:gap-2">
											<button
												class="btn btn-sm bg-yellow-600 text-white text-xs"
												@click="editTool(tool)"
											>
												<Icon
													name="heroicons:pencil"
													class="h-3 w-3 mr-1"
												/>
												<span class="hidden sm:inline">Edit</span>
											</button>
											<button
												class="btn btn-sm bg-red-600 text-white text-xs"
												@click="deleteTool(tool._id)"
											>
												<Icon
													name="heroicons:trash"
													class="h-3 w-3 mr-1"
												/>
												<span class="hidden sm:inline">Delete</span>
											</button>
										</div>
									</td>
								</tr>
							</tbody>
						</table>

						<!-- Loading State -->
						<div
							v-if="loading"
							class="text-center py-12"
						>
							<Icon
								name="heroicons:arrow-path"
								class="h-16 w-16 text-primary mx-auto mb-4 animate-spin"
							/>
							<h3 class="text-h4 text-muted mb-2">Loading tools...</h3>
							<p class="text-subtle">
								Please wait while we fetch the tools from the database.
							</p>
						</div>

						<!-- Empty State -->
						<div
							v-else-if="!tools.length"
							class="text-center py-12"
						>
							<Icon
								name="heroicons:squares-2x2"
								class="h-16 w-16 text-subtle mx-auto mb-4"
							/>
							<h3 class="text-h4 text-muted mb-2">No tools found</h3>
							<p class="text-subtle mb-4">
								Tools will appear here once they are approved from submissions.
							</p>
							<p class="text-xs text-red-400">
								💡 Check browser console for debugging information
							</p>
							<button
								@click="() => loadTools()"
								class="btn btn-sm btn-secondary mt-4"
							>
								<Icon
									name="heroicons:arrow-path"
									class="h-4 w-4 mr-2"
								/>
								Retry Loading
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Edit Tool Modal -->
		<BaseModal
			:show="showEdit"
			title="Edit Tool"
			@close="showEdit = false"
		>
			<form @submit.prevent="saveTool">
				<div class="space-y-4">
					<div>
						<label class="block text-sm font-medium mb-2">Name *</label>
						<input
							v-model="editForm.name"
							type="text"
							required
							class="form-input w-full"
							placeholder="Tool name"
						/>
					</div>

					<div>
						<label class="block text-sm font-medium mb-2">Description *</label>
						<textarea
							v-model="editForm.description"
							required
							rows="4"
							class="form-input w-full"
							placeholder="Tool description"
						></textarea>
					</div>

					<div>
						<label class="block text-sm font-medium mb-2">URL *</label>
						<input
							v-model="editForm.url"
							type="url"
							required
							class="form-input w-full"
							placeholder="https://example.com"
						/>
					</div>

					<FormDropdown
						v-model="editForm.category"
						label="Category"
						placeholder="Select a category"
						:options="
							categories.map((c) => ({
								value: c.slug,
								label: c.name,
								icon: getCategoryIcon(c.slug),
							}))
						"
						required
					/>

					<FormDropdown
						v-model="editForm.price"
						label="Price"
						placeholder="Select pricing model"
						:options="priceOptions"
						required
					/>

					<div>
						<label class="block text-sm font-medium mb-2">Tags</label>
						<input
							v-model="editForm.tags"
							type="text"
							class="form-input w-full"
							placeholder="Tags (comma separated, e.g.: ui, design, frontend)"
						/>
						<!-- Preview tags as they will appear -->
						<div
							v-if="editForm.tags && editForm.tags.trim()"
							class="flex flex-wrap gap-2 mt-2"
						>
							<span
								v-for="tag in editForm.tags
									.split(',')
									.map((t) => t.trim())
									.filter((t) => t.length > 0)"
								:key="tag"
								class="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
							>
								{{ tag }}
							</span>
						</div>
					</div>

					<div class="flex flex-col sm:flex-row gap-3 pt-4">
						<button
							type="submit"
							class="btn btn-primary flex-1"
						>
							<Icon
								name="heroicons:check"
								class="h-4 w-4 mr-2"
							/>
							Save Changes
						</button>
						<button
							type="button"
							class="btn btn-tertiary flex-1"
							@click="showEdit = false"
						>
							<Icon
								name="heroicons:x-mark"
								class="h-4 w-4 mr-2"
							/>
							Cancel
						</button>
					</div>
				</div>
			</form>
		</BaseModal>
	</AdminGuard>
</template>
