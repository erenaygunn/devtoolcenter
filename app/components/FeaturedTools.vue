<template>
	<section class="section">
		<div class="container">
			<div class="text-center mb-12">
				<h2 class="text-h2 mb-4">Trending Tools</h2>
				<p class="text-muted">
					Explore some of the most popular and highly rated developer tools
					loved by community.
				</p>
			</div>

			<!-- Mobile Slider -->
			<div class="block md:hidden">
				<div
					class="swiper-container"
					ref="swiperContainer"
				>
					<div class="swiper-wrapper">
						<div
							class="swiper-slide px-3"
							v-for="tool in featuredTools"
							:key="tool.id"
						>
							<ToolCard :tool="tool" />
						</div>
					</div>
					<div class="swiper-pagination mt-6"></div>
				</div>
			</div>

			<!-- Desktop Grid -->
			<div class="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
				<ToolCard
					v-for="tool in featuredTools"
					:key="tool.id"
					:tool="tool"
				/>
			</div>

			<div class="text-center mt-8">
				<NuxtLink
					to="/tools"
					class="btn btn-secondary"
				>
					View All Tools
					<Icon
						name="heroicons:arrow-right"
						class="h-4 w-4 ml-2"
					/>
				</NuxtLink>
			</div>
		</div>
	</section>
</template>

<script setup>
	import { Swiper } from "swiper";
	import "swiper/css";
	import "swiper/css/pagination";

	const swiperContainer = ref(null);

	onMounted(() => {
		if (swiperContainer.value) {
			new Swiper(swiperContainer.value, {
				slidesPerView: 1.2,
				spaceBetween: 16,
				centeredSlides: false,
				pagination: {
					el: ".swiper-pagination",
					clickable: true,
				},
				breakpoints: {
					640: {
						slidesPerView: 2,
						spaceBetween: 20,
					},
				},
			});
		}
	});

	const featuredTools = ref([
		{
			id: 1,
			name: "VS Code",
			description:
				"Free, powerful code editor with extensive extensions and built-in Git support.",
			icon: "simple-icons:visualstudiocode",
			tags: ["Editor", "Free", "Extensions"],
			rating: 4.9,
			category: "Development",
			url: "https://code.visualstudio.com",
		},
		{
			id: 2,
			name: "Figma",
			description:
				"Collaborative design tool for creating user interfaces and prototypes.",
			icon: "simple-icons:figma",
			tags: ["Design", "Collaboration", "Prototyping"],
			rating: 4.8,
			category: "Design",
			url: "https://figma.com",
		},
		{
			id: 3,
			name: "GitHub",
			description:
				"Version control and collaboration platform for developers worldwide.",
			icon: "simple-icons:github",
			tags: ["Git", "Collaboration", "Open Source"],
			rating: 4.9,
			category: "Version Control",
			url: "https://github.com",
		},
	]);
</script>
