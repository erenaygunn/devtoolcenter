<template>
	<div
		class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
	>
		<div>
			<h1 class="text-h1 mb-2">
				<span class="gradient-text">{{ title }}</span>
			</h1>
			<p class="text-muted">{{ description }}</p>
		</div>

		<div class="flex flex-wrap items-center gap-3">
			<!-- Admin info -->
			<div class="hidden md:flex items-center gap-2 text-sm">
				<div
					class="flex items-center gap-2"
					v-if="showStatus"
				>
					<div class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
					<span class="text-muted">Authenticated</span>
				</div>
				<Icon
					name="heroicons:user-circle"
					class="h-5 w-5 text-muted"
				/>
				<span class="text-muted">{{ adminUser?.email || "Admin" }}</span>
				<span class="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full">
					{{ adminUser?.role || "admin" }}
				</span>
			</div>

			<slot name="actions" />
		</div>
	</div>
</template>

<script setup>
	defineProps({
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		adminUser: {
			type: Object,
			default: null,
		},
		showStatus: {
			type: Boolean,
			default: false,
		},
	});
</script>
