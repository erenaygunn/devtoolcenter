<template>
	<section class="section-lg">
		<div class="container text-center">
			<div class="mb-8">
				<h1 class="text-5xl md:text-7xl font-bold mb-6">
					<span class="gradient-text">DevShelf</span>
				</h1>
				<p class="text-body-lg max-w-3xl mx-auto mb-8">
					Discover the best
					<span class="neon-green">free productivity tools</span> for
					developers. Community-driven, open-source, and always growing.
				</p>
			</div>

			<!-- Search Box with CTA -->
			<div class="max-w-lg mx-auto mb-8">
				<div class="relative flex items-center">
					<div class="relative flex-1">
						<Icon
							name="heroicons:magnifying-glass"
							class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted"
						/>
						<input
							v-model="searchQuery"
							type="text"
							placeholder="Search for tools..."
							class="w-full pl-10 pr-4 py-3 border border-border rounded-l-lg bg-background text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
							@keyup.enter="handleSearch"
						/>
					</div>
					<NuxtLink
						to="/submit"
						class="btn btn-primary px-6 py-3 rounded-l-none rounded-r-lg border-l-0 whitespace-nowrap"
					>
						<Icon
							name="heroicons:plus"
							class="h-5 w-5 mr-2"
						/>
						Submit Tool
					</NuxtLink>
				</div>
			</div>

			<div
				class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
			>
				<NuxtLink
					to="/tools"
					class="btn btn-secondary btn-lg"
				>
					<Icon
						name="heroicons:squares-2x2"
						class="h-5 w-5 mr-2"
					/>
					Browse All Tools
				</NuxtLink>
			</div>

			<!-- Stats -->
			<div class="grid grid-cols-3 gap-8 max-w-md mx-auto">
				<div class="text-center">
					<div class="text-h2 neon-green">150+</div>
					<div class="text-small">Tools</div>
				</div>
				<div class="text-center">
					<div class="text-h2 neon-green">12</div>
					<div class="text-small">Categories</div>
				</div>
				<div class="text-center">
					<div class="text-h2 neon-green">5K+</div>
					<div class="text-small">Users</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
	const searchQuery = ref("");

	const handleSearch = () => {
		if (searchQuery.value.trim()) {
			navigateTo(`/tools?search=${encodeURIComponent(searchQuery.value)}`);
		}
	};
</script>
