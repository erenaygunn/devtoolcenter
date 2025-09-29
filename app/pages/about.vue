<template>
	<div class="min-h-screen">
		<AboutHero />
		<PurposeSection />
		<CommunitySection />
		<CallToAction />
	</div>
</template>

<script setup>
	import AboutHero from "~/components/about/AboutHero.vue";
	import PurposeSection from "~/components/about/PurposeSection.vue";
	import CommunitySection from "~/components/about/CommunitySection.vue";
	import CallToAction from "~/components/about/CallToAction.vue";

	useSeoMeta({
		title: "About DevShelf - Community-Driven Developer Tools Directory",
		description:
			"Learn about DevShelf's mission to connect developers with the best free productivity tools. Created by Eren Aygün to build a stronger developer community.",
	});
</script>
