<template>
	<footer class="bg-gray-50 border-t">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div class="flex flex-col md:flex-row justify-between items-center">
				<div class="text-gray-600 text-sm">
					© {{ currentYear }} DevShelf. All rights reserved.
				</div>
				<div class="flex space-x-6 mt-4 md:mt-0">
					<a
						href="#"
						class="text-gray-600 hover:text-gray-900"
					>
						<Icon
							name="heroicons:envelope"
							class="h-5 w-5"
						/>
					</a>
					<a
						href="#"
						class="text-gray-600 hover:text-gray-900"
					>
						<Icon
							name="simple-icons:github"
							class="h-5 w-5"
						/>
					</a>
					<a
						href="#"
						class="text-gray-600 hover:text-gray-900"
					>
						<Icon
							name="simple-icons:twitter"
							class="h-5 w-5"
						/>
					</a>
				</div>
			</div>
		</div>
	</footer>
</template>

<script setup>
	const currentYear = new Date().getFullYear();
</script>
