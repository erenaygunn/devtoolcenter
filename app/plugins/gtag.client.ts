export default defineNuxtPlugin((nuxtApp) => {
	// Only run on client
	if (!process.client) return;

	const config = useRuntimeConfig();
	const GA_ID = config.public.googleAnalyticsId as string | undefined;

	// If no GA ID, do nothing (safe for open source)
	if (!GA_ID) return;

	// Inject gtag script once
	const injectScript = () => {
		if (document.getElementById("ga-gtag")) return; // avoid duplicates

		// <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXX"></script>
		const script = document.createElement("script");
		script.id = "ga-gtag";
		script.async = true;
		script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
			GA_ID
		)}`;
		document.head.appendChild(script);

		// Inline init script
		const inline = document.createElement("script");
		inline.id = "ga-gtag-inline";
		inline.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      // Disable automatic page_view; we'll send it manually on route changes
      gtag('config', '${GA_ID}', { send_page_view: false });
    `;
		document.head.appendChild(inline);
	};

	// Only inject in production by default; if you want analytics in dev, remove this check
	if (import.meta.env.PROD) {
		injectScript();
	}

	// Track route changes (SPA pageviews)
	const router = useRouter();
	nuxtApp.hook("page:finish", () => {
		try {
			if (!(window as any).gtag || !GA_ID) return;
			const path =
				router.currentRoute.value.fullPath ||
				window.location.pathname + window.location.search;
			// Skip admin routes
			if (path.startsWith("/admin")) return;
			// page_location and page_path help GA attribute SPA navigation correctly
			(window as any).gtag("event", "page_view", {
				page_title: document.title,
				page_location: window.location.href,
				page_path: path,
			});
		} catch (e) {
			// ignore
		}
	});

	return {
		provide: {
			gtag: (event: string, params?: Record<string, any>) => {
				try {
					if ((window as any).gtag) {
						(window as any).gtag("event", event, params || {});
					}
				} catch {
					// no-op
				}
			},
		},
	};
});
