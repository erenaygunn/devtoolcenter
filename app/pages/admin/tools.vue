<script setup lang="ts">
	const apiBase = "http://localhost:5050/api/v1";
	const { logout, adminUser, getToken, initAuth } = useAdminAuth();

	// Get token for API calls
	const getAuthToken = () => getToken();

	const tools = ref<any[]>([]);
	const loading = ref(false);
	const showEdit = ref(false);
	const editForm = ref<any>(null);

	// Dropdown state management
	const priceExpanded = ref(false);
	const categoryExpanded = ref(false);
	const sortExpanded = ref(false);
	const priceButton = ref(null);
	const categoryButton = ref(null);
	const sortButton = ref(null);
	const priceDropdownStyle = ref({});
	const categoryDropdownStyle = ref({});
	const sortDropdownStyle = ref({});
	const search = ref("");
	const sortBy = ref("date"); // Default to date for admin

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

	const getPriceIcon = (price) => {
		const icons = {
			free: "heroicons:gift",
			"free-plan": "heroicons:star",
			paid: "heroicons:currency-dollar",
		};
		return icons[price] || "heroicons:currency-dollar";
	};

	const getPriceLabel = (price) => {
		const labels = {
			free: "Free",
			"free-plan": "Free Plan Available",
			paid: "Paid",
		};
		return labels[price] || price;
	};

	// Categories data
	const { data: catData } = await useFetch(`${apiBase}/categories`);
	const categories = computed(() =>
		(catData.value?.data ?? []).map((c: any) => ({
			slug: c.slug,
			name: c.name,
			icon: c.icon,
		}))
	);

	const getCategoryIcon = (category) => {
		const icons = {
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

	const getCategoryLabel = (category) => {
		const labels = {
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

	const getSortLabel = (sort) => {
		const labels = {
			name: "Sort by Name",
			category: "Sort by Category",
			price: "Sort by Price",
			date: "Sort by Date Added",
		};
		return labels[sort] || "Sort by Date Added";
	};

	const getSortIcon = (sort) => {
		const icons = {
			name: "heroicons:bars-3-bottom-left",
			category: "heroicons:squares-2x2",
			price: "heroicons:currency-dollar",
			date: "heroicons:calendar-days",
		};
		return icons[sort] || "heroicons:calendar-days";
	};

	const updateDropdownPositions = () => {
		if (priceButton.value && priceExpanded.value) {
			const rect = priceButton.value.getBoundingClientRect();
			priceDropdownStyle.value = {
				top: `${rect.bottom + 8}px`,
				left: `${rect.left}px`,
				width: `${rect.width}px`,
			};
		}

		if (categoryButton.value && categoryExpanded.value) {
			const rect = categoryButton.value.getBoundingClientRect();
			categoryDropdownStyle.value = {
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
	};

	watch([priceExpanded, categoryExpanded, sortExpanded], () => {
		nextTick(() => {
			updateDropdownPositions();
		});
	});

	onMounted(() => {
		window.addEventListener("resize", updateDropdownPositions);
		window.addEventListener("scroll", updateDropdownPositions);

		const handleClickOutside = (event) => {
			if (
				priceExpanded.value &&
				!priceButton.value?.contains(event.target) &&
				!event.target.closest(".fixed")
			) {
				priceExpanded.value = false;
			}
			if (
				categoryExpanded.value &&
				!categoryButton.value?.contains(event.target) &&
				!event.target.closest(".fixed")
			) {
				categoryExpanded.value = false;
			}
			if (
				sortExpanded.value &&
				!sortButton.value?.contains(event.target) &&
				!event.target.closest(".fixed")
			) {
				sortExpanded.value = false;
			}
		};
		document.addEventListener("click", handleClickOutside);

		onUnmounted(() => {
			window.removeEventListener("resize", updateDropdownPositions);
			window.removeEventListener("scroll", updateDropdownPositions);
			document.removeEventListener("click", handleClickOutside);
		});
	});

	const selectPrice = (price) => {
		editForm.value.price = price;
		priceExpanded.value = false;
	};

	const selectCategory = (category) => {
		editForm.value.category = category;
		categoryExpanded.value = false;
	};

	const selectSort = (sort) => {
		sortBy.value = sort;
		sortExpanded.value = false;
		loadTools();
	};

	const loadTools = async () => {
		try {
			loading.value = true;
			console.log("🔄 Loading tools from:", `${apiBase}/tools`);

			// First, let's test if backend is available
			try {
				const healthCheck = await $fetch(`http://localhost:5050/health`);
				console.log("✅ Backend health check passed:", healthCheck);
			} catch (healthError) {
				console.error("❌ Backend health check failed:", healthError);
				console.error(
					"🚨 Make sure your backend server is running on localhost:5050"
				);
				throw new Error("Backend server not available");
			}

			// According to your backend API, /tools endpoint doesn't require auth
			// but we'll include it anyway for admin functionality
			const token = getAuthToken();
			console.log("🔑 Auth token:", token ? "Present" : "Not present");

			const requestOptions: any = {
				params: {
					search: search.value,
					sort: sortBy.value,
					order: "asc",
					limit: 100, // Get more tools for admin view
				},
			};

			// Only add headers if we have a token
			if (token) {
				requestOptions.headers = { Authorization: `Bearer ${token}` };
			}

			console.log("📋 Request params:", requestOptions.params);

			const res: any = await $fetch(`${apiBase}/tools`, requestOptions);

			console.log("📦 Tools API response:", res);
			console.log("📦 Response type:", typeof res);
			console.log("📦 Is array:", Array.isArray(res));
			console.log("📦 Has data property:", res && "data" in res);

			// According to your API docs, response should be { data: [...], meta: {...} }
			if (res && res.data) {
				tools.value = res.data;
				console.log(
					"✅ Tools loaded from .data property:",
					res.data.length,
					"items"
				);
			} else if (Array.isArray(res)) {
				tools.value = res;
				console.log("✅ Tools loaded as array:", res.length, "items");
			} else {
				console.warn("⚠️  Unexpected response format:", res);
				tools.value = [];
			}
		} catch (error: any) {
			console.error("❌ Failed to load tools:", error);
			console.error("❌ Error details:", {
				message: error.message,
				status: error.status,
				statusText: error.statusText,
				data: error.data,
			});
			tools.value = [];
		} finally {
			loading.value = false;
		}
	};
	onMounted(async () => {
		await initAuth();
		loadTools();
	});

	const deleteTool = async (id: string) => {
		try {
			const token = getAuthToken();
			if (!token) {
				console.error("No auth token available for deleting tool");
				alert("Authentication required. Please log in again.");
				return;
			}

			if (!confirm("Are you sure you want to delete this tool?")) {
				return;
			}

			console.log("Deleting tool with token:", token ? "Present" : "Missing");

			await $fetch(`${apiBase}/tools/${id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			console.log("✅ Tool deleted successfully");
			loadTools();
		} catch (error: any) {
			console.error("❌ Failed to delete tool:", error);

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
				console.error("No auth token available for editing tool");
				alert("Authentication required. Please log in again.");
				return;
			}

			console.log("Saving tool with token:", token ? "Present" : "Missing");

			// Prepare the data with tags converted back to array
			const toolData = {
				...editForm.value,
				// Convert comma-separated string back to array of trimmed tags
				tags: editForm.value.tags
					? editForm.value.tags
							.split(",")
							.map((tag) => tag.trim())
							.filter((tag) => tag.length > 0)
					: [],
				// Also update keywords field to match tags (if your backend expects this)
				keywords: editForm.value.tags
					? editForm.value.tags
							.split(",")
							.map((tag) => tag.trim())
							.filter((tag) => tag.length > 0)
					: [],
			};

			console.log("Tool data:", toolData);

			await $fetch(`${apiBase}/tools/${editForm.value._id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: toolData,
			});

			console.log("✅ Tool saved successfully");
			showEdit.value = false;
			loadTools();
		} catch (error: any) {
			console.error("❌ Failed to save tool:", error);

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
	<div class="!pt-40 section">
		<div class="container">
			<!-- Admin Navigation -->
			<div class="mb-8">
				<nav class="flex items-center gap-2 text-sm text-muted mb-4">
					<NuxtLink
						to="/"
						class="hover:text-primary transition-colors"
						>Home</NuxtLink
					>
					<Icon
						name="heroicons:chevron-right"
						class="h-4 w-4"
					/>
					<NuxtLink
						to="/admin"
						class="hover:text-primary transition-colors"
						>Admin Panel</NuxtLink
					>
					<Icon
						name="heroicons:chevron-right"
						class="h-4 w-4"
					/>
					<span class="text-primary">Tools</span>
				</nav>

				<div
					class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
				>
					<div>
						<h1 class="text-h1 mb-2">
							<span class="gradient-text">Manage Tools</span>
						</h1>
						<p class="text-muted">
							View and manage all approved tools in the database
						</p>
					</div>

					<div class="flex flex-wrap items-center gap-3">
						<!-- Admin info -->
						<div class="hidden md:flex items-center gap-2 text-sm">
							<Icon
								name="heroicons:user-circle"
								class="h-5 w-5 text-muted"
							/>
							<span class="text-muted">{{ adminUser?.email }}</span>
							<span
								class="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full"
							>
								{{ adminUser?.role }}
							</span>
						</div>

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
					</div>
				</div>

				<!-- Stats Cards -->
				<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
					<div class="card">
						<div class="flex items-center gap-3">
							<div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
								<Icon
									name="heroicons:squares-2x2"
									class="h-5 w-5 text-blue-600"
								/>
							</div>
							<div>
								<p class="text-sm text-muted">Total Tools</p>
								<p class="text-lg font-semibold">{{ tools.length }}</p>
							</div>
						</div>
					</div>

					<div class="card">
						<div class="flex items-center gap-3">
							<div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
								<Icon
									name="heroicons:gift"
									class="h-5 w-5 text-green-600"
								/>
							</div>
							<div>
								<p class="text-sm text-muted">Free Tools</p>
								<p class="text-lg font-semibold">
									{{ tools.filter((t) => t.price === "free").length }}
								</p>
							</div>
						</div>
					</div>

					<div class="card">
						<div class="flex items-center gap-3">
							<div class="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
								<Icon
									name="heroicons:star"
									class="h-5 w-5 text-yellow-600"
								/>
							</div>
							<div>
								<p class="text-sm text-muted">Freemium</p>
								<p class="text-lg font-semibold">
									{{ tools.filter((t) => t.price === "free-plan").length }}
								</p>
							</div>
						</div>
					</div>

					<div class="card">
						<div class="flex items-center gap-3">
							<div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
								<Icon
									name="heroicons:currency-dollar"
									class="h-5 w-5 text-purple-600"
								/>
							</div>
							<div>
								<p class="text-sm text-muted">Paid Tools</p>
								<p class="text-lg font-semibold">
									{{ tools.filter((t) => t.price === "paid").length }}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Search Bar and Sort -->
			<div class="card mb-6">
				<div class="flex flex-col lg:flex-row gap-4">
					<div class="relative flex-1">
						<input
							v-model="search"
							@input="loadTools"
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
							</div>
						</div>
					</Teleport>
				</div>
			</div>

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
										<span class="text-sm">{{ getPriceLabel(tool.price) }}</span>
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
											class="btn btn-sm btn-secondary text-xs"
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
							@click="loadTools"
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
	<div
		v-if="showEdit"
		class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
		@click="showEdit = false"
	>
		<div
			class="card max-w-2xl w-full max-h-[80vh] overflow-y-auto"
			@click.stop
		>
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-h2">Edit Tool</h2>
				<button
					@click="showEdit = false"
					class="btn btn-tertiary btn-sm"
				>
					<Icon
						name="heroicons:x-mark"
						class="h-4 w-4"
					/>
				</button>
			</div>

			<form
				@submit.prevent="saveTool"
				class="space-y-6"
			>
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

				<div>
					<label class="block text-sm font-medium mb-2">Category *</label>
					<div class="relative">
						<button
							@click="categoryExpanded = !categoryExpanded"
							type="button"
							class="flex items-center justify-between w-full p-3 form-select transition-colors"
							ref="categoryButton"
						>
							<span class="flex items-center gap-2 text-sm font-medium">
								<Icon
									v-if="editForm.category"
									:name="getCategoryIcon(editForm.category)"
									class="h-4 w-4"
								/>
								<Icon
									v-else
									name="heroicons:squares-2x2"
									class="h-4 w-4 text-muted"
								/>
								{{
									editForm.category
										? getCategoryLabel(editForm.category)
										: "Select a category"
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
									v-for="category in categories"
									:key="category.slug"
									@click="selectCategory(category.slug)"
									type="button"
									class="flex items-center gap-3 w-full p-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
									:class="{
										'bg-primary/10 text-primary':
											editForm.category === category.slug,
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
				</div>

				<div>
					<label class="block text-sm font-medium mb-2">Price *</label>
					<div class="relative">
						<button
							@click="priceExpanded = !priceExpanded"
							type="button"
							class="flex items-center justify-between w-full p-3 form-select transition-colors"
							ref="priceButton"
						>
							<span class="flex items-center gap-2 text-sm font-medium">
								<Icon
									v-if="editForm.price"
									:name="getPriceIcon(editForm.price)"
									class="h-4 w-4"
								/>
								<Icon
									v-else
									name="heroicons:currency-dollar"
									class="h-4 w-4 text-muted"
								/>
								{{
									editForm.price
										? getPriceLabel(editForm.price)
										: "Select pricing model"
								}}
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
									v-for="priceOption in priceOptions"
									:key="priceOption.value"
									@click="selectPrice(priceOption.value)"
									type="button"
									class="flex items-center gap-3 w-full p-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
									:class="{
										'bg-primary/10 text-primary':
											editForm.price === priceOption.value,
									}"
								>
									<Icon
										:name="priceOption.icon"
										class="h-4 w-4"
									/>
									<div class="text-left">
										<div class="font-medium">{{ priceOption.label }}</div>
										<div class="text-xs text-muted">
											{{ priceOption.description }}
										</div>
									</div>
								</button>
							</div>
						</div>
					</Teleport>
				</div>

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
			</form>
		</div>
	</div>
</template>
