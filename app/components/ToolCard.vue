<template>
	<div class="card h-full card-hover group">
		<div class="flex items-start justify-start gap-y-6 flex-col h-full">
			<div class="flex items-center gap-x-4 justify-start">
				<div
					class="w-12 h-12 glass rounded-lg flex items-center justify-center"
				>
					<img
						v-if="tool.logoUrl"
						:src="tool.logoUrl"
						alt="logo"
						class="w-8 h-8 rounded-md"
						@error="tool.logoUrl = ''"
					/>
					<Icon
						v-else
						:name="getCategoryIcon(tool.category)"
						class="w-8 h-8 text-primary"
					/>
				</div>

				<div
					class="flex"
					v-if="tool.price"
				>
					<span
						class="px-2 py-1 capitalize glass rounded-lg text-primary border border-cyan-300/30"
						>{{ tool.price }}</span
					>
				</div>

				<div class="flex">
					<span class="text-body-sm capitalize whitespace-nowrap text-muted">{{
						new Date(tool.createdAt).toLocaleDateString()
					}}</span>
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
						class="px-2 py-1 text-small glass rounded-full text-primary border border-cyan-300/30"
					>
						{{ tag }}
					</span>
				</div>

				<div class="flex items-start mt-auto flex-col justify-between">
					<div class="flex items-center space-x-2">
						<span
							class="text-body-sm capitalize whitespace-nowrap text-muted"
							>{{ tool.category }}</span
						>
					</div>
				</div>

				<a
					:href="tool.url"
					target="_blank"
					rel="noopener noreferrer"
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

	const getCategoryIcon = (category) => {
		const icons = {
			frontend: "heroicons:code-bracket",
			backend: "heroicons:server",
			"ai-helpers": "heroicons:cpu-chip",
			documentation: "heroicons:document-text",
			design: "heroicons:paint-brush",
			devops: "heroicons:cog-6-tooth",
			testing: "heroicons:beaker",
		};
		return icons[category] || "heroicons:squares-2x2";
	};
</script>
