<template>
	<div class="pt-16">
		<HeroSection />
		<FeaturedTools />
		<CategoriesSection />
	</div>
</template>

<script setup>
	useHead({
		title: "DevShelf - Discover the Best Free Developer Tools",
		meta: [
			{
				name: "description",
				content:
					"Open-source, community-driven platform for discovering the best free productivity tools for developers.",
			},
		],
	});
</script>
