<template>
	<NuxtLink
		:to="`/categories/${category.slug}`"
		class="block group"
	>
		<div class="glass glass-hover rounded-xl p-6 text-center">
			<div
				class="w-16 h-16 glass rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:neon-glow transition-all"
			>
				<Icon
					:name="category.icon"
					class="h-8 w-8 text-green-400"
				/>
			</div>
			<h3
				class="text-lg font-semibold text-white mb-2 group-hover:text-green-400 transition-colors"
			>
				{{ category.name }}
			</h3>
			<p class="text-gray-400 text-sm mb-3">
				{{ category.description }}
			</p>
			<div
				class="flex items-center justify-center space-x-2 text-xs text-gray-500"
			>
				<span>{{ category.toolCount }} tools</span>
				<Icon
					name="heroicons:arrow-right"
					class="h-3 w-3 group-hover:translate-x-1 transition-transform"
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
