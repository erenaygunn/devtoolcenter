<template>
	<div>
		<!-- Loading state -->
		<div
			v-if="loading || checking"
			class="min-h-screen flex items-center justify-center"
		>
			<div class="text-center">
				<Icon
					name="heroicons:arrow-path"
					class="h-8 w-8 animate-spin mx-auto mb-4 text-primary"
				/>
				<p class="text-muted">Verifying authentication...</p>
			</div>
		</div>

		<!-- Authenticated content -->
		<div v-else-if="isAuthenticated">
			<slot />
		</div>

		<!-- Not authenticated - should not happen due to middleware -->
		<div
			v-else
			class="min-h-screen flex items-center justify-center"
		>
			<div class="text-center">
				<Icon
					name="heroicons:exclamation-triangle"
					class="h-8 w-8 mx-auto mb-4 text-red-400"
				/>
				<h1 class="text-h3 mb-2">Authentication Required</h1>
				<p class="text-muted mb-4">
					You must be logged in to access this page.
				</p>
				<NuxtLink
					to="/admin/login"
					class="btn btn-primary"
				>
					Go to Login
				</NuxtLink>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	interface Props {
		requireAuth?: boolean;
		redirectTo?: string;
	}

	const props = withDefaults(defineProps<Props>(), {
		requireAuth: true,
		redirectTo: "/admin/login",
	});

	const { isAuthenticated, loading, checkAuth, initAuth } = useAdminAuth();
	const checking = ref(true);

	// Check authentication on mount
	onMounted(async () => {
		if (!props.requireAuth) {
			checking.value = false;
			return;
		}

		try {
			// Initialize auth and check authentication
			await initAuth();
			const isAuth = await checkAuth();

			if (!isAuth && props.requireAuth) {
				console.warn("AdminGuard: Authentication failed, redirecting");
				await navigateTo(props.redirectTo, { replace: true });
				return;
			}
		} catch (error) {
			console.error("AdminGuard: Auth check failed:", error);
			if (props.requireAuth) {
				await navigateTo(props.redirectTo, { replace: true });
				return;
			}
		} finally {
			checking.value = false;
		}
	});

	// Watch for authentication state changes
	watch(isAuthenticated, (newVal) => {
		if (process.client && props.requireAuth && !newVal && !checking.value) {
			console.warn("AdminGuard: Authentication lost, redirecting");
			navigateTo(props.redirectTo, { replace: true });
		}
	});
</script>
