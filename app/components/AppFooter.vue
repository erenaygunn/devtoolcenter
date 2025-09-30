<template>
	<footer class="glass border-t border-white/10 mt-20">
		<div class="container section px-4 sm:px-6 lg:px-8">
			<div
				class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
			>
				<div class="col-span-1 sm:col-span-2">
					<div class="flex items-center space-x-2 mb-4">
						<NuxtImg
							src="/logo.png"
							alt="DevTool Center Logo"
							class="h-8 w-8 neon-green"
						/>
						<span class="text-h5 gradient-text">DevTool Center</span>
					</div>
					<p class="text-muted mb-4">
						The open-source, community-driven platform for discovering the best
						free productivity tools for developers.
					</p>
					<div class="flex flex-wrap justify-center sm:justify-start space-x-4">
						<a
							href="https://github.com/erenaygunn/devtoolcenter"
							class="btn btn-tertiary btn-sm p-2"
						>
							<Icon
								name="simple-icons:github"
								class="h-5 w-5"
							/>
						</a>
					</div>
				</div>

				<div>
					<h3 class="text-h6 text-primary mb-4">Quick Links</h3>
					<ul class="space-y-2 text-muted">
						<li>
							<NuxtLink
								to="/"
								class="hover:text-primary transition-colors"
								>Home</NuxtLink
							>
						</li>
						<li>
							<NuxtLink
								to="/tools"
								class="hover:text-primary transition-colors"
								>Browse Tools</NuxtLink
							>
						</li>
						<li>
							<NuxtLink
								to="/categories"
								class="hover:text-primary transition-colors"
								>Categories</NuxtLink
							>
						</li>
						<li>
							<NuxtLink
								to="/submit"
								class="hover:text-primary transition-colors"
								>Submit Tool</NuxtLink
							>
						</li>
						<li>
							<NuxtLink
								to="/about"
								class="hover:text-primary transition-colors"
								>About</NuxtLink
							>
						</li>
					</ul>
				</div>

				<div>
					<h3 class="text-h6 text-primary mb-4">Community</h3>
					<ul class="space-y-2 text-muted">
						<li>
							<a
								href="https://github.com/erenaygunn/devtoolcenter?tab=contributing-ov-file"
								class="hover:text-primary transition-colors"
								>Contribution Guidelines</a
							>
						</li>
						<li>
							<a
								href="https://github.com/erenaygunn/devtoolcenter"
								class="hover:text-primary transition-colors"
								>GitHub</a
							>
						</li>
					</ul>
				</div>
			</div>

			<div
				class="border-t border-white/10 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-muted px-4"
			>
				<p class="text-body-sm">
					&copy; {{ currentYear }} DevTool Center. Open source and community
					driven.
				</p>
			</div>
		</div>
	</footer>
</template>

<script setup>
	const currentYear = new Date().getFullYear();
</script>
