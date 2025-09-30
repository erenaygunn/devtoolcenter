<template>
	<section
		class="section-lg min-[405px]:!pt-36 h-auto md:h-[70svh] flex flex-col items-center justify-center"
	>
		<div class="container text-center">
			<div class="mb-8">
				<h1 class="text-5xl md:text-7xl font-bold mb-6">
					<span class="gradient-text">Discover Your Next Favorite Tool</span>
				</h1>

				<p class="text-lg">
					DevTool Center is a platform that helps you find the best productivity
					tools.
				</p>
				<p class="text-lg">
					Community-driven, <span class="neon-green">open-source</span>, and
					always growing.
				</p>
			</div>

			<!-- Search Box with CTA -->
			<div class="max-w-lg mx-auto md:mt-10 mb-8">
				<div class="relative flex items-center md:flex-row flex-col gap-6">
					<div class="relative md:w-auto w-full h-[50px] flex-1">
						<Icon
							name="heroicons:magnifying-glass"
							class="absolute z-10 right-3 cursor-pointer hover:text-primary duration-300 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted"
							@click="handleSearch"
						/>
						<input
							v-model="searchQuery"
							type="text"
							placeholder="Search for tools..."
							class="w-full pl-10 pr-4 text-primary !border-gray-600 py-3 rounded-lg form-input text-foreground placeholder-muted focus:outline-none focus:border-transparent"
							@keyup.enter="handleSearch"
						/>
					</div>
					<NuxtLink
						to="/submit"
						class="btn w-full md:w-auto btn-primary h-[50px] px-6 py-3 whitespace-nowrap"
					>
						Submit a Tool
						<Icon
							name="heroicons:plus"
							class="h-5 w-5 ml-2"
						/>
					</NuxtLink>
				</div>
			</div>

			<!-- Stats -->
			<!-- <div class="grid grid-cols-3 gap-8 max-w-md mx-auto">
				<div class="text-center">
					<div class="text-h2 neon-green">150+</div>
					<div class="text-small">Tools</div>
				</div>
				<div class="text-center">
					<div class="text-h2 neon-green">12</div>
					<div class="text-small">Categories</div>
				</div>
				<div class="text-center">
					<div class="text-h2 neon-green">5K+</</div>
					<div class="text-small">Users</div>
				</div>
			</div> -->
		</div>
	</section>
</template>

<script setup>
	const searchQuery = ref("");

	const handleSearch = () => {
		if (searchQuery.value.trim()) {
			navigateTo(
				`/tools?search=${encodeURIComponent(searchQuery.value.trim())}`
			);
		} else {
			navigateTo("/tools");
		}
	};
</script>
