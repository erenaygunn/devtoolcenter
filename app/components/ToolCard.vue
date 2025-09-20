<template>
	<div class="glass glass-hover rounded-xl p-6 group">
		<div class="flex items-start space-x-4">
			<div class="flex-shrink-0">
				<div
					class="w-12 h-12 glass rounded-lg flex items-center justify-center"
				>
					<Icon
						v-if="tool.icon"
						:name="tool.icon"
						class="h-6 w-6 text-green-400"
					/>
					<div
						v-else
						class="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded"
					></div>
				</div>
			</div>

			<div class="flex-1 min-w-0">
				<h3
					class="text-lg font-semibold text-white mb-2 group-hover:text-green-400 transition-colors"
				>
					{{ tool.name }}
				</h3>
				<p class="text-gray-400 text-sm mb-3 line-clamp-2">
					{{ tool.description }}
				</p>

				<div class="flex flex-wrap gap-2 mb-4">
					<span
						v-for="tag in tool.tags"
						:key="tag"
						class="px-2 py-1 text-xs glass rounded-full text-green-400 border border-green-400/30"
					>
						{{ tag }}
					</span>
				</div>

				<div class="flex items-center justify-between">
					<div class="flex items-center space-x-2">
						<div class="flex items-center">
							<Icon
								name="heroicons:star-solid"
								class="h-4 w-4 text-yellow-400"
							/>
							<span class="text-sm text-gray-400 ml-1">{{ tool.rating }}</span>
						</div>
						<span class="text-gray-500">•</span>
						<span class="text-sm text-gray-400">{{ tool.category }}</span>
					</div>

					<a
						:href="tool.url"
						target="_blank"
						class="glass glass-hover px-3 py-1 rounded-lg text-sm text-green-400 border border-green-400/30 hover:bg-green-400/10 transition-all"
					>
						Visit
						<Icon
							name="heroicons:arrow-top-right-on-square"
							class="h-3 w-3 inline ml-1"
						/>
					</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	defineProps({
		tool: {
			type: Object,
			required: true,
		},
	});
</script>
