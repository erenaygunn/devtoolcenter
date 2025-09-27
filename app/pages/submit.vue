<template>
	<div class="pt-16 section">
		<div class="container max-w-2xl">
			<div class="mb-8">
				<h1 class="text-h1 mb-4">Submit a Tool</h1>
				<p class="text-muted">
					Share a great tool with the developer community
				</p>
			</div>

			<form
				@submit.prevent="submitTool"
				class="space-y-6"
			>
				<!-- Tool Name -->
				<div>
					<label class="block text-sm font-medium mb-2">Tool Name *</label>
					<input
						v-model="form.name"
						type="text"
						required
						class="form-input w-full"
						placeholder="e.g., VS Code"
						@blur="checkForDuplicate"
					/>
					<div
						v-if="duplicateWarning"
						class="mt-2 p-3 bg-yellow-400/10 border border-yellow-400/30 rounded-lg"
					>
						<p class="text-yellow-600 text-sm">
							⚠️ A tool with similar name or URL already exists. Please check if
							it's already in our database.
						</p>
					</div>
				</div>

				<!-- Description -->
				<div>
					<label class="block text-sm font-medium mb-2">Description *</label>
					<textarea
						v-model="form.description"
						required
						rows="4"
						maxlength="300"
						class="form-input w-full"
						placeholder="Brief description of what the tool does (2-3 sentences max)..."
					></textarea>
					<div class="flex justify-between mt-1">
						<p class="text-xs text-muted">Keep it concise - 2-3 sentences</p>
						<p class="text-xs text-muted">{{ form.description.length }}/300</p>
					</div>
				</div>

				<!-- URL -->
				<div>
					<label class="block text-sm font-medium mb-2">Tool URL *</label>
					<input
						v-model="form.url"
						type="url"
						required
						class="form-input w-full"
						placeholder="https://example.com"
						@blur="checkForDuplicate"
					/>
				</div>

				<!-- Category -->
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
									v-if="form.category"
									:name="getCategoryIcon(form.category)"
									class="h-4 w-4"
								/>
								<Icon
									v-else
									name="heroicons:squares-2x2"
									class="h-4 w-4 text-muted"
								/>
								{{
									form.category
										? getCategoryLabel(form.category)
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
											form.category === category.slug,
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

				<!-- Price -->
				<div>
					<label class="block text-sm font-medium mb-2">Pricing *</label>
					<select
						v-model="form.price"
						required
						class="form-select w-full"
					>
						<option value="">Select pricing model</option>
						<option value="free">Free</option>
						<option value="free-plan">Free Plan Available</option>
						<option value="paid">Paid</option>
					</select>
				</div>

				<!-- Icon -->
				<div>
					<label class="block text-sm font-medium mb-2"
						>Icon (Vue Iconify name)</label
					>
					<input
						v-model="form.icon"
						type="text"
						class="form-input w-full"
						placeholder="e.g., simple-icons:visualstudiocode"
					/>
					<p class="text-sm text-muted mt-1">
						Find icons at
						<a
							href="https://icon-sets.iconify.design/"
							target="_blank"
							class="text-primary hover:underline"
							>Iconify</a
						>
					</p>
					<div
						v-if="form.icon"
						class="mt-2 flex items-center gap-2"
					>
						<span class="text-sm text-muted">Preview:</span>
						<Icon
							:name="form.icon"
							class="h-6 w-6 text-primary"
						/>
					</div>
				</div>

				<!-- Tags -->
				<div>
					<label class="block text-sm font-medium mb-2">Tags *</label>
					<div class="relative">
						<button
							@click="tagsExpanded = !tagsExpanded"
							type="button"
							class="flex items-center justify-between w-full p-3 form-select transition-colors"
							ref="tagsButton"
						>
							<span class="text-sm font-medium">
								Select tags
								<span
									v-if="form.tags.length > 0"
									class="text-primary ml-1"
								>
									({{ form.tags.length }} selected)
								</span>
							</span>
							<Icon
								:name="
									tagsExpanded
										? 'heroicons:chevron-up'
										: 'heroicons:chevron-down'
								"
								class="h-4 w-4"
							/>
						</button>
					</div>

					<!-- Teleported Tags Dropdown -->
					<Teleport to="body">
						<div
							v-if="tagsExpanded"
							class="fixed glass rounded-lg shadow-xl z-[9999]"
							:style="tagsDropdownStyle"
						>
							<div class="p-4">
								<div class="flex flex-wrap gap-2">
									<button
										v-for="tag in existingTags"
										:key="tag"
										@click="toggleTag(tag)"
										type="button"
										:class="[
											'px-2 py-1 text-xs rounded-full transition-colors',
											form.tags.includes(tag)
												? 'bg-primary text-white'
												: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
										]"
									>
										{{ tag }}
									</button>
									<button
										@click="showNewTagInput = true"
										type="button"
										class="px-2 py-1 text-xs rounded-full transition-colors bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
									>
										+ Add new tag
									</button>
								</div>

								<input
									v-if="showNewTagInput"
									v-model="newTagInput"
									type="text"
									class="form-input w-full mt-3"
									placeholder="Enter new tag"
									@keyup.enter="addNewTag"
									@blur="cancelNewTag"
								/>

								<div
									v-if="form.tags.length > 0"
									class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
								>
									<button
										@click="clearSelectedTags"
										type="button"
										class="text-xs text-red-500 hover:text-red-600 transition-colors"
									>
										Clear all tags
									</button>
								</div>
							</div>
						</div>
					</Teleport>

					<div
						v-if="form.tags.length > 0"
						class="flex flex-wrap gap-2 mt-2"
					>
						<span
							v-for="(tag, index) in form.tags"
							:key="index"
							class="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
						>
							{{ tag }}
							<button
								type="button"
								@click="removeTag(index)"
								class="inline-flex items-center justify-center hover:text-red-400 transition-colors"
							>
								<Icon
									name="heroicons:x-mark"
									class="h-3 w-3"
								/>
							</button>
						</span>
					</div>
				</div>

				<!-- Submit Button -->
				<div class="pt-4">
					<button
						type="submit"
						:disabled="isSubmitting"
						class="btn btn-primary w-full"
					>
						<span v-if="isSubmitting">Submitting...</span>
						<span v-else>Send a Submit Request</span>
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script lang="ts" setup>
	useHead({
		title: "Submit a Tool - DevShelf",
		meta: [
			{
				name: "description",
				content: "Submit a great developer tool to share with the community.",
			},
		],
	});

	const apiBase = "http://localhost:5050/api/v1";
	const { data: catData } = await useFetch(`${apiBase}/categories`);
	const categories = computed(() =>
		(catData.value?.data ?? []).map((c: any) => ({
			slug: c.slug,
			name: c.name,
			icon: c.icon,
		}))
	);

	const form = ref({
		name: "",
		description: "",
		url: "",
		category: "",
		price: "",
		icon: "",
		tags: [],
	});

	const tagInput = ref("");
	const newTagInput = ref("");
	const showNewTagInput = ref(false);
	const tagsExpanded = ref(false);
	const categoryExpanded = ref(false);
	const categoryButton = ref(null);
	const tagsButton = ref(null);
	const isSubmitting = ref(false);

	const categoryDropdownStyle = ref({});
	const tagsDropdownStyle = ref({});

	const duplicateWarning = ref(false);

	const checkForDuplicate = async () => {
		if (!form.value.name && !form.value.url) return;
		const r: any = await $fetch(`${apiBase}/tools/exists`, {
			params: {
				name: form.value.name || undefined,
				url: form.value.url || undefined,
			},
		});
		duplicateWarning.value = r?.exists === true;
	};

	const submitTool = async () => {
		if (duplicateWarning.value) {
			const ok = window.confirm(
				"This tool might already exist. Submit anyway?"
			);
			if (!ok) return;
		}
		isSubmitting.value = true;
		try {
			await $fetch(`${apiBase}/submissions`, {
				method: "POST",
				body: {
					name: form.value.name,
					description: form.value.description,
					url: form.value.url,
					category: form.value.category,
					tags: form.value.tags,
					keywords: form.value.tags, // (optional) or keep separate
				},
			});
			navigateTo("/tools?submitted=true");
		} catch (e) {
			console.error(e);
			alert("Submission failed.");
		} finally {
			isSubmitting.value = false;
		}
	};

	// Mock existing tools for duplicate detection
	const existingTools = ref([
		{ name: "VS Code", url: "https://code.visualstudio.com" },
		{ name: "Figma", url: "https://figma.com" },
		{ name: "Notion", url: "https://notion.so" },
	]);

	// Existing tags (from tools page)
	const existingTags = ref([
		"code",
		"editor",
		"microsoft",
		"programming",
		"development",
		"design",
		"ui",
		"ux",
		"prototype",
		"collaboration",
		"notes",
		"productivity",
		"workspace",
		"organization",
		"free",
		"extensions",
		"database",
	]);

	const addTag = () => {
		// Keep this for backward compatibility but it's now replaced by the dropdown
		if (tagInput.value.trim()) {
			const tags = tagInput.value
				.split(",")
				.map((tag) => tag.trim())
				.filter((tag) => tag);
			form.value.tags.push(...tags);
			tagInput.value = "";
		}
	};

	const removeTag = (index) => {
		form.value.tags.splice(index, 1);
	};

	const updateDropdownPositions = () => {
		if (categoryButton.value && categoryExpanded.value) {
			const rect = categoryButton.value.getBoundingClientRect();
			categoryDropdownStyle.value = {
				top: `${rect.bottom + 8}px`,
				left: `${rect.left}px`,
				width: `${rect.width}px`,
			};
		}

		if (tagsButton.value && tagsExpanded.value) {
			const rect = tagsButton.value.getBoundingClientRect();
			tagsDropdownStyle.value = {
				top: `${rect.bottom + 8}px`,
				left: `${rect.left}px`,
				right: `${window.innerWidth - rect.right}px`,
			};
		}
	};

	watch([categoryExpanded, tagsExpanded], () => {
		nextTick(() => {
			updateDropdownPositions();
		});
	});

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
				tagsExpanded.value &&
				!tagsButton.value?.contains(event.target) &&
				!event.target.closest(".fixed")
			) {
				tagsExpanded.value = false;
			}
		};
		document.addEventListener("click", handleClickOutside);

		onUnmounted(() => {
			window.removeEventListener("resize", updateDropdownPositions);
			window.removeEventListener("scroll", updateDropdownPositions);
			document.removeEventListener("click", handleClickOutside);
		});
	});

	const selectCategory = (category) => {
		form.value.category = category;
		categoryExpanded.value = false;
	};

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

	const toggleTag = (tag) => {
		const index = form.value.tags.indexOf(tag);
		if (index > -1) {
			form.value.tags.splice(index, 1);
		} else {
			form.value.tags.push(tag);
		}
	};

	const clearSelectedTags = () => {
		form.value.tags = [];
	};

	const addNewTag = () => {
		if (
			newTagInput.value.trim() &&
			!form.value.tags.includes(newTagInput.value.trim()) &&
			!existingTags.value.includes(newTagInput.value.trim())
		) {
			form.value.tags.push(newTagInput.value.trim());
			// Add to existing tags for future use
			existingTags.value.push(newTagInput.value.trim());
			existingTags.value.sort();
			newTagInput.value = "";
			showNewTagInput.value = false;
		} else if (
			newTagInput.value.trim() &&
			existingTags.value.includes(newTagInput.value.trim()) &&
			!form.value.tags.includes(newTagInput.value.trim())
		) {
			// If tag exists but not selected, just select it
			form.value.tags.push(newTagInput.value.trim());
			newTagInput.value = "";
			showNewTagInput.value = false;
		}
	};

	const cancelNewTag = () => {
		if (!newTagInput.value.trim()) {
			showNewTagInput.value = false;
		}
	};
</script>
