/**
 * Debounced Filters Composable
 *
 * Provides intelligent batching and debouncing for filter changes.
 * Prevents excessive API calls by batching multiple filter changes
 * and only executing search after user stops changing filters.
 */
export interface FilterState {
	searchQuery: string;
	selectedCategory: string;
	selectedPrice: string;
	selectedKeywords: string[];
	sortBy: string;
	[key: string]: any;
}

export interface FilterConfig {
	debounceMs?: number; // Debounce delay in milliseconds
	batchTimeout?: number; // Maximum time to wait for batched changes
	onFilterChange?: (filters: FilterState) => void; // Callback when filters change
	initialFilters?: Partial<FilterState>; // Initial filter values
}

export const useDebouncedFilters = (config: FilterConfig = {}) => {
	const {
		debounceMs = 500, // Wait 500ms after last change
		batchTimeout = 1500, // Maximum 1.5s wait for batching
		onFilterChange,
		initialFilters = {},
	} = config;

	// Filter state
	const filters = ref<FilterState>({
		searchQuery: "",
		selectedCategory: "",
		selectedPrice: "",
		selectedKeywords: [],
		sortBy: "name",
		...initialFilters,
	});

	// Debouncing state
	const debounceTimer = ref<NodeJS.Timeout | null>(null);
	const batchTimer = ref<NodeJS.Timeout | null>(null);
	const pendingChanges = ref<boolean>(false);
	const isSearching = ref<boolean>(false);
	const lastFilters = ref<FilterState>({ ...filters.value });

	/**
	 * Check if filters have actually changed
	 */
	const hasFiltersChanged = (
		current: FilterState,
		previous: FilterState
	): boolean => {
		// Compare primitive values
		if (
			current.searchQuery !== previous.searchQuery ||
			current.selectedCategory !== previous.selectedCategory ||
			current.selectedPrice !== previous.selectedPrice ||
			current.sortBy !== previous.sortBy
		) {
			return true;
		}

		// Compare arrays (keywords)
		if (current.selectedKeywords.length !== previous.selectedKeywords.length) {
			return true;
		}

		return !current.selectedKeywords.every(
			(keyword, index) => keyword === previous.selectedKeywords[index]
		);
	};

	/**
	 * Execute the filter change callback
	 */
	const executeFilterChange = () => {
		if (!hasFiltersChanged(filters.value, lastFilters.value)) {
			return; // No actual changes, skip
		}

		isSearching.value = true;
		lastFilters.value = { ...filters.value };

		if (onFilterChange) {
			onFilterChange({ ...filters.value });
		}

		// Reset searching state after a short delay to show loading state
		setTimeout(() => {
			isSearching.value = false;
		}, 100);
	};

	/**
	 * Clear all timers
	 */
	const clearTimers = () => {
		if (debounceTimer.value) {
			clearTimeout(debounceTimer.value);
			debounceTimer.value = null;
		}
		if (batchTimer.value) {
			clearTimeout(batchTimer.value);
			batchTimer.value = null;
		}
	};

	/**
	 * Schedule filter change execution with debouncing and batching
	 */
	const scheduleFilterChange = () => {
		pendingChanges.value = true;

		// Clear existing debounce timer
		if (debounceTimer.value) {
			clearTimeout(debounceTimer.value);
		}

		// Set up new debounce timer
		debounceTimer.value = setTimeout(() => {
			executeFilterChange();
			pendingChanges.value = false;
			clearTimers();
		}, debounceMs);

		// Set up batch timeout if not already set
		if (!batchTimer.value) {
			batchTimer.value = setTimeout(() => {
				executeFilterChange();
				pendingChanges.value = false;
				clearTimers();
			}, batchTimeout);
		}
	};

	/**
	 * Update search query with debouncing
	 */
	const setSearchQuery = (query: string) => {
		filters.value.searchQuery = query;
		scheduleFilterChange();
	};

	/**
	 * Update category filter
	 */
	const setCategory = (category: string) => {
		filters.value.selectedCategory = category;
		scheduleFilterChange();
	};

	/**
	 * Update price filter
	 */
	const setPrice = (price: string) => {
		filters.value.selectedPrice = price;
		scheduleFilterChange();
	};

	/**
	 * Update sort option
	 */
	const setSortBy = (sort: string) => {
		filters.value.sortBy = sort;
		scheduleFilterChange();
	};

	/**
	 * Add keyword to filter
	 */
	const addKeyword = (keyword: string) => {
		if (!filters.value.selectedKeywords.includes(keyword)) {
			filters.value.selectedKeywords = [
				...filters.value.selectedKeywords,
				keyword,
			];
			scheduleFilterChange();
		}
	};

	/**
	 * Remove keyword from filter
	 */
	const removeKeyword = (keyword: string) => {
		filters.value.selectedKeywords = filters.value.selectedKeywords.filter(
			(k) => k !== keyword
		);
		scheduleFilterChange();
	};

	/**
	 * Toggle keyword in filter
	 */
	const toggleKeyword = (keyword: string) => {
		if (filters.value.selectedKeywords.includes(keyword)) {
			removeKeyword(keyword);
		} else {
			addKeyword(keyword);
		}
	};

	/**
	 * Clear all keywords
	 */
	const clearKeywords = () => {
		filters.value.selectedKeywords = [];
		scheduleFilterChange();
	};

	/**
	 * Clear all filters
	 */
	const clearAllFilters = () => {
		filters.value = {
			searchQuery: "",
			selectedCategory: "",
			selectedPrice: "",
			selectedKeywords: [],
			sortBy: "name",
		};
		scheduleFilterChange();
	};

	/**
	 * Apply filters immediately (bypass debouncing)
	 */
	const applyFiltersNow = () => {
		clearTimers();
		executeFilterChange();
		pendingChanges.value = false;
	};

	/**
	 * Set multiple filters at once (useful for URL params)
	 */
	const setFilters = (newFilters: Partial<FilterState>) => {
		Object.assign(filters.value, newFilters);
		scheduleFilterChange();
	};

	/**
	 * Get computed filter state for display
	 */
	const hasActiveFilters = computed(() => {
		return !!(
			filters.value.searchQuery ||
			filters.value.selectedCategory ||
			filters.value.selectedPrice ||
			filters.value.selectedKeywords.length > 0
		);
	});

	/**
	 * Get active filters count
	 */
	const activeFiltersCount = computed(() => {
		let count = 0;
		if (filters.value.searchQuery) count++;
		if (filters.value.selectedCategory) count++;
		if (filters.value.selectedPrice) count++;
		if (filters.value.selectedKeywords.length > 0) count++;
		return count;
	});

	/**
	 * Build URL query parameters from filters
	 */
	const getQueryParams = () => {
		const params: Record<string, any> = {};

		if (filters.value.searchQuery) params.search = filters.value.searchQuery;
		if (filters.value.selectedCategory)
			params.category = filters.value.selectedCategory;
		if (filters.value.selectedPrice) params.price = filters.value.selectedPrice;
		if (filters.value.selectedKeywords.length > 0)
			params.keywords = filters.value.selectedKeywords;
		if (filters.value.sortBy !== "name") params.sort = filters.value.sortBy;

		return params;
	};

	/**
	 * Initialize filters from URL query parameters
	 */
	const initFromQuery = (query: Record<string, any>) => {
		const newFilters: Partial<FilterState> = {};

		if (query.search) newFilters.searchQuery = query.search as string;
		if (query.category) newFilters.selectedCategory = query.category as string;
		if (query.price) newFilters.selectedPrice = query.price as string;
		if (query.sort) newFilters.sortBy = query.sort as string;

		if (query.keywords) {
			newFilters.selectedKeywords = Array.isArray(query.keywords)
				? (query.keywords as string[])
				: [query.keywords as string];
		}

		// Set filters without triggering change (initial load)
		Object.assign(filters.value, newFilters);
		lastFilters.value = { ...filters.value };
	};

	// Cleanup on unmount
	onUnmounted(() => {
		clearTimers();
	});

	return {
		// State
		filters: readonly(filters),
		isSearching: readonly(isSearching),
		pendingChanges: readonly(pendingChanges),
		hasActiveFilters,
		activeFiltersCount,

		// Actions
		setSearchQuery,
		setCategory,
		setPrice,
		setSortBy,
		addKeyword,
		removeKeyword,
		toggleKeyword,
		clearKeywords,
		clearAllFilters,
		setFilters,
		applyFiltersNow,

		// Utilities
		getQueryParams,
		initFromQuery,
	};
};
