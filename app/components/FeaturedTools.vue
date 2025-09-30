<template>
	<section class="section">
		<div class="container">
			<div class="text-center mb-12">
				<h2 class="text-h2 mb-4">Latest Tools</h2>
				<p class="text-muted">
					Check out the newest developer tools recently added to our platform.
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
							v-for="tool in latestTools"
							:key="tool.id || tool._id"
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
					v-for="tool in latestTools"
					:key="tool.id || tool._id"
					:tool="tool"
				/>
			</div>

			<div class="text-center mt-8">
				<NuxtLink
					to="/tools"
					class="btn btn-secondary"
				>
					View All Tools
				</NuxtLink>
			</div>
		</div>
	</section>
</template>

<script setup>
	import { Swiper } from "swiper";
	import "swiper/css";
	import "swiper/css/pagination";

	const config = useRuntimeConfig();
	const apiBase = config.public.apiBase;
	const swiperContainer = ref(null);

	// Use cached fetch for featured tools
	const { cachedFetch } = useApiCache();

	// Fetch latest 3 tools with caching
	const { data: apiData } = await useAsyncData(
		"featured-tools",
		() =>
			cachedFetch(`${apiBase}/tools`, {
				params: {
					sort: "date",
					limit: 3,
				},
			}),
		{
			server: true,
			transform: (data) => data?.data ?? [],
		}
	);

	const latestTools = computed(() => apiData.value ?? []);

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
</script>
