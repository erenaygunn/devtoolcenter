<template>
	<NuxtLink
		:to="`/tools?category=${category.slug}`"
		class="block group w-full max-w-[300px]"
	>
		<div
			class="card flex flex-col md:min-h-[300px] lg:min-h-[250px] card-hover text-center"
		>
			<div
				class="w-16 h-16 glass rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:neon-glow transition-all"
			>
				<Icon
					:name="category.icon"
					class="h-8 w-8 text-primary"
				/>
			</div>
			<h3 class="text-h5 mb-2 group-hover:text-primary transition-colors">
				{{ category.name }}
			</h3>
			<p class="text-body-sm text-muted mb-3">
				{{ category.description }}
			</p>
			<div
				class="flex mt-auto items-center justify-center space-x-2 text-small text-subtle"
			>
				<span>{{ category.toolCount }} tools</span>
				<Icon
					name="heroicons:arrow-right"
					class="h-3 w-3 group-hover:translate-x-1 duration-300 transition-transform"
				/>
			</div>
		</div>
	</NuxtLink>
</template>

<script setup>
	defineProps({
		category: {
			type: Object,
			required: true,
		},
	});
</script>
