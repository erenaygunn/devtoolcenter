interface AdminUser {
	_id: string;
	email: string;
	role: "admin" | "superadmin";
}

interface LoginResponse {
	token: string;
}

export const useAdminAuth = () => {
	const { $api } = useNuxtApp();
	const adminUser = ref<AdminUser | null>(null);
	const isAuthenticated = computed(() => !!adminUser.value);
	const loading = ref(false);

	// Get token from localStorage
	const getToken = (): string | null => {
		if (process.client) {
			return localStorage.getItem("adminToken");
		}
		return null;
	};

	// Set token to localStorage
	const setToken = (token: string) => {
		if (process.client) {
			localStorage.setItem("adminToken", token);
		}
	};

	// Remove token from localStorage
	const removeToken = () => {
		if (process.client) {
			localStorage.removeItem("adminToken");
		}
	};

	// Login function
	const login = async (
		email: string,
		password: string
	): Promise<{ success: boolean; error?: string }> => {
		try {
			loading.value = true;

			const response: LoginResponse = await $fetch(
				"http://localhost:5050/api/v1/admin/login",
				{
					method: "POST",
					body: { email, password },
				}
			);

			if (response.token) {
				setToken(response.token);
				await fetchProfile();
				return { success: true };
			}

			return { success: false, error: "No token received" };
		} catch (error: any) {
			console.error("Login error:", error);
			return {
				success: false,
				error: error?.data?.error?.message || error?.message || "Login failed",
			};
		} finally {
			loading.value = false;
		}
	};

	// Fetch admin profile
	const fetchProfile = async (): Promise<boolean> => {
		try {
			const token = getToken();
			if (!token) return false;

			const profile = await $fetch<AdminUser>(
				"http://localhost:5050/api/v1/admin/me",
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			adminUser.value = profile;
			return true;
		} catch (error) {
			console.error("Failed to fetch profile:", error);
			removeToken();
			adminUser.value = null;
			return false;
		}
	};

	// Check authentication status
	const checkAuth = async (): Promise<boolean> => {
		if (!process.client) return false;

		const token = getToken();
		if (!token) {
			adminUser.value = null;
			return false;
		}

		// If we already have user data, return true
		if (adminUser.value) return true;

		// Otherwise, fetch profile to validate token
		return await fetchProfile();
	};

	// Initialize auth on client
	const initAuth = async () => {
		if (process.client) {
			await checkAuth();
		}
	};

	// Logout function
	const logout = async () => {
		removeToken();
		adminUser.value = null;
		if (process.client) {
			try {
				// Try navigateTo first, fallback to window.location
				await navigateTo("/admin/login");
			} catch (error) {
				console.warn("navigateTo failed, using window.location:", error);
				// Fallback to window.location for more reliable navigation
				window.location.href = "/admin/login";
			}
		}
	};

	// Register function (for first admin)
	const register = async (
		email: string,
		password: string,
		role: "admin" | "superadmin" = "admin"
	): Promise<{ success: boolean; error?: string }> => {
		try {
			loading.value = true;

			await $fetch("http://localhost:5050/api/v1/admin/register", {
				method: "POST",
				body: { email, password, role },
			});

			// Auto-login after successful registration
			return await login(email, password);
		} catch (error: any) {
			console.error("Registration error:", error);
			return {
				success: false,
				error:
					error?.data?.error?.message ||
					error?.message ||
					"Registration failed",
			};
		} finally {
			loading.value = false;
		}
	};

	return {
		// State
		adminUser: readonly(adminUser),
		isAuthenticated,
		loading: readonly(loading),

		// Methods
		login,
		register,
		logout,
		checkAuth,
		fetchProfile,
		initAuth,
		getToken,
	};
};
