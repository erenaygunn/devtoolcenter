<template>
	<header class="glass fixed top-0 left-0 right-0 z-50">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<div class="flex items-center">
					<NuxtLink
						to="/"
						class="flex items-center space-x-2"
					>
						<Icon
							name="heroicons:cube-transparent"
							class="h-8 w-8 neon-green"
						/>
						<span class="text-xl font-bold gradient-text">DevShelf</span>
					</NuxtLink>
				</div>

				<nav class="hidden md:flex space-x-8">
					<NuxtLink
						to="/"
						class="text-gray-300 hover:text-green-400 transition-colors"
					>
						Home
					</NuxtLink>
					<NuxtLink
						to="/tools"
						class="text-gray-300 hover:text-green-400 transition-colors"
					>
						Browse Tools
					</NuxtLink>
					<NuxtLink
						to="/categories"
						class="text-gray-300 hover:text-green-400 transition-colors"
					>
						Categories
					</NuxtLink>
					<NuxtLink
						to="/submit"
						class="text-gray-300 hover:text-green-400 transition-colors"
					>
						Submit Tool
					</NuxtLink>
				</nav>

				<div class="flex items-center space-x-4">
					<button class="glass glass-hover p-2 rounded-lg">
						<Icon
							name="heroicons:magnifying-glass"
							class="h-5 w-5 text-gray-300"
						/>
					</button>
					<div class="md:hidden">
						<button class="glass glass-hover p-2 rounded-lg">
							<Icon
								name="heroicons:bars-3"
								class="h-5 w-5 text-gray-300"
							/>
						</button>
					</div>
				</div>
			</div>
		</div>
	</header>
</template>

<style scoped>
	.router-link-active {
		@apply text-green-400;
	}
</style>
