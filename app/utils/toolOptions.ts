export const pricingFilters = [
        { value: "", label: "All Pricing", icon: "heroicons:currency-dollar" },
        { value: "free", label: "Free", icon: "heroicons:gift" },
        { value: "free-plan", label: "Free Plan Available", icon: "heroicons:sparkles" },
        { value: "paid", label: "Paid", icon: "heroicons:credit-card" },
] as const;

export const pricingModels = [
        {
                value: "free",
                label: "Free",
                description: "Completely free to use",
                icon: "heroicons:gift",
        },
        {
                value: "free-plan",
                label: "Free Plan Available",
                description: "Has free tier with paid upgrades",
                icon: "heroicons:star",
        },
        {
                value: "paid",
                label: "Paid",
                description: "Requires payment to use",
                icon: "heroicons:currency-dollar",
        },
] as const;

const pricingLabelMap = pricingFilters.reduce<Record<string, string>>((map, option) => {
        map[option.value] = option.label;
        return map;
}, {});

pricingModels.forEach((option) => {
        pricingLabelMap[option.value] = option.label;
});

const pricingIconMap = pricingFilters.reduce<Record<string, string>>((map, option) => {
        map[option.value] = option.icon;
        return map;
}, {});

pricingModels.forEach((option) => {
        pricingIconMap[option.value] = option.icon;
});

export const sortOptions = [
        { value: "name", label: "Sort by Name", icon: "heroicons:bars-3-bottom-left" },
        { value: "category", label: "Sort by Category", icon: "heroicons:squares-2x2" },
        { value: "price", label: "Sort by Price", icon: "heroicons:currency-dollar" },
        { value: "date", label: "Sort by Date Added", icon: "heroicons:calendar-days" },
] as const;

const sortLabelMap = sortOptions.reduce<Record<string, string>>((map, option) => {
        map[option.value] = option.label;
        return map;
}, {});

const sortIconMap = sortOptions.reduce<Record<string, string>>((map, option) => {
        map[option.value] = option.icon;
        return map;
}, {});

export function getPricingLabel(value: string | undefined | null) {
        if (value == null || value === "") {
                        return pricingLabelMap[""];
        }
        return pricingLabelMap[value] ?? pricingLabelMap[""];
}

export function getPricingIcon(value: string | undefined | null) {
        if (value == null || value === "") {
                return pricingIconMap[""] ?? "heroicons:currency-dollar";
        }
        return pricingIconMap[value] ?? "heroicons:currency-dollar";
}

export function getSortLabel(value: string | undefined | null) {
        if (!value) {
                return sortLabelMap.name;
        }
        return sortLabelMap[value] ?? sortLabelMap.name;
}

export function getSortIcon(value: string | undefined | null) {
        if (!value) {
                return sortIconMap.name;
        }
        return sortIconMap[value] ?? sortIconMap.name;
}
