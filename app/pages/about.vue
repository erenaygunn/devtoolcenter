<template>
	<div class="py-16">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			<h1 class="text-4xl font-bold text-center mb-8">About DevShelf</h1>

			<div class="prose prose-lg mx-auto">
				<p class="text-xl text-gray-600 text-center mb-12">
					DevShelf is a modern platform designed to help developers discover,
					organize, and share development resources.
				</p>

				<div class="grid md:grid-cols-2 gap-12 items-center mb-16">
					<div>
						<h2 class="text-2xl font-semibold mb-4">Our Mission</h2>
						<p class="text-gray-600">
							We believe that great development tools and resources should be
							easily accessible to everyone. Our platform aims to bridge the gap
							between developers and the tools they need to build amazing
							applications.
						</p>
					</div>
					<div
						class="bg-gray-100 h-64 rounded-lg flex items-center justify-center"
					>
						<Icon
							name="heroicons:cube"
							class="h-24 w-24 text-blue-600"
						/>
					</div>
				</div>

				<div class="text-center">
					<h2 class="text-2xl font-semibold mb-8">Why Choose DevShelf?</h2>
					<div class="grid md:grid-cols-2 gap-8">
						<div class="text-left">
							<h3 class="font-semibold mb-2">Curated Content</h3>
							<p class="text-gray-600">
								Every resource is carefully selected and reviewed by our team of
								experienced developers.
							</p>
						</div>
						<div class="text-left">
							<h3 class="font-semibold mb-2">Community Driven</h3>
							<p class="text-gray-600">
								Built by developers, for developers. Join our growing community
								of tech enthusiasts.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	useHead({
		title: "About - DevShelf",
		meta: [
			{
				name: "description",
				content:
					"Learn more about DevShelf and our mission to help developers discover amazing resources.",
			},
		],
	});
</script>
