<template>
	<div
		v-if="show"
		class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
		@click="handleBackdropClick"
	>
		<div
			:class="[
				'card max-w-2xl w-full max-h-[80vh] overflow-y-auto',
				modalClass,
			]"
			@click.stop
		>
			<div
				class="flex items-center justify-between mb-6"
				v-if="title"
			>
				<h2 class="text-h2">{{ title }}</h2>
				<button
					@click="$emit('close')"
					class="btn btn-tertiary btn-sm"
				>
					<Icon
						name="heroicons:x-mark"
						class="h-4 w-4"
					/>
				</button>
			</div>

			<slot />
		</div>
	</div>
</template>

<script setup>
	defineProps({
		show: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: "",
		},
		modalClass: {
			type: String,
			default: "",
		},
	});

	const emit = defineEmits(["close"]);

	const handleBackdropClick = (event) => {
		if (event.target === event.currentTarget) {
			emit("close");
		}
	};
</script>
