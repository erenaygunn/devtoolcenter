<script setup lang="ts">
	definePageMeta({
		layout: false, // Don't use default layout for login
	});

	const { login, register, loading, isAuthenticated, initAuth } =
		useAdminAuth();

	const mode = ref<"login" | "register">("login");
	const form = reactive({
		email: "",
		password: "",
		confirmPassword: "",
		role: "admin" as "admin" | "superadmin",
	});
	const errorMsg = ref("");
	const successMsg = ref("");

	// Check if user is already logged in
	onMounted(async () => {
		await initAuth();
		if (isAuthenticated.value) {
			navigateTo("/admin");
		}
	});

	const isValid = computed(() => {
		const emailValid = form.email.includes("@") && form.email.includes(".");
		const passwordValid = form.password.length >= 6;

		if (mode.value === "register") {
			return (
				emailValid && passwordValid && form.password === form.confirmPassword
			);
		}

		return emailValid && passwordValid;
	});

	const submit = async () => {
		errorMsg.value = "";
		successMsg.value = "";

		if (!isValid.value) {
			errorMsg.value = "Please fill in all fields correctly";
			return;
		}

		try {
			let result;

			if (mode.value === "login") {
				result = await login(form.email, form.password);
			} else {
				result = await register(form.email, form.password, form.role);
			}

			if (result.success) {
				successMsg.value =
					mode.value === "login"
						? "Login successful!"
						: "Registration successful!";
				await nextTick();
				navigateTo("/admin");
			} else {
				errorMsg.value = result.error || `${mode.value} failed`;
			}
		} catch (error) {
			errorMsg.value = "An unexpected error occurred";
			console.error(error);
		}
	};

	const toggleMode = () => {
		mode.value = mode.value === "login" ? "register" : "login";
		errorMsg.value = "";
		successMsg.value = "";
		// Reset form
		Object.assign(form, {
			email: "",
			password: "",
			confirmPassword: "",
			role: "admin",
		});
	};
</script>

<template>
	<div class="section flex items-center justify-center min-h-screen">
		<div class="card p-8 w-full max-w-md">
			<div class="text-center mb-6">
				<Icon
					name="heroicons:shield-check"
					class="h-12 w-12 text-primary mx-auto mb-4"
				/>
				<h1 class="text-h2 mb-2">
					{{ mode === "login" ? "Admin Login" : "Admin Registration" }}
				</h1>
				<p class="text-muted">
					{{
						mode === "login"
							? "Access the admin dashboard"
							: "Create first admin account"
					}}
				</p>
			</div>

			<form
				@submit.prevent="submit"
				class="space-y-4"
			>
				<div>
					<label class="block text-sm font-medium mb-2">Email</label>
					<input
						v-model="form.email"
						type="email"
						required
						placeholder="admin@example.com"
						class="form-input w-full"
						:disabled="loading"
					/>
				</div>

				<div>
					<label class="block text-sm font-medium mb-2">Password</label>
					<input
						v-model="form.password"
						type="password"
						required
						placeholder="Your password (min 6 characters)"
						class="form-input w-full"
						:disabled="loading"
					/>
				</div>

				<div v-if="mode === 'register'">
					<label class="block text-sm font-medium mb-2">Confirm Password</label>
					<input
						v-model="form.confirmPassword"
						type="password"
						required
						placeholder="Confirm your password"
						class="form-input w-full"
						:disabled="loading"
					/>
				</div>

				<div v-if="mode === 'register'">
					<label class="block text-sm font-medium mb-2">Role</label>
					<select
						v-model="form.role"
						class="form-input w-full"
						:disabled="loading"
					>
						<option value="admin">Admin</option>
						<option value="superadmin">Super Admin</option>
					</select>
				</div>

				<div
					v-if="errorMsg"
					class="p-3 bg-red-400/10 border border-red-400/30 rounded-lg"
				>
					<p class="text-red-600 text-sm flex items-center">
						<Icon
							name="heroicons:exclamation-triangle"
							class="h-4 w-4 mr-2"
						/>
						{{ errorMsg }}
					</p>
				</div>

				<div
					v-if="successMsg"
					class="p-3 bg-cyan-400/10 border border-cyan-400/30 rounded-lg"
				>
					<p class="text-cyan-500 text-sm flex items-center">
						<Icon
							name="heroicons:check-circle"
							class="h-4 w-4 mr-2"
						/>
						{{ successMsg }}
					</p>
				</div>

				<button
					type="submit"
					class="btn btn-primary w-full"
					:disabled="loading || !isValid"
				>
					<Icon
						v-if="loading"
						name="heroicons:arrow-path"
						class="h-4 w-4 mr-2 animate-spin"
					/>
					{{
						loading
							? mode === "login"
								? "Signing in..."
								: "Creating account..."
							: mode === "login"
							? "Sign In"
							: "Create Account"
					}}
				</button>
			</form>

			<div class="mt-6 text-center space-y-3">
				<button
					@click="toggleMode"
					class="text-sm text-muted hover:text-primary transition-colors"
					:disabled="loading"
				>
					{{
						mode === "login"
							? "Need to create first admin? Register here"
							: "Already have an account? Sign in"
					}}
				</button>

				<NuxtLink
					to="/"
					class="block text-sm text-muted hover:text-primary"
				>
					← Back to DevTool Center
				</NuxtLink>
			</div>
		</div>
	</div>
</template>
