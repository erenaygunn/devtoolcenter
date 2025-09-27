<script setup lang="ts">
	const apiBase = "http://localhost:5050/api/v1";
	const adminToken = useRuntimeConfig().public.adminToken;

	const tools = ref<any[]>([]);
	const showEdit = ref(false);
	const editForm = ref<any>(null);

	// Dropdown state management
	const priceExpanded = ref(false);
	const categoryExpanded = ref(false);
	const priceButton = ref(null);
	const categoryButton = ref(null);
	const priceDropdownStyle = ref({});
	const categoryDropdownStyle = ref({});

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
	};

	watch([priceExpanded, categoryExpanded], () => {
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

	const loadTools = async () => {
		const res: any = await $fetch(`${apiBase}/tools`, {
			headers: { Authorization: `Bearer ${adminToken}` },
		});
		tools.value = res.data;
	};
	onMounted(loadTools);

	const deleteTool = async (id: string) => {
		await $fetch(`${apiBase}/tools/${id}`, {
			method: "DELETE",
			headers: { Authorization: `Bearer ${adminToken}` },
		});
		loadTools();
	};

	const editTool = (tool: any) => {
		editForm.value = { ...tool };
		showEdit.value = true;
	};

	const saveTool = async () => {
		await $fetch(`${apiBase}/tools/${editForm.value._id}`, {
			method: "PATCH",
			headers: { Authorization: `Bearer ${adminToken}` },
			body: editForm.value,
		});
		showEdit.value = false;
		loadTools();
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

					<div class="flex flex-wrap gap-3">
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

					<!-- Empty State -->
					<div
						v-if="!tools.length"
						class="text-center py-12"
					>
						<Icon
							name="heroicons:squares-2x2"
							class="h-16 w-16 text-subtle mx-auto mb-4"
						/>
						<h3 class="text-h4 text-muted mb-2">No tools found</h3>
						<p class="text-subtle">
							Tools will appear here once they are approved from submissions.
						</p>
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
						placeholder="Tags (comma separated)"
					/>
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
