<template>
	<div
		class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
	>
		<div
			v-if="image"
			class="aspect-w-16 aspect-h-9"
		>
			<NuxtImg
				:src="image"
				:alt="title"
				class="w-full h-48 object-cover"
			/>
		</div>
		<div class="p-6">
			<h3
				v-if="title"
				class="text-lg font-semibold text-gray-900 mb-2"
			>
				{{ title }}
			</h3>
			<p
				v-if="description"
				class="text-gray-600 mb-4"
			>
				{{ description }}
			</p>
			<slot />
		</div>
	</div>
</template>

<script setup>
	defineProps({
		title: String,
		description: String,
		image: String,
	});
</script>
