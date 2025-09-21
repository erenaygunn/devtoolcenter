<template>
	<header class="glass fixed top-0 left-0 right-0 z-50">
		<div class="container">
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
						<span class="text-h5 gradient-text">DevShelf</span>
					</NuxtLink>
				</div>

				<nav class="hidden md:flex space-x-8">
					<NuxtLink
						to="/"
						class="text-secondary hover:text-primary transition-colors"
					>
						Home
					</NuxtLink>
					<NuxtLink
						to="/tools"
						class="text-secondary hover:text-primary transition-colors"
					>
						Browse Tools
					</NuxtLink>
					<NuxtLink
						to="/categories"
						class="text-secondary hover:text-primary transition-colors"
					>
						Categories
					</NuxtLink>
					<NuxtLink
						to="/submit"
						class="text-secondary hover:text-primary transition-colors"
					>
						Submit Tool
					</NuxtLink>
				</nav>

				<div class="flex items-center space-x-4">
					<button class="btn btn-tertiary btn-sm p-2">
						<Icon
							name="heroicons:magnifying-glass"
							class="h-5 w-5"
						/>
					</button>
					<div class="md:hidden">
						<button class="btn btn-tertiary btn-sm p-2">
							<Icon
								name="heroicons:bars-3"
								class="h-5 w-5"
							/>
						</button>
					</div>
				</div>
			</div>
		</div>
	</header>
</template>
