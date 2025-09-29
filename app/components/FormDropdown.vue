<template>
	<div>
		<label
			v-if="label"
			class="block text-sm font-medium mb-2"
		>
			{{ label }}
			<span
				v-if="required"
				class="text-red-400"
				>*</span
			>
		</label>
		<DropdownMenu
			v-model="expanded"
			content-class="glass rounded-lg shadow-xl"
		>
			<template #trigger="{ toggle, setTriggerRef, triggerAttrs }">
				<button
					type="button"
					class="flex items-center justify-between w-full p-3 form-select transition-colors"
					:ref="setTriggerRef"
					v-bind="triggerAttrs"
					@click="toggle"
				>
					<span :class="{ 'text-muted': !selectedItem }">
						{{ selectedItem ? selectedItem.label : placeholder }}
					</span>
					<Icon
						:name="expanded ? 'heroicons:chevron-up' : 'heroicons:chevron-down'"
						class="h-4 w-4"
					/>
				</button>
			</template>
			<template #content="{ close }">
				<div class="p-2">
					<button
						v-for="option in options"
						:key="option.value"
						@click="
							() => {
								selectOption(option);
								close();
							}
						"
						class="flex items-center gap-3 w-full p-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
						:class="{
							'bg-primary/10 text-primary': modelValue === option.value,
						}"
					>
						<Icon
							v-if="option.icon"
							:name="option.icon"
							class="h-4 w-4"
						/>
						<div class="text-left">
							<div class="font-medium">{{ option.label }}</div>
							<div
								v-if="option.description"
								class="text-xs text-muted"
							>
								{{ option.description }}
							</div>
						</div>
					</button>
				</div>
			</template>
		</DropdownMenu>
	</div>
</template>

<script setup>
	const props = defineProps({
		label: String,
		placeholder: String,
		modelValue: [String, Number],
		options: {
			type: Array,
			default: () => [],
		},
		required: Boolean,
	});

	const emit = defineEmits(["update:modelValue"]);

	const expanded = ref(false);

	const selectedItem = computed(() =>
		props.options.find((option) => option.value === props.modelValue)
	);

	const selectOption = (option) => {
		emit("update:modelValue", option.value);
	};
</script>
