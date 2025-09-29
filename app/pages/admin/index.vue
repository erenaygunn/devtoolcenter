<script setup lang="ts">
	// Require authentication for this page
	definePageMeta({
		middleware: "admin",
	});

	const config = useRuntimeConfig();
	const apiBase = config.public.apiBase;
	const { logout, adminUser, getToken, initAuth, checkAuth, isAuthenticated } =
		useAdminAuth();
	const { sanitizeHtml, checkRateLimit } = useSecurity();

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

	// Use cached fetch for admin data
	const { cachedFetch, invalidateCache } = useApiCache();

	const loadSubmissions = async () => {
		loading.value = true;
		try {
			const res = await cachedFetch(
				`${apiBase}/submissions`,
				{
					params: { status: tab.value },
					headers: { Authorization: `Bearer ${getAuthToken()}` },
				},
				{
					ttl: 3 * 60 * 1000, // 3 minutes for admin data
				}
			);
			submissions.value = res.data || [];
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
				cachedFetch(
					`${apiBase}/submissions`,
					{
						params: { status: "pending" },
						headers: { Authorization: `Bearer ${getAuthToken()}` },
					},
					{ ttl: 3 * 60 * 1000 }
				),
				cachedFetch(
					`${apiBase}/submissions`,
					{
						params: { status: "approved" },
						headers: { Authorization: `Bearer ${getAuthToken()}` },
					},
					{ ttl: 3 * 60 * 1000 }
				),
				cachedFetch(
					`${apiBase}/submissions`,
					{
						params: { status: "rejected" },
						headers: { Authorization: `Bearer ${getAuthToken()}` },
					},
					{ ttl: 3 * 60 * 1000 }
				),
			]);

			allSubmissions.value = [
				...((pending as any)?.data || []).map((s: any) => ({
					...s,
					status: "pending",
				})),
				...((approved as any)?.data || []).map((s: any) => ({
					...s,
					status: "approved",
				})),
				...((rejected as any)?.data || []).map((s: any) => ({
					...s,
					status: "rejected",
				})),
			];
		} catch (err) {
			console.error("Failed to load all submissions:", err);
		}
	};

	const saveSubmission = async () => {
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

	const approveSubmission = async (id: string) => {
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

			// Invalidate caches after approval - new tool added
			invalidateCache("/tools");
			invalidateCache("/submissions");

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

	const rejectSubmission = async (id: string) => {
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

			// Invalidate submissions cache after rejection
			invalidateCache("/submissions");

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

	const selectPrice = (price) => {
		editForm.value.price = price;
	};

	const selectCategory = (category) => {
		editForm.value.category = category;
	};

	onMounted(async () => {
		await initAuth();
		loadSubmissions();
		loadAllSubmissions();
	});

	watch(tab, () => {
		loadSubmissions();
		// Don't reload allSubmissions on tab change, only on data changes
	});
</script>

<template>
	<AdminGuard>
		<div class="!pt-40 section">
			<div class="container">
				<!-- Admin Navigation -->
				<div class="mb-8">
					<BreadcrumbNav
						:items="[{ label: 'Home', to: '/' }, { label: 'Admin Panel' }]"
					/>

					<AdminHeader
						title="Admin Panel"
						description="Manage tool submissions and moderate content"
						:admin-user="adminUser"
						:show-status="true"
					>
						<template #actions>
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
						</template>
					</AdminHeader>

					<!-- Stats Cards -->
					<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
						<StatsCard
							icon="heroicons:clock"
							label="Pending"
							:value="submissionCounts.pending"
							color="yellow"
						/>
						<StatsCard
							icon="heroicons:check-circle"
							label="Approved"
							:value="submissionCounts.approved"
							color="green"
						/>
						<StatsCard
							icon="heroicons:x-circle"
							label="Rejected"
							:value="submissionCounts.rejected"
							color="red"
						/>
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
				<SubmissionTable :items="submissions">
					<template #actions="{ item }">
						<div class="flex flex-col sm:flex-row gap-1 sm:gap-2">
							<button
								class="btn btn-sm btn-secondary text-xs"
								@click="viewDetails(item)"
							>
								<Icon
									name="heroicons:eye"
									class="h-3 w-3 mr-1"
								/>
								<span class="hidden sm:inline">View</span>
							</button>
							<button
								class="btn btn-sm bg-yellow-600 text-white text-xs"
								@click="editSubmission(item)"
							>
								<Icon
									name="heroicons:pencil"
									class="h-3 w-3 mr-1"
								/>
								<span class="hidden sm:inline">Edit</span>
							</button>
							<button
								v-if="item.status === 'pending'"
								class="btn btn-sm btn-primary text-xs"
								@click="approveSubmission(item._id)"
							>
								<Icon
									name="heroicons:check"
									class="h-3 w-3 mr-1"
								/>
								<span class="hidden sm:inline">Approve</span>
							</button>
							<button
								v-if="item.status !== 'rejected'"
								class="btn btn-sm bg-red-600 text-white text-xs"
								@click="rejectSubmission(item._id)"
							>
								<Icon
									name="heroicons:x-mark"
									class="h-3 w-3 mr-1"
								/>
								<span class="hidden sm:inline">Reject</span>
							</button>
						</div>
					</template>
				</SubmissionTable>

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

		<!-- Details Modal -->
		<BaseModal
			:show="showDetails"
			title="Submission Details"
			@close="showDetails = false"
		>
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
					<p class="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
						{{ selectedSub?.price }}
					</p>
				</div>
				<div>
					<label class="block text-sm font-medium mb-1">URL</label>
					<p class="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
						<a
							:href="selectedSub?.url"
							target="_blank"
							rel="noopener noreferrer"
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
		</BaseModal>

		<!-- Edit Modal -->
		<BaseModal
			:show="showEdit"
			title="Edit Submission"
			@close="showEdit = false"
		>
			<form @submit.prevent="saveSubmission">
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
				</div>
			</form>
		</BaseModal>
	</AdminGuard>
</template>
