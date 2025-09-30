<template>
	<div class="!pt-40 section">
		<div class="container">
			<!-- Header -->
			<div class="mb-8">
				<h1 class="text-h1 mb-4">
					Browse <span class="gradient-text">Categories</span>
				</h1>
				<p class="text-muted">
					Explore tools organized by category to find exactly what you need
				</p>
			</div>

			<!-- Categories Grid -->
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
				<NuxtLink
					v-for="category in categories"
					:key="category.slug"
					:to="`/tools?category=${category.slug}`"
					class="card card-hover group"
				>
					<div class="flex items-start gap-4">
						<div class="flex-shrink-0">
							<div class="icon-container mt-1">
								<Icon
									:name="category.icon"
									class="h-6 w-6 text-primary"
								/>
							</div>
						</div>
						<div class="flex-1 min-w-0">
							<h3
								class="text-h4 mb-2 group-hover:text-primary transition-colors"
							>
								{{ category.name }}
							</h3>
							<p class="text-muted text-small mb-3 line-clamp-2">
								{{ category.description }}
							</p>
							<div class="flex items-center justify-between">
								<span class="text-xs text-subtle">
									{{ category.toolCount }} tool{{
										category.toolCount !== 1 ? "s" : ""
									}}
								</span>
								<Icon
									name="heroicons:arrow-right"
									class="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
								/>
							</div>
						</div>
					</div>
				</NuxtLink>
			</div>

			<!-- All Tools Link -->
			<div class="text-center mt-10">
				<NuxtLink
					to="/tools"
					class="btn btn-primary inline-flex items-center gap-2"
				>
					<Icon
						name="heroicons:squares-2x2"
						class="h-4 w-4"
					/>
					Browse All Tools
				</NuxtLink>
			</div>
		</div>
	</div>
</template>

<script setup>
	const config = useRuntimeConfig();
	const apiBase = config.public.apiBase;
	const { data } = await useFetch(`${apiBase}/categories`);
	const categories = computed(() => data.value?.data ?? []);

	useHead({
		title: "Categories - DevTool Center",
		meta: [
			{
				name: "description",
				content:
					"Browse developer tools organized by category. Find frontend, backend, AI, design, DevOps, testing, and documentation tools.",
			},
		],
	});
</script>
