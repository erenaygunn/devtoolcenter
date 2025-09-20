<template>
	<div>
		<!-- Hero Section -->
		<section
			class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20"
		>
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<h1 class="text-4xl md:text-6xl font-bold mb-6">Welcome to DevShelf</h1>
				<p class="text-xl md:text-2xl mb-8 opacity-90">
					Your go-to platform for development resources and tools
				</p>
				<NuxtLink
					to="/about"
					class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
				>
					Learn More
				</NuxtLink>
			</div>
		</section>

		<!-- Features Section -->
		<section class="py-16">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h2 class="text-3xl font-bold text-center mb-12">Features</h2>
				<div class="grid md:grid-cols-3 gap-8">
					<AppCard
						title="Fast Development"
						description="Built with Nuxt 3 for optimal performance and developer experience."
					>
						<Icon
							name="heroicons:rocket-launch"
							class="h-8 w-8 text-blue-600"
						/>
					</AppCard>
					<AppCard
						title="Modern Stack"
						description="Using the latest technologies and best practices for web development."
					>
						<Icon
							name="heroicons:code-bracket"
							class="h-8 w-8 text-green-600"
						/>
					</AppCard>
					<AppCard
						title="Responsive Design"
						description="Fully responsive design that works perfectly on all devices."
					>
						<Icon
							name="heroicons:device-phone-mobile"
							class="h-8 w-8 text-purple-600"
						/>
					</AppCard>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
	useHead({
		title: "Home - DevShelf",
		meta: [
			{
				name: "description",
				content:
					"Welcome to DevShelf - Your go-to platform for development resources and tools",
			},
		],
	});
</script>
