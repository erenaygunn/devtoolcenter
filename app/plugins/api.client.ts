export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig();

	const api = $fetch.create({
		baseURL: config.public.apiBase,
		timeout: 30000, // 30 second timeout
		retry: 1, // Retry failed requests once
		onRequest({ request, options }) {
			// Get token from secure storage (cookie first, then localStorage)
			let token = null;
			if (process.client) {
				const cookieToken = useCookie("adminToken", {
					httpOnly: true,
					secure: true,
					sameSite: "strict",
				});
				token = cookieToken.value || localStorage.getItem("adminToken");
			}

			// Build headers object
			const headers: Record<string, string> = {
				"X-Requested-With": "XMLHttpRequest",
				"Content-Type": "application/json",
			};

			if (token) {
				headers.Authorization = `Bearer ${token}`;
			}

			// Add CSRF protection for state-changing requests
			if (
				["POST", "PUT", "PATCH", "DELETE"].includes(
					(options.method || "GET").toString().toUpperCase()
				)
			) {
				const csrfToken = process.client
					? sessionStorage.getItem("csrf_token")
					: null;
				if (csrfToken) {
					headers["X-CSRF-Token"] = csrfToken;
				}
			}

			// Add cache-busting headers for fresh data when needed
			const method = (options.method || "GET").toString().toUpperCase();
			if (method === "GET" && (options as any).cache === false) {
				headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
				headers["Pragma"] = "no-cache";
				headers["Expires"] = "0";
			}

			// Merge with existing headers
			options.headers = {
				...(options.headers as any),
				...headers,
			};
		},
		onResponse({ response }) {
			// Store CSRF token from response headers
			if (process.client) {
				const csrfToken = response.headers.get("X-CSRF-Token");
				if (csrfToken) {
					sessionStorage.setItem("csrf_token", csrfToken);
				}
			}
		},
		onResponseError({ response }) {
			if (response.status === 401) {
				// Token expired or invalid - clear all auth data
				if (process.client) {
					const cookieToken = useCookie("adminToken");
					cookieToken.value = null;
					localStorage.removeItem("adminToken");
					sessionStorage.removeItem("csrf_token");

					// Check if we're on an admin page
					const currentPath = window.location.pathname;
					if (
						currentPath.startsWith("/admin") &&
						currentPath !== "/admin/login"
					) {
						// Redirect to admin login
						navigateTo("/admin/login");
					}
				}
			} else if (response.status === 403) {
				// CSRF token invalid
				if (process.client) {
					sessionStorage.removeItem("csrf_token");
				}
			} else if (response.status === 429) {
				// Rate limited
				throw createError({
					statusCode: 429,
					statusMessage: "Too many requests. Please slow down.",
				});
			}
		},
	});

	return { provide: { api } };
});
