<template>
	<div class="card overflow-hidden">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr class="border-b border-gray-200 dark:border-gray-700">
						<th class="px-4 md:px-6 py-4 text-left text-sm font-semibold">
							Tool
						</th>
						<th
							class="px-4 md:px-6 py-4 text-left text-sm font-semibold hidden md:table-cell"
						>
							Category
						</th>
						<th
							class="px-4 md:px-6 py-4 text-left text-sm font-semibold hidden sm:table-cell"
						>
							Price
						</th>
						<th
							class="px-4 md:px-6 py-4 text-left text-sm font-semibold hidden lg:table-cell"
						>
							URL
						</th>
						<th
							class="px-4 md:px-6 py-4 text-left text-sm font-semibold hidden xl:table-cell"
						>
							Description
						</th>
						<th class="px-4 md:px-6 py-4 text-left text-sm font-semibold">
							Date
						</th>
						<th class="px-4 md:px-6 py-4 text-left text-sm font-semibold">
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="item in items"
						:key="item._id"
						class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
					>
						<td class="px-4 md:px-6 py-4">
							<div class="font-medium">{{ item.name }}</div>
						</td>
						<td class="px-4 md:px-6 py-4 hidden md:table-cell">
							<span
								class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
							>
								{{ item.category }}
							</span>
						</td>
						<td class="px-4 md:px-6 py-4 hidden sm:table-cell">
							<div
								class="flex items-center gap-2"
								v-if="item.price"
							>
								<Icon
									:name="getPriceIcon(item.price)"
									class="h-4 w-4 text-primary"
								/>
								<span class="text-sm">{{ getPriceLabel(item.price) }}</span>
							</div>
							<span
								class="text-xs text-muted"
								v-else
								>Not specified</span
							>
						</td>
						<td class="px-4 md:px-6 py-4 hidden lg:table-cell">
							<a
								:href="item.url"
								target="_blank"
								rel="noopener noreferrer"
								class="text-primary hover:underline text-sm break-all"
							>
								{{
									item.url.length > 40
										? item.url.slice(0, 40) + "..."
										: item.url
								}}
							</a>
						</td>
						<td
							class="px-4 md:px-6 py-4 hidden xl:table-cell text-sm text-muted"
						>
							{{ item.description.slice(0, 60) }}...
						</td>
						<td class="px-6 py-4">
							<div class="text-muted text-sm">
								{{ new Date(item.createdAt).toLocaleDateString() }}
							</div>
						</td>
						<td class="px-4 md:px-6 py-4">
							<slot
								name="actions"
								:item="item"
							/>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script setup>
	defineProps({
		items: {
			type: Array,
			default: () => [],
		},
	});

	const getPriceIcon = (price) => {
		const icons = {
			free: "heroicons:gift",
			"free-plan": "heroicons:star",
			paid: "heroicons:currency-dollar",
		};
		return icons[price] || "heroicons:currency-dollar";
	};

	const getPriceLabel = (price) => {
		const labels = {
			free: "Free",
			"free-plan": "Free Plan Available",
			paid: "Paid",
		};
		return labels[price] || price;
	};
</script>
