<template>
	<div class="section pt-16">
		<div class="container">
			<h1 class="text-h1 text-center mb-8">Contact Us</h1>

			<div class="grid md:grid-cols-2 gap-12">
				<!-- Contact Form -->
				<div>
					<h2 class="text-h3 mb-6">Get in Touch</h2>
					<form
						@submit.prevent="submitForm"
						class="space-y-6"
					>
						<div>
							<label
								for="name"
								class="block text-body-sm font-medium text-secondary mb-2"
							>
								Name
							</label>
							<input
								id="name"
								v-model="form.name"
								type="text"
								required
								class="form-input"
							/>
						</div>
						<div>
							<label
								for="email"
								class="block text-body-sm font-medium text-secondary mb-2"
							>
								Email
							</label>
							<input
								id="email"
								v-model="form.email"
								type="email"
								required
								class="form-input"
							/>
						</div>
						<div>
							<label
								for="message"
								class="block text-body-sm font-medium text-secondary mb-2"
							>
								Message
							</label>
							<textarea
								id="message"
								v-model="form.message"
								required
								class="form-textarea"
								placeholder="Tell us how we can help you..."
							></textarea>
						</div>
						<button
							type="submit"
							class="btn btn-primary btn-lg w-full"
						>
							Send Message
						</button>
					</form>
				</div>

				<!-- Contact Info -->
				<div>
					<h2 class="text-h3 mb-6">Contact Information</h2>
					<div class="space-y-6">
						<div class="flex items-start space-x-4">
							<Icon
								name="heroicons:envelope"
								class="h-6 w-6 text-primary mt-1"
							/>
							<div>
								<h3 class="text-h6">Email</h3>
								<p class="text-muted">hello@devshelf.com</p>
							</div>
						</div>
						<div class="flex items-start space-x-4">
							<Icon
								name="heroicons:map-pin"
								class="h-6 w-6 text-primary mt-1"
							/>
							<div>
								<h3 class="text-h6">Address</h3>
								<p class="text-muted">
									123 Developer Street<br />
									Tech City, TC 12345
								</p>
							</div>
						</div>
						<div class="flex items-start space-x-4">
							<Icon
								name="heroicons:phone"
								class="h-6 w-6 text-primary mt-1"
							/>
							<div>
								<h3 class="text-h6">Phone</h3>
								<p class="text-muted">+1 (555) 123-4567</p>
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
