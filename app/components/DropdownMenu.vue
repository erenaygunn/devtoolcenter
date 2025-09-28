<template>
        <slot
                name="trigger"
                :is-open="modelValue"
                :toggle="toggleDropdown"
                :open="openDropdown"
                :close="closeDropdown"
                :set-trigger-ref="setTriggerRef"
                :trigger-attrs="triggerAttrs"
        />
        <Teleport to="body">
                <div
                        v-if="modelValue"
                        ref="dropdownRef"
                        class="fixed z-[9999]"
                        :class="contentClass"
                        :style="dropdownStyle"
                >
                        <slot
                                name="content"
                                :close="closeDropdown"
                                :is-open="modelValue"
                        />
                </div>
        </Teleport>
</template>

<script setup lang="ts">
        import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";

        const props = withDefaults(
                defineProps<{
                        modelValue: boolean;
                        matchWidth?: boolean;
                        align?: "left" | "right" | "stretch";
                        offset?: number;
                        contentClass?: string;
                }>(),
                {
                        matchWidth: true,
                        align: "left" as const,
                        offset: 8,
                        contentClass: "glass rounded-lg shadow-xl",
                }
        );

        const emit = defineEmits<{
                (event: "update:modelValue", value: boolean): void;
                (event: "open"): void;
                (event: "close"): void;
        }>();

        const triggerEl = ref<HTMLElement | null>(null);
        const dropdownRef = ref<HTMLElement | null>(null);
        const dropdownStyle = ref<Record<string, string>>({});

        const triggerAttrs = computed(() => ({
                "aria-expanded": props.modelValue,
                "aria-haspopup": "menu",
        }));

        const setTriggerRef = (el: HTMLElement | null) => {
                triggerEl.value = el;
        };

        const updatePosition = () => {
                if (!triggerEl.value || !props.modelValue) return;

                const rect = triggerEl.value.getBoundingClientRect();
                const style: Record<string, string> = {
                        top: `${rect.bottom + props.offset}px`,
                };

                if (props.align === "right") {
                        style.right = `${window.innerWidth - rect.right}px`;
                        if (props.matchWidth) {
                                style.width = `${rect.width}px`;
                        }
                } else if (props.align === "stretch") {
                        style.left = `${rect.left}px`;
                        style.right = `${window.innerWidth - rect.right}px`;
                } else {
                        style.left = `${rect.left}px`;
                        if (props.matchWidth) {
                                style.width = `${rect.width}px`;
                        }
                }

                dropdownStyle.value = style;
        };

        let listenersAttached = false;

        const detachListeners = () => {
                if (!listenersAttached) return;
                window.removeEventListener("resize", updatePosition);
                window.removeEventListener("scroll", updatePosition, true);
                document.removeEventListener("click", handleClickOutside, true);
                document.removeEventListener("keydown", handleKeydown, true);
                listenersAttached = false;
        };

        const handleClickOutside = (event: MouseEvent) => {
                const target = event.target as Node | null;
                if (
                        (triggerEl.value && target && triggerEl.value.contains(target)) ||
                        (dropdownRef.value && target && dropdownRef.value.contains(target))
                ) {
                        return;
                }
                closeDropdown();
        };

        const handleKeydown = (event: KeyboardEvent) => {
                if (event.key === "Escape") {
                        closeDropdown();
                }
        };

        const attachListeners = () => {
                if (listenersAttached) return;
                window.addEventListener("resize", updatePosition);
                window.addEventListener("scroll", updatePosition, true);
                document.addEventListener("click", handleClickOutside, true);
                document.addEventListener("keydown", handleKeydown, true);
                listenersAttached = true;
        };

        const openDropdown = () => {
                if (props.modelValue) return;
                emit("update:modelValue", true);
                emit("open");
        };

        const closeDropdown = () => {
                if (!props.modelValue) return;
                emit("update:modelValue", false);
                emit("close");
        };

        const toggleDropdown = () => {
                if (props.modelValue) {
                        closeDropdown();
                } else {
                        openDropdown();
                }
        };

        watch(
                () => props.modelValue,
                (value) => {
                        if (value) {
                                nextTick(() => {
                                        updatePosition();
                                        attachListeners();
                                });
                        } else {
                                detachListeners();
                        }
                }
        );

        watch(
                () => [props.align, props.matchWidth],
                () => {
                        if (props.modelValue) {
                                nextTick(updatePosition);
                        }
                }
        );

        onBeforeUnmount(() => {
                detachListeners();
        });
</script>
