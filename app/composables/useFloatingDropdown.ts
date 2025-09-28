import { nextTick, onBeforeUnmount, ref, watch } from "vue";

type MaybeElement = HTMLElement | null;

type DropdownStyle = Record<string, string>;

export function useFloatingDropdown() {
        const isOpen = ref(false);
        const triggerRef = ref<MaybeElement>(null);
        const contentRef = ref<MaybeElement>(null);
        const style = ref<DropdownStyle>({});

        const updatePosition = () => {
                const trigger = triggerRef.value;
                if (!trigger) {
                        return;
                }

                const rect = trigger.getBoundingClientRect();
                style.value = {
                        top: `${rect.bottom + 8}px`,
                        left: `${rect.left}px`,
                        width: `${rect.width}px`,
                        minWidth: `${rect.width}px`,
                };
        };

        const close = () => {
                isOpen.value = false;
        };

        const open = async () => {
                isOpen.value = true;
                await nextTick();
                updatePosition();
        };

        const toggle = () => {
                if (isOpen.value) {
                        close();
                } else {
                        open();
                }
        };

        const onClickOutside = (event: MouseEvent) => {
                const target = event.target as Node | null;
                if (!target) {
                        return;
                }

                if (triggerRef.value?.contains(target)) {
                        return;
                }

                if (contentRef.value?.contains(target)) {
                        return;
                }

                close();
        };

        const cleanup = () => {
                document.removeEventListener("click", onClickOutside);
                window.removeEventListener("resize", updatePosition);
                window.removeEventListener("scroll", updatePosition, true);
        };

        watch(
                isOpen,
                (value) => {
                        if (value) {
                                document.addEventListener("click", onClickOutside);
                                window.addEventListener("resize", updatePosition);
                                window.addEventListener("scroll", updatePosition, true);
                                nextTick(updatePosition);
                        } else {
                                cleanup();
                        }
                },
                { flush: "post" }
        );

        onBeforeUnmount(cleanup);

        return {
                isOpen,
                triggerRef,
                contentRef,
                style,
                updatePosition,
                toggle,
                open,
                close,
        };
}
