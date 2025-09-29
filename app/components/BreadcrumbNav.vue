<template>
	<nav class="flex items-center gap-2 text-sm text-muted mb-4">
		<template
			v-for="(item, index) in items"
			:key="index"
		>
			<NuxtLink
				v-if="item.to && index < items.length - 1"
				:to="item.to"
				class="hover:text-primary transition-colors"
			>
				{{ item.label }}
			</NuxtLink>
			<span
				v-else-if="index === items.length - 1"
				class="text-primary"
			>
				{{ item.label }}
			</span>
			<span v-else>{{ item.label }}</span>

			<Icon
				v-if="index < items.length - 1"
				name="heroicons:chevron-right"
				class="h-4 w-4"
			/>
		</template>
	</nav>
</template>

<script setup>
	defineProps({
		items: {
			type: Array,
			required: true,
			default: () => [],
		},
	});
</script>
