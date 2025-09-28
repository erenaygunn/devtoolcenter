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

	const tokenValidationInterval = ref<NodeJS.Timeout | null>(null);

	// Get token from secure storage (cookie first, then localStorage)
	const getToken = (): string | null => {
		if (process.client) {
			// Try to get from httpOnly cookie first, fallback to localStorage
			const cookieToken = useCookie("adminToken", {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				maxAge: 60 * 60 * 24, // 24 hours
			});
			return cookieToken.value || localStorage.getItem("adminToken");
		}
		return null;
	};

	// Set token to secure storage
	const setToken = (token: string) => {
		if (process.client) {
			// Set both cookie and localStorage for compatibility
			const cookieToken = useCookie("adminToken", {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				maxAge: 60 * 60 * 24,
			});
			cookieToken.value = token;
			localStorage.setItem("adminToken", token);

			// Start token validation interval
			startTokenValidation();
		}
	};

	// Remove token from all storage
	const removeToken = () => {
		if (process.client) {
			// Clear both cookie and localStorage
			const cookieToken = useCookie("adminToken");
			cookieToken.value = null;
			localStorage.removeItem("adminToken");
			sessionStorage.removeItem("csrf_token");

			// Clear validation interval
			if (tokenValidationInterval.value) {
				clearInterval(tokenValidationInterval.value);
				tokenValidationInterval.value = null;
			}
		}
	};

	// Login function
	const login = async (
		email: string,
		password: string
	): Promise<{ success: boolean; error?: string }> => {
		try {
			loading.value = true;

			const response: LoginResponse = await $api("/admin/login", {
				method: "POST",
				body: { email, password },
			});

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

			const profile = await $api<AdminUser>("/admin/me", {
				method: "GET",
			});

			adminUser.value = profile;
			return true;
		} catch (error) {
			console.error("Failed to fetch profile:", error);
			removeToken();
			adminUser.value = null;
			return false;
		}
	};

	// Validate token with server
	const validateToken = async (): Promise<boolean> => {
		const token = getToken();
		if (!token) {
			logout();
			return false;
		}

		try {
			const response: any = await $api("/auth/validate", {
				method: "GET",
			});

			if (!response?.valid) {
				logout();
				return false;
			}

			return true;
		} catch (error) {
			logout();
			return false;
		}
	};

	// Start periodic token validation
	const startTokenValidation = () => {
		if (tokenValidationInterval.value) {
			clearInterval(tokenValidationInterval.value);
		}
		// Validate token every 10 minutes
		tokenValidationInterval.value = setInterval(validateToken, 10 * 60 * 1000);
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
			const isAuthenticated = await checkAuth();
			if (isAuthenticated) {
				startTokenValidation();
			}
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

			console.log("Attempting registration for:", email, "with role:", role);

			const response = await $api("/admin/register", {
				method: "POST",
				body: { email, password, role },
			});

			console.log("Registration successful:", response);

			// Auto-login after successful registration
			return await login(email, password);
		} catch (error: any) {
			console.error("Registration error details:", {
				status: error?.status || error?.statusCode,
				statusText: error?.statusText,
				data: error?.data,
				message: error?.message,
				response: error?.response,
				full: error,
			});

			// Extract more detailed error information
			let errorMessage = "Registration failed";

			if (error?.status === 403 || error?.statusCode === 403) {
				errorMessage =
					"Registration forbidden. This might be due to: admin already exists, CORS issues, or backend restrictions.";
			} else if (error?.status === 500 || error?.statusCode === 500) {
				errorMessage = "Server error occurred during registration.";
			} else if (error?.data?.error?.message) {
				errorMessage = error.data.error.message;
			} else if (error?.data?.message) {
				errorMessage = error.data.message;
			} else if (error?.message) {
				errorMessage = error.message;
			}

			return {
				success: false,
				error: errorMessage,
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
		validateToken,
	};
};
