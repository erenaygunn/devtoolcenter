export default defineNuxtRouteMiddleware(async (to) => {
	// Only apply middleware to admin routes (excluding login)
	if (to.path.startsWith("/admin") && to.path !== "/admin/login") {
		const { checkAuth, getToken } = useAdminAuth();

		// Quick token check for server-side rendering
		if (process.server) {
			// On server, just check if we have a basic auth setup
			// The real auth check will happen on client side
			return;
		}

		// Client-side authentication check
		if (process.client) {
			try {
				// First check if we have a token
				const token = getToken();
				if (!token) {
					console.warn("No admin token found, redirecting to login");
					return navigateTo("/admin/login", { replace: true });
				}

				// Then verify the token is valid
				const isAuthenticated = await checkAuth();
				if (!isAuthenticated) {
					console.warn("Admin authentication failed, redirecting to login");
					return navigateTo("/admin/login", { replace: true });
				}
			} catch (error) {
				console.error("Admin middleware error:", error);
				return navigateTo("/admin/login", { replace: true });
			}
		}
	}
});
