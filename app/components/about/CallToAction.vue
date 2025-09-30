<template>
	<section class="section">
		<div class="container px-4 sm:px-6 lg:px-8">
			<div class="max-w-4xl mx-auto">
				<div class="glass p-8 rounded-2xl text-center relative overflow-hidden">
					<div
						class="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5"
					></div>
					<div class="relative">
						<h2 class="text-h3 gradient-text mb-4">Ready to Join?</h2>
						<p class="text-body text-muted mb-8 max-w-2xl mx-auto">
							Every contribution matters. Help us build the ultimate developer
							tools directory.
						</p>
						<div class="flex flex-col sm:flex-row gap-4 justify-center">
							<NuxtLink
								to="/submit"
								class="btn btn-primary"
							>
								<Icon
									name="heroicons:plus"
									class="h-5 w-5"
								/>
								Submit a Tool
							</NuxtLink>
							<a
								href="https://github.com/erenaygunn/devtoolcenter"
								class="btn btn-secondary"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Icon
									name="simple-icons:github"
									class="h-5 w-5 mr-3"
								/>
								GitHub
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
