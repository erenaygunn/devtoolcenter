<template>
	<div class="card card-hover group">
		<div class="flex items-start space-x-4">
			<div class="flex-shrink-0">
				<div
					class="w-12 h-12 glass rounded-lg flex items-center justify-center"
				>
					<Icon
						v-if="tool.icon"
						:name="tool.icon"
						class="h-6 w-6 text-primary"
					/>
					<div
						v-else
						class="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded"
					></div>
				</div>
			</div>

			<div class="flex-1 min-w-0">
				<h3 class="text-h5 mb-2 group-hover:text-primary transition-colors">
					{{ tool.name }}
				</h3>
				<p class="text-body-sm text-muted mb-3 line-clamp-2">
					{{ tool.description }}
				</p>

				<div class="flex flex-wrap gap-2 mb-4">
					<span
						v-for="tag in tool.tags"
						:key="tag"
						class="px-2 py-1 text-small glass rounded-full text-primary border border-green-400/30"
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
							<span class="text-body-sm text-muted ml-1">{{
								tool.rating
							}}</span>
						</div>
						<span class="text-subtle">•</span>
						<span class="text-body-sm text-muted">{{ tool.category }}</span>
					</div>

					<a
						:href="tool.url"
						target="_blank"
						class="btn btn-secondary btn-sm"
					>
						Visit
						<Icon
							name="heroicons:arrow-top-right-on-square"
							class="h-3 w-3 ml-1"
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
