import { computed } from "vue";
import { useFetch } from "#app";
import { useApiEndpoints } from "~/composables/useApiEndpoints";

export function useCategories() {
        const { buildUrl } = useApiEndpoints();

        const { data, pending, error, refresh } = useFetch(buildUrl("/categories"), {
                key: "categories",
        });

        const categories = computed(() => data.value?.data ?? []);

        const findBySlug = (slug?: string | null) => {
                if (!slug) {
                        return undefined;
                }
                return categories.value.find((category: any) => category.slug === slug);
        };

        const getCategoryLabel = (slug?: string | null) => {
                return findBySlug(slug)?.name ?? slug ?? "";
        };

        const getCategoryIcon = (slug?: string | null) => {
                return findBySlug(slug)?.icon ?? "heroicons:squares-2x2";
        };

        return {
                categories,
                pending,
                error,
                refresh,
                getCategoryLabel,
                getCategoryIcon,
        };
}
