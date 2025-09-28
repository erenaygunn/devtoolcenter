<script setup lang="ts">
	const apiBase = "http://localhost:5050/api/v1";
	const { logout, adminUser, getToken, initAuth } = useAdminAuth();

	// Get token for API calls
	const getAuthToken = () => getToken();

	const tab = ref<"pending" | "approved" | "rejected">("pending");
	const submissions = ref<any[]>([]);
	const loading = ref(false);

	const showDetails = ref(false);
	const showEdit = ref(false);
	const selectedSub = ref<any>(null);
	const editForm = ref<any>(null);

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

	const loadSubmissions = async () => {
		loading.value = true;
		try {
			const res: any = await $fetch(`${apiBase}/submissions`, {
				params: { status: tab.value },
				headers: { Authorization: `Bearer ${getAuthToken()}` },
			});
			submissions.value = res.data;
		} catch (err) {
			console.error("Failed to load submissions:", err);
			submissions.value = [];
		} finally {
			loading.value = false;
		}
	};

	onMounted(loadSubmissions);
	watch(tab, loadSubmissions);

	const viewDetails = (sub: any) => {
		selectedSub.value = sub;
		showDetails.value = true;
	};

	const editSubmission = (sub: any) => {
		editForm.value = {
			...sub,
			// Convert tags array to comma-separated string for input field
			tags: Array.isArray(sub.tags) ? sub.tags.join(", ") : sub.tags || "",
		};
		showEdit.value = true;
	};

	// Add computed property for better stats
	const allSubmissions = ref<any[]>([]);
	const submissionCounts = computed(() => ({
		pending: allSubmissions.value.filter((s) => s.status === "pending").length,
		approved: allSubmissions.value.filter((s) => s.status === "approved")
			.length,
		rejected: allSubmissions.value.filter((s) => s.status === "rejected")
			.length,
	}));

	const loadAllSubmissions = async () => {
		try {
			const [pending, approved, rejected] = await Promise.all([
				$fetch(`${apiBase}/submissions`, {
					params: { status: "pending" },
					headers: { Authorization: `Bearer ${getAuthToken()}` },
				}),
				$fetch(`${apiBase}/submissions`, {
					params: { status: "approved" },
					headers: { Authorization: `Bearer ${getAuthToken()}` },
				}),
				$fetch(`${apiBase}/submissions`, {
					params: { status: "rejected" },
					headers: { Authorization: `Bearer ${getAuthToken()}` },
				}),
			]);

			allSubmissions.value = [
				...(pending.data || []).map((s) => ({ ...s, status: "pending" })),
				...(approved.data || []).map((s) => ({ ...s, status: "approved" })),
				...(rejected.data || []).map((s) => ({ ...s, status: "rejected" })),
			];
		} catch (err) {
			console.error("Failed to load all submissions:", err);
		}
	};

	const saveEdit = async () => {
		try {
			const token = getAuthToken();
			if (!token) {
				console.error("No auth token available for editing submission");
				alert("Authentication required. Please log in again.");
				return;
			}

			// Prepare the data with tags converted back to array
			const submissionData = {
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

			await $fetch(`${apiBase}/submissions/${editForm.value._id}/edit`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: submissionData,
			});

			showEdit.value = false;
			loadSubmissions();
			loadAllSubmissions(); // Refresh stats
		} catch (error: any) {
			console.error("Failed to save submission:", error);

			if (error.status === 401) {
				alert("Authentication failed. Please log in again.");
				logout();
			} else {
				alert(`Failed to save submission: ${error.message || "Unknown error"}`);
			}
		}
	};

	const approve = async (id: string) => {
		try {
			const token = getAuthToken();
			if (!token) {
				console.error("No auth token available for approving submission");
				alert("Authentication required. Please log in again.");
				return;
			}

			await $fetch(`${apiBase}/submissions/${id}/approve`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			loadSubmissions();
			loadAllSubmissions(); // Refresh stats
		} catch (error: any) {
			console.error("Failed to approve submission:", error);

			if (error.status === 401) {
				alert("Authentication failed. Please log in again.");
				logout();
			} else {
				alert(
					`Failed to approve submission: ${error.message || "Unknown error"}`
				);
			}
		}
	};

	const reject = async (id: string) => {
		try {
			const token = getAuthToken();
			if (!token) {
				console.error("No auth token available for rejecting submission");
				alert("Authentication required. Please log in again.");
				return;
			}

			await $fetch(`${apiBase}/submissions/${id}/reject`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			loadSubmissions();
			loadAllSubmissions(); // Refresh stats
		} catch (error: any) {
			console.error("Failed to reject submission:", error);

			if (error.status === 401) {
				alert("Authentication failed. Please log in again.");
				logout();
			} else {
				alert(
					`Failed to reject submission: ${error.message || "Unknown error"}`
				);
			}
		}
	};

	// Dropdown state management
	const priceExpanded = ref(false);
	const categoryExpanded = ref(false);
	const priceButton = ref(null);
	const categoryButton = ref(null);
	const priceDropdownStyle = ref({});
	const categoryDropdownStyle = ref({});

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

	const selectPrice = (price) => {
		editForm.value.price = price;
		priceExpanded.value = false;
	};

	const selectCategory = (category) => {
		editForm.value.category = category;
		categoryExpanded.value = false;
	};

	onMounted(async () => {
		await initAuth();
		loadSubmissions();
		loadAllSubmissions();

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

	watch(tab, () => {
		loadSubmissions();
		// Don't reload allSubmissions on tab change, only on data changes
	});
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
					<span class="text-primary">Admin Panel</span>
				</nav>

				<div
					class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
				>
					<div>
						<h1 class="text-h1 mb-2">
							<span class="gradient-text">Admin Panel</span>
						</h1>
						<p class="text-muted">
							Manage tool submissions and moderate content
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
							to="/admin/tools"
							class="btn btn-secondary"
						>
							<Icon
								name="heroicons:squares-2x2"
								class="h-4 w-4 mr-2"
							/>
							Manage Tools
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
				<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
					<div class="card">
						<div class="flex items-center gap-3">
							<div class="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
								<Icon
									name="heroicons:clock"
									class="h-5 w-5 text-yellow-600"
								/>
							</div>
							<div>
								<p class="text-sm text-muted">Pending</p>
								<p class="text-lg font-semibold">
									{{ submissionCounts.pending }}
								</p>
							</div>
						</div>
					</div>

					<div class="card">
						<div class="flex items-center gap-3">
							<div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
								<Icon
									name="heroicons:check-circle"
									class="h-5 w-5 text-green-600"
								/>
							</div>
							<div>
								<p class="text-sm text-muted">Approved</p>
								<p class="text-lg font-semibold">
									{{ submissionCounts.approved }}
								</p>
							</div>
						</div>
					</div>

					<div class="card">
						<div class="flex items-center gap-3">
							<div class="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
								<Icon
									name="heroicons:x-circle"
									class="h-5 w-5 text-red-600"
								/>
							</div>
							<div>
								<p class="text-sm text-muted">Rejected</p>
								<p class="text-lg font-semibold">
									{{ submissionCounts.rejected }}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Tabs -->
			<div class="mb-8">
				<div class="flex flex-wrap gap-2">
					<button
						v-for="t in ['pending', 'approved', 'rejected']"
						:key="t"
						@click="tab = t"
						:class="[
							'btn capitalize transition-colors',
							tab === t ? 'btn-primary' : 'btn-tertiary',
						]"
					>
						<Icon
							:name="
								t === 'pending'
									? 'heroicons:clock'
									: t === 'approved'
									? 'heroicons:check-circle'
									: 'heroicons:x-circle'
							"
							class="h-4 w-4 mr-2"
						/>
						{{ t }}
					</button>
				</div>
			</div>

			<!-- Table -->
			<div class="card overflow-hidden">
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="border-b border-gray-200 dark:border-gray-700">
								<th class="px-4 md:px-6 py-4 text-left text-sm font-semibold">
									Tool
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
									class="px-4 md:px-6 py-4 text-left text-sm font-semibold hidden xl:table-cell"
								>
									Description
								</th>
								<th class="px-4 md:px-6 py-4 text-left text-sm font-semibold">
									Date
								</th>
								<th class="px-4 md:px-6 py-4 text-left text-sm font-semibold">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="sub in submissions"
								:key="sub._id"
								class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
							>
								<td class="px-4 md:px-6 py-4">
									<div class="font-semibold">{{ sub.name }}</div>
									<div class="text-sm text-muted md:hidden">
										{{ sub.category }}
									</div>
									<div
										class="text-xs text-muted sm:hidden flex items-center gap-1 mt-1"
										v-if="sub.price"
									>
										<Icon
											:name="getPriceIcon(sub.price)"
											class="h-3 w-3"
										/>
										{{ getPriceLabel(sub.price) }}
									</div>
								</td>
								<td class="px-4 md:px-6 py-4 hidden md:table-cell">
									<span
										class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
									>
										{{ sub.category }}
									</span>
								</td>
								<td class="px-4 md:px-6 py-4 hidden sm:table-cell">
									<div
										class="flex items-center gap-2"
										v-if="sub.price"
									>
										<Icon
											:name="getPriceIcon(sub.price)"
											class="h-4 w-4 text-primary"
										/>
										<span class="text-sm">{{ getPriceLabel(sub.price) }}</span>
									</div>
									<span
										class="text-xs text-muted"
										v-else
										>Not specified</span
									>
								</td>
								<td class="px-4 md:px-6 py-4 hidden lg:table-cell">
									<a
										:href="sub.url"
										target="_blank"
										class="text-primary hover:underline text-sm break-all"
									>
										{{
											sub.url.length > 40
												? sub.url.slice(0, 40) + "..."
												: sub.url
										}}
									</a>
								</td>
								<td
									class="px-4 md:px-6 py-4 hidden xl:table-cell text-sm text-muted"
								>
									{{ sub.description.slice(0, 60) }}...
								</td>
								<td class="px-6 py-4">
									<div class="text-muted text-sm">
										{{ new Date(sub.createdAt).toLocaleDateString() }}
									</div>
								</td>
								<td class="px-4 md:px-6 py-4">
									<div class="flex flex-col sm:flex-row gap-1 sm:gap-2">
										<button
											class="btn btn-sm btn-secondary text-xs"
											@click="viewDetails(sub)"
										>
											<Icon
												name="heroicons:eye"
												class="h-3 w-3 mr-1"
											/>
											<span class="hidden sm:inline">View</span>
										</button>
										<button
											class="btn btn-sm bg-yellow-600 text-white text-xs"
											@click="editSubmission(sub)"
										>
											<Icon
												name="heroicons:pencil"
												class="h-3 w-3 mr-1"
											/>
											<span class="hidden sm:inline">Edit</span>
										</button>
										<button
											v-if="tab === 'pending'"
											class="btn btn-sm bg-green-600 text-white text-xs"
											@click="approve(sub._id)"
										>
											<Icon
												name="heroicons:check"
												class="h-3 w-3 mr-1"
											/>
											<span class="hidden sm:inline">Approve</span>
										</button>
										<button
											v-if="tab === 'pending'"
											class="btn btn-sm bg-red-600 text-white text-xs"
											@click="reject(sub._id)"
										>
											<Icon
												name="heroicons:x-mark"
												class="h-3 w-3 mr-1"
											/>
											<span class="hidden sm:inline">Reject</span>
										</button>
									</div>
								</td>
							</tr>
						</tbody>
					</table>

					<!-- Empty State -->
					<div
						v-if="!submissions.length && !loading"
						class="text-center py-12"
					>
						<Icon
							name="heroicons:document-text"
							class="h-16 w-16 text-subtle mx-auto mb-4"
						/>
						<h3 class="text-h4 text-muted mb-2">No submissions found</h3>
						<p class="text-subtle">
							There are no {{ tab }} submissions at the moment.
						</p>
					</div>

					<!-- Loading State -->
					<div
						v-if="loading"
						class="text-center py-12"
					>
						<div
							class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"
						></div>
						<p class="text-muted">Loading submissions...</p>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- View Details Modal -->
	<div
		v-if="showDetails"
		class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
		@click="showDetails = false"
	>
		<div
			class="card max-w-2xl w-full max-h-[80vh] overflow-y-auto"
			@click.stop
		>
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-h2">Submission Details</h2>
				<button
					@click="showDetails = false"
					class="btn btn-tertiary btn-sm"
				>
					<Icon
						name="heroicons:x-mark"
						class="h-4 w-4"
					/>
				</button>
			</div>

			<div class="space-y-4">
				<div>
					<label class="block text-sm font-medium mb-1">Name</label>
					<p class="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
						{{ selectedSub?.name }}
					</p>
				</div>
				<div>
					<label class="block text-sm font-medium mb-1">Category</label>
					<p class="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
						{{ selectedSub?.category }}
					</p>
				</div>
				<div>
					<label class="block text-sm font-medium mb-1">Price</label>
					<div class="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
						<div
							class="flex items-center gap-2"
							v-if="selectedSub?.price"
						>
							<Icon
								:name="getPriceIcon(selectedSub.price)"
								class="h-4 w-4 text-primary"
							/>
							{{ getPriceLabel(selectedSub.price) }}
						</div>
						<span
							class="text-muted"
							v-else
							>Not specified</span
						>
					</div>
				</div>
				<div>
					<label class="block text-sm font-medium mb-1">URL</label>
					<p
						class="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg break-all"
					>
						<a
							:href="selectedSub?.url"
							target="_blank"
							class="text-primary hover:underline"
						>
							{{ selectedSub?.url }}
						</a>
					</p>
				</div>
				<div>
					<label class="block text-sm font-medium mb-1">Description</label>
					<p class="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
						{{ selectedSub?.description }}
					</p>
				</div>
				<div>
					<label class="block text-sm font-medium mb-1">Tags</label>
					<div class="flex flex-wrap gap-2">
						<span
							v-for="tag in selectedSub?.tags"
							:key="tag"
							class="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
						>
							{{ tag }}
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Edit Modal -->
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
				<h2 class="text-h2">Edit Submission</h2>
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
				@submit.prevent="saveEdit"
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
							v-for="tag in editForm.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0)"
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
