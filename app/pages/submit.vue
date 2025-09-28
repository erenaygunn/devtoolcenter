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
							<li>
								• <strong>Developer tools</strong> that improve productivity
							</li>
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
                                        <div class="relative">
                                                <button
                                                        @click="toggleCategoryDropdown()"
                                                        type="button"
                                                        class="flex items-center justify-between w-full p-3 form-select transition-colors"
                                                        :class="{
                                                                'border-red-300 dark:border-red-600': errors.category,
                                                        }"
                                                        ref="categoryTriggerRef"
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
                                                                        isCategoryOpen
                                                                                ? 'heroicons:chevron-up'
                                                                                : 'heroicons:chevron-down'
                                                                "
                                                                class="h-4 w-4"
							/>
						</button>
					</div>

					<!-- Category validation error -->
					<div
						v-if="errors.category"
						class="mt-2 p-3 bg-red-400/10 border border-red-400/30 rounded-lg"
					>
						<p class="text-red-600 text-sm">
							{{ errors.category }}
						</p>
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
                                        <div class="relative">
                                                <button
                                                        @click="togglePriceDropdown()"
                                                        type="button"
                                                        class="flex items-center justify-between w-full p-3 form-select transition-colors"
                                                        :class="{
                                                                'border-red-300 dark:border-red-600': errors.price,
                                                        }"
                                                        ref="priceTriggerRef"
                                                >
                                                        <span class="flex items-center gap-2 text-sm font-medium">
                                                                <Icon
                                                                        v-if="form.price"
                                                                        :name="getPricingIcon(form.price)"
                                                                        class="h-4 w-4"
                                                                />
                                                                <Icon
                                                                        v-else
                                                                        name="heroicons:currency-dollar"
                                                                        class="h-4 w-4 text-muted"
                                                                />
                                                                {{
                                                                        form.price
                                                                                ? getPricingLabel(form.price)
                                                                                : "Select pricing model"
                                                                }}
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

					<!-- Price validation error -->
					<div
						v-if="errors.price"
						class="mt-2 p-3 bg-red-400/10 border border-red-400/30 rounded-lg"
					>
						<p class="text-red-600 text-sm">
							{{ errors.price }}
						</p>
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
                                                                        v-for="priceOption in pricingModels"
                                                                        :key="priceOption.value"
                                                                        @click="selectPrice(priceOption.value)"
                                                                        type="button"
                                                                        class="flex items-center gap-3 w-full p-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                                                                        :class="{
                                                                                'bg-primary/10 text-primary':
                                                                                        form.price === priceOption.value,
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

				<!-- Tags -->
				<div>
					<label class="block text-sm font-medium mb-2">Tags *</label>
                                        <div class="relative">
                                                <button
                                                        @click="toggleTagsDropdown()"
                                                        type="button"
                                                        class="flex items-center justify-between w-full p-3 form-select transition-colors"
                                                        ref="tagsTriggerRef"
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
                                                                        isTagsOpen
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
                                                        v-if="isTagsOpen"
                                                        class="fixed glass rounded-lg shadow-xl z-[9999]"
                                                        :style="tagsDropdownStyle"
                                                        ref="tagsContentRef"
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
						class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
					>
						<Icon
							name="heroicons:check-circle"
							class="h-8 w-8 text-green-600"
						/>
					</div>
					<h2 class="text-h3 mb-2">Submission Received!</h2>
					<p class="text-muted">
						Thank you for your contribution to the DevShelf community.
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
        import { computed, nextTick, reactive, ref, watch } from "vue";
        import {
                getPricingIcon,
                getPricingLabel,
                pricingModels,
        } from "~/utils/toolOptions";

        const { buildUrl } = useApiEndpoints();
        const { categories, getCategoryLabel, getCategoryIcon } = useCategories();

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
                tags: [] as string[],
                price: "",
        });

        const errors = reactive<Record<string, string>>({});

        const newTagInput = ref("");
        const showNewTagInput = ref(false);
        const isSubmitting = ref(false);
        const showSuccessModal = ref(false);
        const duplicateWarning = ref(false);

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
                isOpen: isTagsOpen,
                triggerRef: tagsTriggerRef,
                contentRef: tagsContentRef,
                style: tagsStyle,
                toggle: toggleTagsDropdown,
                close: closeTagsDropdown,
                updatePosition: updateTagsPosition,
        } = useFloatingDropdown();

        const tagsDropdownStyle = computed(() => ({
                ...tagsStyle.value,
                minWidth: `${Math.max(parseInt(tagsStyle.value?.width || "0"), 320)}px`,
        }));

        const validateForm = () => {
                Object.keys(errors).forEach((key) => {
                        errors[key] = "";
                });

                errors.name = form.value.name.length < 2 ? "Name must be at least 2 characters" : "";
                errors.description =
                        form.value.description.length < 10
                                ? "Description must be at least 10 characters"
                                : "";
                errors.url = !/^https?:\/\//.test(form.value.url)
                        ? "URL must start with http:// or https://"
                        : "";
                errors.category = !form.value.category ? "Please select a category" : "";
                errors.price = !form.value.price ? "Please select a pricing model" : "";
                errors.tags = form.value.tags.length === 0 ? "At least one tag required" : "";

                return !Object.values(errors).some(Boolean);
        };

        const checkForDuplicate = async () => {
                if (!form.value.name && !form.value.url) return;
                const response: any = await $fetch(buildUrl("/tools/exists"), {
                        params: {
                                name: form.value.name || undefined,
                                url: form.value.url || undefined,
                        },
                });
                duplicateWarning.value = response?.exists === true;
        };

        const submitTool = async () => {
                if (!validateForm()) {
                        if (errors.category || errors.price) {
                                const errorMessages = [] as string[];
                                if (errors.category) errorMessages.push("Category is required");
                                if (errors.price) errorMessages.push("Pricing model is required");
                                if (errorMessages.length > 0) {
                                        alert("Please fix the following errors:\n" + errorMessages.join("\n"));
                                }
                        }
                        return;
                }

                isSubmitting.value = true;
                try {
                        await $fetch(buildUrl("/submissions"), {
                                method: "POST",
                                body: form.value,
                        });
                        showSuccessModal.value = true;
                } catch (error) {
                        console.error(error);
                        alert("Submission failed. Please try again later.");
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
                form.value = {
                        name: "",
                        description: "",
                        url: "",
                        category: "",
                        tags: [],
                        price: "",
                };
                Object.keys(errors).forEach((key) => {
                        errors[key] = "";
                });
                duplicateWarning.value = false;
        };

        const removeTag = (index: number) => {
                form.value.tags.splice(index, 1);
        };

        const toggleTag = (tag: string) => {
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
                const trimmed = newTagInput.value.trim();
                if (!trimmed) {
                        return;
                }

                if (!existingTags.value.includes(trimmed)) {
                        existingTags.value.push(trimmed);
                        existingTags.value.sort();
                }

                if (!form.value.tags.includes(trimmed)) {
                        form.value.tags.push(trimmed);
                }

                newTagInput.value = "";
                showNewTagInput.value = false;
        };

        const cancelNewTag = () => {
                if (!newTagInput.value.trim()) {
                        showNewTagInput.value = false;
                }
        };

        const selectCategory = (category: string) => {
                form.value.category = category;
                errors.category = "";
                closeCategoryDropdown();
        };

        const selectPrice = (price: string) => {
                form.value.price = price;
                errors.price = "";
                closePriceDropdown();
        };

        watch(() => isCategoryOpen.value, (open) => {
                if (open) {
                        nextTick(updateCategoryPosition);
                }
        });

        watch(categories, () => {
                if (isCategoryOpen.value) {
                        nextTick(updateCategoryPosition);
                }
        });

        watch(() => isPriceOpen.value, (open) => {
                if (open) {
                        nextTick(updatePricePosition);
                }
        });

        watch(
                [() => isTagsOpen.value, () => form.value.tags.length, existingTags],
                ([open]) => {
                        if (open) {
                                nextTick(updateTagsPosition);
                        }
                }
        );
</script>

