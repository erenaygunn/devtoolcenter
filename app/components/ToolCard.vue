<template>
	<div class="card h-full card-hover group">
		<div class="flex items-start justify-start gap-y-6 flex-col h-full">
			<div class="flex items-center gap-x-4 justify-start">
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

				<div
					class="flex"
					v-if="tool.price"
				>
					<span
						class="px-2 py-1 capitalize glass rounded-lg text-primary border border-green-400/30"
						>{{ tool.price }}</span
					>
				</div>
			</div>

			<div class="h-full flex flex-col items-start justify-start min-w-0">
				<h3 class="text-h5 mb-2 group-hover:text-primary transition-colors">
					{{ tool.name }}
				</h3>
				<p class="text-body-sm text-muted mb-3 line-clamp-4">
					{{ tool.description }}
				</p>

				<div class="flex flex-wrap gap-2 mb-4">
					<span
						v-for="tag in tool.tags.slice(0, 3)"
						:key="tag"
						class="px-2 py-1 text-small glass rounded-full text-primary border border-green-400/30"
					>
						{{ tag }}
					</span>
				</div>

				<div class="flex items-start mt-auto flex-col justify-between">
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
						<span
							class="text-body-sm capitalize whitespace-nowrap text-muted"
							>{{ tool.category }}</span
						>
					</div>
				</div>

				<a
					:href="tool.url"
					target="_blank"
					class="btn btn-primary mt-3 btn-sm"
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
</template>

<script setup>
	defineProps({
		tool: {
			type: Object,
			required: true,
		},
	});
</script>
