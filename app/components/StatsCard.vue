<template>
	<div class="card">
		<div class="flex items-center gap-3">
			<div
				:class="['p-2 rounded-lg', `bg-${color}-100 dark:bg-${color}-900/30`]"
			>
				<Icon
					:name="icon"
					:class="['h-5 w-5', `text-${color}-600`]"
				/>
			</div>
			<div>
				<p class="text-sm text-muted">{{ label }}</p>
				<p class="text-lg font-semibold">{{ value }}</p>
			</div>
		</div>
	</div>
</template>

<script setup>
	defineProps({
		icon: {
			type: String,
			required: true,
		},
		label: {
			type: String,
			required: true,
		},
		value: {
			type: [String, Number],
			required: true,
		},
		color: {
			type: String,
			default: "primary",
		},
	});
</script>
