import { computed } from "vue";
import { useRuntimeConfig } from "#imports";

export function useApiEndpoints() {
        const {
                public: { apiBase },
        } = useRuntimeConfig();

        const normalizedBase = computed(() => apiBase.replace(/\/$/, ""));

        const buildUrl = (path: string) => {
                const base = normalizedBase.value;
                const cleanPath = path.replace(/^\//, "");
                return `${base}/${cleanPath}`;
        };

        const apiRoot = computed(() => {
                try {
                        const baseUrl = new URL(normalizedBase.value);
                        baseUrl.pathname = baseUrl.pathname.replace(/\/?api\/(v\d+)?$/, "");
                        return baseUrl.origin + baseUrl.pathname.replace(/\/$/, "");
                } catch (error) {
                        return normalizedBase.value.replace(/\/api\/.*/, "");
                }
        });

        return {
                apiBase: normalizedBase,
                apiRoot,
                buildUrl,
        };
}
