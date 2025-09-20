<template>
	<div class="py-16">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			<h1 class="text-4xl font-bold text-center mb-8">Contact Us</h1>

			<div class="grid md:grid-cols-2 gap-12">
				<!-- Contact Form -->
				<div>
					<h2 class="text-2xl font-semibold mb-6">Get in Touch</h2>
					<form
						@submit.prevent="submitForm"
						class="space-y-6"
					>
						<div>
							<label
								for="name"
								class="block text-sm font-medium text-gray-700 mb-2"
							>
								Name
							</label>
							<input
								id="name"
								v-model="form.name"
								type="text"
								required
								class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						<div>
							<label
								for="email"
								class="block text-sm font-medium text-gray-700 mb-2"
							>
								Email
							</label>
							<input
								id="email"
								v-model="form.email"
								type="email"
								required
								class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						<div>
							<label
								for="message"
								class="block text-sm font-medium text-gray-700 mb-2"
							>
								Message
							</label>
							<textarea
								id="message"
								v-model="form.message"
								rows="5"
								required
								class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							></textarea>
						</div>
						<button
							type="submit"
							class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
						>
							Send Message
						</button>
					</form>
				</div>

				<!-- Contact Info -->
				<div>
					<h2 class="text-2xl font-semibold mb-6">Contact Information</h2>
					<div class="space-y-6">
						<div class="flex items-start space-x-4">
							<Icon
								name="heroicons:envelope"
								class="h-6 w-6 text-blue-600 mt-1"
							/>
							<div>
								<h3 class="font-semibold">Email</h3>
								<p class="text-gray-600">hello@devshelf.com</p>
							</div>
						</div>
						<div class="flex items-start space-x-4">
							<Icon
								name="heroicons:map-pin"
								class="h-6 w-6 text-blue-600 mt-1"
							/>
							<div>
								<h3 class="font-semibold">Address</h3>
								<p class="text-gray-600">
									123 Developer Street<br />
									Tech City, TC 12345
								</p>
							</div>
						</div>
						<div class="flex items-start space-x-4">
							<Icon
								name="heroicons:phone"
								class="h-6 w-6 text-blue-600 mt-1"
							/>
							<div>
								<h3 class="font-semibold">Phone</h3>
								<p class="text-gray-600">+1 (555) 123-4567</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	useHead({
		title: "Contact - DevShelf",
		meta: [
			{
				name: "description",
				content:
					"Get in touch with the DevShelf team. We would love to hear from you!",
			},
		],
	});

	const form = ref({
		name: "",
		email: "",
		message: "",
	});

	const submitForm = () => {
		// Handle form submission here
		console.log("Form submitted:", form.value);
		// Reset form
		form.value = {
			name: "",
			email: "",
			message: "",
		};
		alert("Thank you for your message! We will get back to you soon.");
	};
</script>
