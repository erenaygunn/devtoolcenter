<template>
	<div class="!pt-40 section">
		<div class="container max-w-2xl">
			<div class="mb-8">
				<h1 class="text-h1 mb-4">
					Submit a <span class="gradient-text">Tool</span>
				</h1>
				<p class="text-muted">
					Share a great tool with the developer community
				</p>
			</div>

			<!-- Submission Guidelines -->
			<div class="card mb-8">
				<h2 class="text-h4 mb-4 flex items-center gap-2">
					<Icon
						name="heroicons:information-circle"
						class="h-5 w-5 text-primary"
					/>
					Submission Guidelines
				</h2>

				<div class="space-y-4">
					<div>
						<h3 class="font-medium text-sm mb-2 text-primary">
							What we're looking for:
						</h3>
						<ul class="text-sm text-muted space-y-1 ml-4">
							<li>• <strong>Developer tools</strong></li>
							<li>
								• <strong>Well-maintained</strong> tools with active development
							</li>
							<li>
								• Tools with <strong>clear documentation</strong> and good UX
							</li>
							<li>• <strong>Free or freemium</strong> tools are preferred</li>
						</ul>
					</div>

					<div>
						<h3 class="font-medium text-sm mb-2 text-yellow-600">
							Please avoid:
						</h3>
						<ul class="text-sm text-muted space-y-1 ml-4">
							<li>• Broken or abandoned projects</li>
							<li>• Duplicate submissions (we'll check for you)</li>
							<li>• Non-developer tools or general software</li>
							<li>• Tools without proper documentation</li>
						</ul>
					</div>

					<div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
						<p class="text-sm text-blue-800 dark:text-blue-200">
							<Icon
								name="heroicons:light-bulb"
								class="h-4 w-4 inline mr-1"
							/>
							<strong>Tip:</strong> Include specific, relevant tags to help
							other developers discover your tool more easily.
						</p>
					</div>
				</div>
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
					<DropdownMenu
						v-model="categoryExpanded"
						content-class="glass rounded-lg shadow-xl"
					>
						<template #trigger="{ toggle, setTriggerRef, triggerAttrs }">
							<button
								type="button"
								class="flex items-center justify-between w-full p-3 form-select transition-colors"
								:class="{
									'border-red-300 dark:border-red-600': errors.category,
								}"
								:ref="setTriggerRef"
								v-bind="triggerAttrs"
								@click="toggle"
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
						</template>
						<template #content="{ close }">
							<div class="p-2">
								<button
									v-for="category in categories"
									:key="category.slug"
									type="button"
									class="flex items-center gap-3 w-full p-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
									:class="{
										'bg-primary/10 text-primary':
											form.category === category.slug,
									}"
									@click="
										() => {
											selectCategory(category.slug);
											close();
										}
									"
								>
									<Icon
										:name="category.icon"
										class="h-4 w-4"
									/>
									{{ category.name }}
								</button>
							</div>
						</template>
					</DropdownMenu>

					<!-- Category validation error -->
					<div
						v-if="errors.category"
						class="mt-2 p-3 bg-red-400/10 border border-red-400/30 rounded-lg"
					>
						<p class="text-red-600 text-sm">
							{{ errors.category }}
						</p>
					</div>
				</div>

				<!-- Price -->
				<div>
					<label class="block text-sm font-medium mb-2">Pricing *</label>
					<DropdownMenu
						v-model="priceExpanded"
						content-class="glass rounded-lg shadow-xl"
					>
						<template #trigger="{ toggle, setTriggerRef, triggerAttrs }">
							<button
								type="button"
								class="flex items-center justify-between w-full p-3 form-select transition-colors"
								:class="{
									'border-red-300 dark:border-red-600': errors.price,
								}"
								:ref="setTriggerRef"
								v-bind="triggerAttrs"
								@click="toggle"
							>
								<span class="flex items-center gap-2 text-sm font-medium">
									<Icon
										v-if="form.price"
										:name="getPriceIcon(form.price)"
										class="h-4 w-4"
									/>
									<Icon
										v-else
										name="heroicons:currency-dollar"
										class="h-4 w-4 text-muted"
									/>
									{{
										form.price
											? getPriceLabel(form.price)
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
						</template>
						<template #content="{ close }">
							<div class="p-2">
								<button
									v-for="priceOption in priceOptions"
									:key="priceOption.value"
									type="button"
									class="flex items-center gap-3 w-full p-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
									:class="{
										'bg-primary/10 text-primary':
											form.price === priceOption.value,
									}"
									@click="
										() => {
											selectPrice(priceOption.value);
											close();
										}
									"
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
						</template>
					</DropdownMenu>

					<!-- Price validation error -->
					<div
						v-if="errors.price"
						class="mt-2 p-3 bg-red-400/10 border border-red-400/30 rounded-lg"
					>
						<p class="text-red-600 text-sm">
							{{ errors.price }}
						</p>
					</div>
				</div>

				<!-- Tags -->
				<div>
					<label class="block text-sm font-medium mb-2">Tags *</label>
					<DropdownMenu
						v-model="tagsExpanded"
						content-class="glass rounded-lg shadow-xl"
						align="stretch"
						:match-width="false"
					>
						<template #trigger="{ toggle, setTriggerRef, triggerAttrs }">
							<button
								type="button"
								class="flex items-center justify-between w-full p-3 form-select transition-colors"
								:ref="setTriggerRef"
								v-bind="triggerAttrs"
								@click="toggle"
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
						</template>
						<template #content>
							<div class="p-4">
								<div class="flex flex-wrap gap-2">
									<button
										v-for="tag in existingTags"
										:key="tag"
										type="button"
										:class="[
											'px-2 py-1 text-xs rounded-full transition-colors',
											form.tags.includes(tag)
												? 'bg-primary text-white'
												: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
										]"
										@click="toggleTag(tag)"
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
						</template>
					</DropdownMenu>

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

	<!-- Success Modal -->
	<div
		v-if="showSuccessModal"
		class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
		@click="closeSuccessModal"
	>
		<div
			class="card max-w-md w-full"
			@click.stop
		>
			<div class="text-center">
				<div class="mb-6">
					<div
						class="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
					>
						<Icon
							name="heroicons:check-circle"
							class="h-8 w-8 text-cyan-500"
						/>
					</div>
					<h2 class="text-h3 mb-2">Submission Received!</h2>
					<p class="text-muted">
						Thank you for your contribution to the DevTool Center community.
					</p>
				</div>

				<div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 text-left">
					<h3 class="font-medium mb-2 text-sm">What happens next?</h3>
					<ul class="text-sm text-muted space-y-1">
						<li>• Your submission is now in our review queue</li>
						<li>• Our team will review it within 24 hours</li>
					</ul>
				</div>

				<div class="flex flex-col sm:flex-row gap-3">
					<button
						@click="submitAnother"
						class="btn btn-secondary flex-1"
					>
						<Icon
							name="heroicons:plus"
							class="h-4 w-4 mr-2"
						/>
						Submit Another
					</button>
					<button
						@click="closeSuccessModal"
						class="btn btn-primary flex-1"
					>
						<Icon
							name="heroicons:squares-2x2"
							class="h-4 w-4 mr-2"
						/>
						Browse Tools
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	useHead({
		title: "Submit a Tool - DevTool Center",
		meta: [
			{
				name: "description",
				content: "Submit a great developer tool to share with the community.",
			},
		],
	});

	const { $api } = useNuxtApp();
	const {
		sanitizeHtml,
		validateUrl,
		checkRateLimit,
		validateFormData,
		generateCSRFToken,
	} = useSecurity();
	const config = useRuntimeConfig();
	const apiBase = config.public.apiBase;
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
		tags: [] as string[],
		price: "",
	});

	const errors = reactive<{ [k: string]: string }>({});

	const tagInput = ref("");
	const newTagInput = ref("");
	const showNewTagInput = ref(false);
	const tagsExpanded = ref(false);
	const categoryExpanded = ref(false);
	const priceExpanded = ref(false);
	const isSubmitting = ref(false);
	const showSuccessModal = ref(false);
	const duplicateWarning = ref(false);

	// Security variables
	const lastSubmissionTime = ref(0);
	const csrfToken = ref(generateCSRFToken());

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

	const validateForm = () => {
		// Clear previous errors
		Object.keys(errors).forEach((key) => {
			errors[key] = "";
		});

		// Sanitize form data
		form.value.name = sanitizeHtml(form.value.name);
		form.value.description = sanitizeHtml(form.value.description);

		// Validate using security schema
		const schema = {
			name: {
				required: true,
				type: "string",
				minLength: 2,
				maxLength: 100,
			},
			description: {
				required: true,
				type: "string",
				minLength: 10,
				maxLength: 500,
			},
			url: {
				required: true,
				type: "string",
				validate: validateUrl,
			},
			category: {
				required: true,
				type: "string",
			},
			price: {
				required: true,
				type: "string",
			},
			tags: {
				required: true,
				minItems: 1,
				maxItems: 10,
			},
		};

		const validation = validateFormData(form.value, schema);

		// Map validation errors to our error object
		if (!validation.isValid) {
			Object.assign(errors, validation.errors);
		}

		return validation.isValid;
	};

	const checkForDuplicate = async () => {
		if (!form.value.name && !form.value.url) return;

		// Rate limit duplicate checks
		const rateCheck = checkRateLimit("duplicate-check", 10, 60 * 1000);
		if (!rateCheck.allowed) {
			return;
		}

		try {
			const r: any = await $api("/tools/exists", {
				params: {
					name: sanitizeHtml(form.value.name) || undefined,
					url: form.value.url?.trim() || undefined,
				},
			});
			duplicateWarning.value = r?.exists === true;
		} catch (error) {
			console.warn("Failed to check for duplicates:", error);
		}
	};

	const submitTool = async () => {
		// Check rate limiting - 3 submissions per hour
		const rateCheck = checkRateLimit("tool-submission", 3, 60 * 60 * 1000);
		if (!rateCheck.allowed) {
			alert(rateCheck.error);
			return;
		}

		// Prevent double submission
		if (isSubmitting.value) {
			return;
		}

		// Minimum time between submissions (30 seconds)
		const now = Date.now();
		if (now - lastSubmissionTime.value < 30000) {
			alert("Please wait 30 seconds between submissions.");
			return;
		}

		if (!validateForm()) {
			// Show validation errors
			const errorMessages = Object.values(errors).filter(Boolean);
			if (errorMessages.length > 0) {
				alert("Please fix the following errors:\n" + errorMessages.join("\n"));
			}
			return;
		}

		isSubmitting.value = true;
		lastSubmissionTime.value = now;

		try {
			const response = await $api("/submissions", {
				method: "POST",
				headers: {
					"X-CSRF-Token": csrfToken.value,
				},
				body: {
					name: form.value.name.trim(),
					description: form.value.description.trim(),
					url: form.value.url.trim(),
					category: form.value.category,
					tags: form.value.tags
						.map((tag) => sanitizeHtml(tag.trim()))
						.filter(Boolean),
					price: form.value.price,
					keywords: form.value.tags
						.map((tag) => sanitizeHtml(tag.trim()))
						.filter(Boolean),
					csrf_token: csrfToken.value,
				},
			});

			// Show success modal if we get here without throwing
			showSuccessModal.value = true;
		} catch (e: any) {
			console.error("Submission error:", e);

			// Check if it's actually a success but different status code
			if (e?.data?.message && e.data.message.includes("success")) {
				showSuccessModal.value = true;
				return;
			}

			if (e?.data?.error?.code === "VALIDATION_ERROR") {
				alert(
					e.data.error.issues
						.map((issue: any) => `${issue.path.join(".")}: ${issue.message}`)
						.join("\n")
				);
			} else if (e?.statusCode === 201 || e?.statusCode === 200) {
				// Sometimes 201/200 status codes are thrown as "errors"
				showSuccessModal.value = true;
			} else {
				const errorMessage =
					e?.data?.message || e?.message || "Unknown error occurred";
				alert(`Submission failed: ${errorMessage}. Please try again.`);
			}
		} finally {
			isSubmitting.value = false;
		}
	};

	const closeSuccessModal = () => {
		showSuccessModal.value = false;
		navigateTo("/tools");
	};

	const submitAnother = () => {
		showSuccessModal.value = false;
		// Reset form
		form.value = {
			name: "",
			description: "",
			url: "",
			category: "",
			tags: [],
			price: "",
		};
		// Clear any existing errors
		Object.keys(errors).forEach((key) => {
			errors[key] = "";
		});
		duplicateWarning.value = false;
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

	const removeTag = (index: number) => {
		form.value.tags.splice(index, 1);
	};

	const selectCategory = (category: string) => {
		form.value.category = category;
		errors.category = ""; // Clear error when category is selected
	};

	const selectPrice = (price: string) => {
		form.value.price = price;
		errors.price = ""; // Clear error when price is selected
	};

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
