<template>
	<section class="section">
		<div class="container">
			<div class="text-center mb-12">
				<h2 class="text-h2 mb-4">Browse by Category</h2>
				<p class="text-muted">
					Tools organized into clear categories for easy discovery
				</p>
			</div>

			<div
				class="flex flex-col items-center md:items-start md:flex-row justify-center w-full gap-6"
			>
				<CategoryCard
					v-for="category in categories.slice(0, 4)"
					:key="category.slug"
					:category="category"
				/>
			</div>

			<div class="text-center mt-10">
				<NuxtLink
					to="/categories"
					class="btn btn-secondary"
				>
					View All Categories
				</NuxtLink>
			</div>
		</div>
	</section>
</template>

<script setup>
	const config = useRuntimeConfig();
	const apiBase = config.public.apiBase;

	// Use cached fetch for categories
	const { cachedFetch } = useApiCache();

	const { data } = await useAsyncData(
		"categories-section",
		() => cachedFetch(`${apiBase}/categories`),
		{
			server: true,
			transform: (data) => data?.data ?? [],
		}
	);

	const categories = computed(() => data.value ?? []);
</script>
