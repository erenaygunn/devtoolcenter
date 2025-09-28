export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig();

	const api = $fetch.create({
		baseURL: config.public.apiBase,
		onRequest({ options }) {
			// Auto-attach authorization header for admin API calls
			if (process.client) {
				const token = localStorage.getItem("adminToken");
				if (token) {
					options.headers = {
						...(options.headers as any),
						Authorization: `Bearer ${token}`,
					};
				}
			}
		},
		onResponseError({ response }) {
			// Handle 401 errors globally - redirect to login
			if (response.status === 401 && process.client) {
				// Check if we're on an admin page
				const currentPath = window.location.pathname;
				if (
					currentPath.startsWith("/admin") &&
					currentPath !== "/admin/login"
				) {
					// Clear the invalid token
					localStorage.removeItem("adminToken");
					// Redirect to admin login
					navigateTo("/admin/login");
				}
			}
		},
	});

	return { provide: { api } };
});
