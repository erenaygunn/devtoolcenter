<template>
	<div class="!pt-40 section">
		<div class="container">
			<!-- Header -->
			<div class="mb-8">
				<h1 class="text-h1 mb-4">
					Browse <span class="gradient-text">Categories</span>
				</h1>
				<p class="text-muted">
					Explore tools organized by category to find exactly what you need
				</p>
			</div>

			<!-- Categories Grid -->
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
				<NuxtLink
					v-for="category in categories"
					:key="category.id"
					:to="`/tools?category=${category.id}`"
					class="card card-hover group"
				>
					<div class="flex items-start gap-4">
						<div class="flex-shrink-0">
							<div class="icon-container mt-1">
								<Icon
									:name="category.icon"
									class="h-6 w-6 text-primary"
								/>
							</div>
						</div>
						<div class="flex-1 min-w-0">
							<h3
								class="text-h4 mb-2 group-hover:text-primary transition-colors"
							>
								{{ category.name }}
							</h3>
							<p class="text-muted text-small mb-3 line-clamp-2">
								{{ category.description }}
							</p>
							<div class="flex items-center justify-between">
								<span class="text-xs text-subtle">
									{{ category.toolCount }} tool{{
										category.toolCount !== 1 ? "s" : ""
									}}
								</span>
								<Icon
									name="heroicons:arrow-right"
									class="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
								/>
							</div>
						</div>
					</div>
				</NuxtLink>
			</div>

			<!-- All Tools Link -->
			<div class="text-center mt-10">
				<NuxtLink
					to="/tools"
					class="btn btn-primary inline-flex items-center gap-2"
				>
					<Icon
						name="heroicons:squares-2x2"
						class="h-4 w-4"
					/>
					Browse All Tools
				</NuxtLink>
			</div>
		</div>
	</div>
</template>

<script setup>
	useHead({
		title: "Categories - DevShelf",
		meta: [
			{
				name: "description",
				content:
					"Browse developer tools organized by category. Find frontend, backend, AI, design, DevOps, testing, and documentation tools.",
			},
		],
	});

	// Mock data for tool counts - in a real app, this would come from your data source
	const categories = ref([
		{
			id: "frontend",
			name: "Frontend",
			description:
				"Client-side development tools, frameworks, and libraries for building user interfaces and web applications.",
			icon: "heroicons:code-bracket",
			toolCount: 15,
		},
		{
			id: "backend",
			name: "Backend",
			description:
				"Server-side development tools, APIs, databases, and infrastructure for building robust applications.",
			icon: "heroicons:server",
			toolCount: 12,
		},
		{
			id: "ai-helpers",
			name: "AI Helpers",
			description:
				"AI-powered tools and assistants to boost productivity and automate development tasks.",
			icon: "heroicons:cpu-chip",
			toolCount: 8,
		},
		{
			id: "design",
			name: "Design",
			description:
				"UI/UX design tools, prototyping software, and resources for creating beautiful interfaces.",
			icon: "heroicons:paint-brush",
			toolCount: 10,
		},
		{
			id: "devops",
			name: "DevOps",
			description:
				"Deployment, monitoring, CI/CD, and infrastructure tools for streamlined development operations.",
			icon: "heroicons:cog-6-tooth",
			toolCount: 14,
		},
		{
			id: "testing",
			name: "Testing",
			description:
				"Testing frameworks, automation tools, and quality assurance resources for reliable software.",
			icon: "heroicons:beaker",
			toolCount: 9,
		},
		{
			id: "documentation",
			name: "Documentation",
			description:
				"Tools for creating, managing, and sharing project documentation and knowledge bases.",
			icon: "heroicons:document-text",
			toolCount: 7,
		},
	]);
</script>
