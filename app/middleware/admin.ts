export default defineNuxtRouteMiddleware(async (to) => {
	// Only apply middleware to admin routes (excluding login)
	if (to.path.startsWith("/admin") && to.path !== "/admin/login") {
		const { checkAuth } = useAdminAuth();

		if (process.client) {
			const isAuthenticated = await checkAuth();

			if (!isAuthenticated) {
				return navigateTo("/admin/login");
			}
		}
	}
});
