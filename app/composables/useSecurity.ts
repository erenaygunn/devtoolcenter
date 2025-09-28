/**
 * Frontend Security Composable
 * Provides input sanitization, rate limiting, and security utilities
 */

interface RateLimitState {
	attempts: number;
	lastReset: number;
	blocked: boolean;
}

export const useSecurity = () => {
	// Rate limiting store
	const rateLimits = new Map<string, RateLimitState>();

	/**
	 * Sanitize HTML input to prevent XSS attacks
	 */
	const sanitizeHtml = (input: string): string => {
		if (!input || typeof input !== "string") return "";

		return input
			.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
			.replace(/<[^>]*>/g, "") // Remove all HTML tags
			.replace(/javascript:/gi, "") // Remove javascript: protocols
			.replace(/on\w+\s*=/gi, "") // Remove event handlers
			.replace(/&lt;script/gi, "") // Remove encoded script tags
			.replace(/&lt;\/script/gi, "")
			.trim()
			.substring(0, 1000); // Limit length
	};

	/**
	 * Sanitize search queries to prevent injection
	 */
	const sanitizeSearch = (query: string): string => {
		if (!query || typeof query !== "string") return "";

		return query
			.replace(/['"\\;]/g, "") // Remove potential SQL injection chars
			.replace(/[${}]/g, "") // Remove NoSQL injection chars
			.replace(/[<>]/g, "") // Remove HTML chars
			.trim()
			.substring(0, 100); // Limit search length
	};

	/**
	 * Validate URL format and safety
	 */
	const validateUrl = (url: string): { isValid: boolean; error?: string } => {
		if (!url || typeof url !== "string") {
			return { isValid: false, error: "URL is required" };
		}

		// Check length
		if (url.length > 2048) {
			return { isValid: false, error: "URL too long (max 2048 characters)" };
		}

		try {
			const urlObj = new URL(url);

			// Only allow http and https protocols
			if (!["http:", "https:"].includes(urlObj.protocol)) {
				return {
					isValid: false,
					error: "Only HTTP and HTTPS URLs are allowed",
				};
			}

			// Block localhost and internal IPs in production
			if (process.env.NODE_ENV === "production") {
				const hostname = urlObj.hostname.toLowerCase();
				if (
					hostname === "localhost" ||
					hostname === "127.0.0.1" ||
					hostname.startsWith("192.168.") ||
					hostname.startsWith("10.") ||
					hostname.startsWith("172.")
				) {
					return { isValid: false, error: "Internal URLs are not allowed" };
				}
			}

			return { isValid: true };
		} catch {
			return { isValid: false, error: "Invalid URL format" };
		}
	};

	/**
	 * Validate email format
	 */
	const validateEmail = (
		email: string
	): { isValid: boolean; error?: string } => {
		if (!email || typeof email !== "string") {
			return { isValid: false, error: "Email is required" };
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email) || email.length > 254) {
			return { isValid: false, error: "Invalid email format" };
		}

		return { isValid: true };
	};

	/**
	 * Rate limiting implementation
	 */
	const checkRateLimit = (
		key: string,
		limit: number = 5,
		windowMs: number = 60000 // 1 minute default
	): { allowed: boolean; error?: string; resetTime?: number } => {
		const now = Date.now();
		let state = rateLimits.get(key);

		// Initialize or reset if window expired
		if (!state || now - state.lastReset > windowMs) {
			state = {
				attempts: 0,
				lastReset: now,
				blocked: false,
			};
			rateLimits.set(key, state);
		}

		// Check if blocked
		if (state.blocked && now - state.lastReset < windowMs) {
			const resetTime = state.lastReset + windowMs;
			return {
				allowed: false,
				error: `Rate limit exceeded. Try again in ${Math.ceil(
					(resetTime - now) / 1000
				)} seconds.`,
				resetTime,
			};
		}

		// Increment attempts
		state.attempts++;

		// Check limit
		if (state.attempts > limit) {
			state.blocked = true;
			const resetTime = state.lastReset + windowMs;
			return {
				allowed: false,
				error: `Rate limit exceeded. Try again in ${Math.ceil(
					(resetTime - now) / 1000
				)} seconds.`,
				resetTime,
			};
		}

		return { allowed: true };
	};

	/**
	 * Generate CSRF token for forms
	 */
	const generateCSRFToken = (): string => {
		return crypto.randomUUID();
	};

	/**
	 * Validate form data comprehensively
	 */
	const validateFormData = (
		data: Record<string, any>,
		schema: Record<string, any>
	) => {
		const errors: Record<string, string> = {};

		for (const [field, value] of Object.entries(data)) {
			const rules = schema[field];
			if (!rules) continue;

			// Required check
			if (
				rules.required &&
				(!value || (typeof value === "string" && !value.trim()))
			) {
				errors[field] = `${field} is required`;
				continue;
			}

			// Type check
			if (value && rules.type && typeof value !== rules.type) {
				errors[field] = `${field} must be a ${rules.type}`;
				continue;
			}

			// Length checks for strings
			if (typeof value === "string") {
				if (rules.minLength && value.length < rules.minLength) {
					errors[
						field
					] = `${field} must be at least ${rules.minLength} characters`;
					continue;
				}
				if (rules.maxLength && value.length > rules.maxLength) {
					errors[
						field
					] = `${field} must be no more than ${rules.maxLength} characters`;
					continue;
				}
			}

			// Array length checks
			if (Array.isArray(value)) {
				if (rules.maxItems && value.length > rules.maxItems) {
					errors[field] = `${field} can have at most ${rules.maxItems} items`;
					continue;
				}
				if (rules.minItems && value.length < rules.minItems) {
					errors[field] = `${field} must have at least ${rules.minItems} items`;
					continue;
				}
			}

			// Custom validation
			if (rules.validate && typeof rules.validate === "function") {
				const result = rules.validate(value);
				if (!result.isValid) {
					errors[field] = result.error || `${field} is invalid`;
				}
			}
		}

		return {
			isValid: Object.keys(errors).length === 0,
			errors,
		};
	};

	/**
	 * Secure local storage operations
	 */
	const secureStorage = {
		set: (key: string, value: any, ttl?: number) => {
			try {
				const item = {
					value,
					timestamp: Date.now(),
					ttl: ttl || 0,
				};
				localStorage.setItem(key, JSON.stringify(item));
			} catch (error) {
				console.warn("Failed to save to localStorage:", error);
			}
		},

		get: (key: string) => {
			try {
				const itemStr = localStorage.getItem(key);
				if (!itemStr) return null;

				const item = JSON.parse(itemStr);

				// Check TTL
				if (item.ttl && Date.now() - item.timestamp > item.ttl) {
					localStorage.removeItem(key);
					return null;
				}

				return item.value;
			} catch (error) {
				console.warn("Failed to read from localStorage:", error);
				return null;
			}
		},

		remove: (key: string) => {
			try {
				localStorage.removeItem(key);
			} catch (error) {
				console.warn("Failed to remove from localStorage:", error);
			}
		},

		clear: () => {
			try {
				localStorage.clear();
			} catch (error) {
				console.warn("Failed to clear localStorage:", error);
			}
		},
	};

	return {
		sanitizeHtml,
		sanitizeSearch,
		validateUrl,
		validateEmail,
		checkRateLimit,
		generateCSRFToken,
		validateFormData,
		secureStorage,
	};
};
