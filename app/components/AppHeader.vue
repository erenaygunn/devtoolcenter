<template>
	<header class="glass fixed top-0 left-0 right-0 z-20">
		<div class="container !py-2">
			<div class="flex justify-between md:justify-around items-center h-16">
				<div class="flex items-center">
					<NuxtLink
						to="/"
						class="flex items-center space-x-2"
					>
						<NuxtImg
							src="/logo.png"
							alt="DevTool Center Logo"
							class="h-8 w-8 neon-green"
						/>
						<span class="text-h5 gradient-text">DevTool Center</span>
					</NuxtLink>
				</div>

				<nav class="hidden md:flex items-center space-x-8">
					<NuxtLink
						to="/"
						class="text-secondary header-link hover:text-primary transition-colors"
					>
						Home
					</NuxtLink>
					<NuxtLink
						to="/about"
						class="text-secondary header-link hover:text-primary transition-colors"
						@click="closeMenu"
					>
						About
					</NuxtLink>
					<NuxtLink
						to="/tools"
						class="text-secondary header-link hover:text-primary transition-colors"
					>
						Tools
					</NuxtLink>
					<NuxtLink
						to="/categories"
						class="text-secondary header-link hover:text-primary transition-colors"
					>
						Categories
					</NuxtLink>
					<NuxtLink
						to="/submit"
						class="text-secondary btn btn-secondary hover:text-primary transition-colors"
					>
						Submit a Tool
						<Icon
							name="heroicons:plus"
							class="h-5 w-5 ml-2"
						/>
					</NuxtLink>
					<a
						href="https://github.com/erenaygunn/devtoolcenter"
						class="text-secondary btn btn-secondary hover:text-primary transition-colors !p-3"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Icon
							name="simple-icons:github"
							class="h-5 w-5"
						/>
					</a>
				</nav>

				<div class="flex md:hidden items-center space-x-2">
					<div class="md:hidden">
						<button class="btn btn-tertiary btn-sm !p-3">
							<Icon
								name="heroicons:bars-3"
								class="h-6 w-6"
								@click="toggleMenu"
							/>
						</button>
					</div>
				</div>
			</div>
		</div>
	</header>

	<div
		class="header-menu md:hidden py-4 px-7 h-full w-[65%] z-50 fixed transition-all duration-700 -right-[1000px] glass"
		:class="{ '!right-0': isMenuOpen, '!-right-[1000px]': !isMenuOpen }"
	>
		<div class="w-full flex items-center justify-start">
			<button class="btn btn-tertiary btn-sm !p-3">
				<Icon
					name="cil:x"
					class="h-6 w-6"
					@click="closeMenu"
				/>
			</button>
		</div>
		<div class="flex flex-col mt-10 gap-y-6 items-start justify-center">
			<NuxtLink
				to="/"
				class="text-secondary header-link header-link hover:text-primary transition-colors"
				@click="closeMenu"
			>
				Home
			</NuxtLink>
			<NuxtLink
				to="/about"
				class="text-secondary header-link header-link hover:text-primary transition-colors"
				@click="closeMenu"
			>
				About
			</NuxtLink>
			<NuxtLink
				to="/tools"
				class="text-secondary header-link header-link hover:text-primary transition-colors"
				@click="closeMenu"
			>
				Tools
			</NuxtLink>
			<NuxtLink
				to="/categories"
				class="text-secondary header-link header-link hover:text-primary transition-colors"
				@click="closeMenu"
			>
				Categories
			</NuxtLink>
			<NuxtLink
				to="/submit"
				class="text-secondary btn btn-secondary hover:text-primary transition-colors"
				@click="closeMenu"
			>
				Submit a Tool
				<Icon
					name="heroicons:plus"
					class="h-5 w-5 ml-2"
				/>
			</NuxtLink>
			<a
				href="https://github.com/erenaygunn/devtoolcenter"
				class="text-secondary btn btn-secondary hover:text-primary transition-colors !p-3"
				target="_blank"
				rel="noopener noreferrer"
				@click="closeMenu"
			>
				<Icon
					name="simple-icons:github"
					class="h-5 w-5"
				/>
			</a>
		</div>
	</div>
</template>

<script lang="ts">
	export default defineNuxtComponent({
		data() {
			return {
				isMenuOpen: false,
			};
		},

		methods: {
			toggleMenu() {
				this.isMenuOpen = !this.isMenuOpen;
				document.body.classList.toggle("overflow-hidden", this.isMenuOpen);
				document.body.classList.toggle("overlay-active", this.isMenuOpen);
			},

			closeMenu() {
				this.isMenuOpen = false;
				document.body.classList.remove("overflow-hidden");
				document.body.classList.remove("overlay-active");
			},
		},
	});
</script>
