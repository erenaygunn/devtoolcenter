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
						class="form-input w-full"
						placeholder="Brief description of what the tool does..."
					></textarea>
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
					<select
						v-model="form.category"
						required
						class="form-select w-full"
					>
						<option value="">Select a category</option>
						<option value="frontend">Frontend</option>
						<option value="backend">Backend</option>
						<option value="ai-helpers">AI Helpers</option>
						<option value="documentation">Documentation</option>
						<option value="design">Design</option>
						<option value="devops">DevOps</option>
						<option value="testing">Testing</option>
					</select>
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
					<label class="block text-sm font-medium mb-2">Tags</label>
					<input
						v-model="tagInput"
						type="text"
						class="form-input w-full"
						placeholder="Enter tags separated by commas"
						@keyup.enter="addTag"
					/>
					<div
						v-if="form.tags.length > 0"
						class="flex flex-wrap gap-2 mt-2"
					>
						<span
							v-for="(tag, index) in form.tags"
							:key="index"
							class="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-1"
						>
							{{ tag }}
							<button
								type="button"
								@click="removeTag(index)"
								class="hover:text-red-400"
							>
								<Icon
									name="heroicons:x-mark"
									class="h-3 w-3"
								/>
							</button>
						</span>
					</div>
				</div>

				<!-- Keywords -->
				<div>
					<label class="block text-sm font-medium mb-2"
						>Keywords (for search)</label
					>
					<input
						v-model="keywordInput"
						type="text"
						class="form-input w-full"
						placeholder="Enter keywords separated by commas"
						@keyup.enter="addKeyword"
					/>
					<div
						v-if="form.keywords.length > 0"
						class="flex flex-wrap gap-2 mt-2"
					>
						<span
							v-for="(keyword, index) in form.keywords"
							:key="index"
							class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-sm flex items-center gap-1"
						>
							{{ keyword }}
							<button
								type="button"
								@click="removeKeyword(index)"
								class="hover:text-red-400"
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
						<span v-else>Submit Tool</span>
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
	useHead({
		title: "Submit a Tool - DevShelf",
		meta: [
			{
				name: "description",
				content: "Submit a great developer tool to share with the community.",
			},
		],
	});

	const form = ref({
		name: "",
		description: "",
		url: "",
		category: "",
		price: "",
		icon: "",
		tags: [],
		keywords: [],
	});

	const tagInput = ref("");
	const keywordInput = ref("");
	const isSubmitting = ref(false);
	const duplicateWarning = ref(false);

	// Mock existing tools for duplicate detection
	const existingTools = ref([
		{ name: "VS Code", url: "https://code.visualstudio.com" },
		{ name: "Figma", url: "https://figma.com" },
		{ name: "Notion", url: "https://notion.so" },
	]);

	const checkForDuplicate = () => {
		const nameMatch = existingTools.value.some(
			(tool) => tool.name.toLowerCase() === form.value.name.toLowerCase()
		);
		const urlMatch = existingTools.value.some(
			(tool) => tool.url.toLowerCase() === form.value.url.toLowerCase()
		);

		duplicateWarning.value = nameMatch || urlMatch;
	};

	const addTag = () => {
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

	const addKeyword = () => {
		if (keywordInput.value.trim()) {
			const keywords = keywordInput.value
				.split(",")
				.map((keyword) => keyword.trim())
				.filter((keyword) => keyword);
			form.value.keywords.push(...keywords);
			keywordInput.value = "";
		}
	};

	const removeKeyword = (index) => {
		form.value.keywords.splice(index, 1);
	};

	const submitTool = async () => {
		if (duplicateWarning.value) {
			const confirm = window.confirm(
				"This tool might already exist. Do you want to continue submitting?"
			);
			if (!confirm) return;
		}

		isSubmitting.value = true;

		try {
			// Here you would make an API call to submit the tool
			console.log("Submitting tool:", form.value);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Redirect to success page or show success message
			navigateTo("/tools?submitted=true");
		} catch (error) {
			console.error("Error submitting tool:", error);
		} finally {
			isSubmitting.value = false;
		}
	};
</script>
