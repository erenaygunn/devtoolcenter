<template>
	<header class="bg-white shadow-sm border-b">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<div class="flex items-center">
					<NuxtLink
						to="/"
						class="text-xl font-bold text-gray-900"
					>
						DevShelf
					</NuxtLink>
				</div>
				<nav class="hidden md:flex space-x-8">
					<NuxtLink
						to="/"
						class="text-gray-600 hover:text-gray-900"
					>
						Home
					</NuxtLink>
					<NuxtLink
						to="/about"
						class="text-gray-600 hover:text-gray-900"
					>
						About
					</NuxtLink>
					<NuxtLink
						to="/contact"
						class="text-gray-600 hover:text-gray-900"
					>
						Contact
					</NuxtLink>
				</nav>
				<div class="md:hidden">
					<Icon
						name="heroicons:bars-3"
						class="h-6 w-6"
					/>
				</div>
			</div>
		</div>
	</header>
</template>

<style scoped>
	.router-link-active {
		@apply text-blue-600;
	}
</style>
