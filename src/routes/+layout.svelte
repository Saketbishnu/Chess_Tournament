<script>
	import { page } from "$app/state";
	import favicon from "$lib/assets/favicon.svg";

	let { children } = $props();

	const links = [
		{ href: "/", label: "Home" },
		{ href: "/players", label: "Players" },
		{ href: "/tournaments", label: "Tournaments" },
		{ href: "/matches", label: "Matches" },
		{ href: "/ranking", label: "Ranking" },
		{ href: "/contact", label: "Contact" }
	];

	function isActive(href) {
		if (href === "/") {
			return page.url.pathname === "/";
		}

		return page.url.pathname.startsWith(href);
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon}>
</svelte:head>

<nav class="navbar">
	<a class="brand" href="/">♟ Chess Tournament Management System</a>

	<div class="nav-links">
		{#each links as link}
			<a class:active={isActive(link.href)} href={link.href}>{link.label}</a>
		{/each}
	</div>
</nav>

<main>
	{@render children()}
</main>

<style>
	:global(*) {
		box-sizing: border-box;
	}

	:global(body) {
		margin: 0;
		background: #f7f9fc;
		color: #1f2937;
		font-family:
			Inter,
			ui-sans-serif,
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			"Segoe UI",
			sans-serif;
	}

	:global(a) {
		color: inherit;
		text-decoration: none;
	}

	:global(button),
	:global(input),
	:global(select) {
		font: inherit;
	}

	:global(img),
	:global(svg) {
		max-width: 100%;
	}

	.navbar {
		align-items: center;
		background: #0f2a4a;
		color: white;
		display: flex;
		gap: 18px;
		justify-content: space-between;
		padding: 16px 32px;
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.brand {
		font-size: 18px;
		font-weight: 700;
		line-height: 1.3;
		min-width: 220px;
	}

	.nav-links {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		justify-content: flex-end;
		min-width: 0;
	}

	.nav-links a {
		border-radius: 8px;
		color: #dbeafe;
		font-weight: 600;
		padding: 8px 12px;
	}

	.nav-links a.active,
	.nav-links a:hover {
		background: #2563eb;
		color: white;
	}

	main {
		margin: 0 auto;
		max-width: 1180px;
		padding: 32px 20px;
	}

	:global(.page-header) {
		margin-bottom: 24px;
	}

	:global(.page-header h1) {
		color: #0f2a4a;
		font-size: clamp(30px, 5vw, 52px);
		line-height: 1.1;
		margin: 0 0 12px;
		overflow-wrap: anywhere;
	}

	:global(.page-header p) {
		color: #526070;
		font-size: clamp(16px, 2.4vw, 18px);
		line-height: 1.6;
		margin: 0;
		max-width: 760px;
	}

	:global(.card) {
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 14px;
		box-shadow: 0 10px 28px rgba(15, 42, 74, 0.08);
		padding: 24px;
	}

	:global(.section-title) {
		color: #0f2a4a;
		font-size: 24px;
		margin: 0 0 18px;
	}

	:global(.form-grid) {
		display: grid;
		gap: 18px;
		grid-template-columns: repeat(auto-fit, minmax(min(210px, 100%), 1fr));
	}

	:global(.field label) {
		color: #344256;
		display: block;
		font-weight: 700;
		margin-bottom: 8px;
	}

	:global(.field input),
	:global(.field select) {
		border: 1px solid #cbd5e1;
		border-radius: 10px;
		padding: 11px 12px;
		width: 100%;
	}

	:global(.actions) {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 20px;
	}

	:global(.btn) {
		border: 0;
		border-radius: 10px;
		color: white;
		cursor: pointer;
		font-weight: 700;
		line-height: 1.2;
		padding: 10px 16px;
		text-align: center;
	}

	:global(.btn-primary) {
		background: #2563eb;
	}

	:global(.btn-success) {
		background: #16a34a;
	}

	:global(.btn-danger) {
		background: #dc2626;
	}

	:global(.btn-muted) {
		background: #64748b;
	}

	:global(.table-wrap) {
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		width: 100%;
	}

	:global(table) {
		border-collapse: collapse;
		min-width: 720px;
		width: 100%;
	}

	:global(th),
	:global(td) {
		border-bottom: 1px solid #e5e7eb;
		padding: 14px 12px;
		text-align: left;
	}

	:global(th) {
		background: #eff6ff;
		color: #0f2a4a;
		font-size: 14px;
		text-transform: uppercase;
	}

	:global(tbody tr:hover) {
		background: #f8fafc;
	}

	:global(.stack) {
		display: grid;
		gap: 24px;
	}

	:global(.message) {
		background: #eff6ff;
		border: 1px solid #bfdbfe;
		border-radius: 10px;
		color: #1d4ed8;
		margin-bottom: 18px;
		padding: 12px 14px;
	}

	@media (max-width: 760px) {
		.navbar {
			align-items: flex-start;
			flex-direction: column;
			gap: 12px;
			padding: 14px 16px;
		}

		.brand {
			font-size: 16px;
			min-width: 0;
			width: 100%;
		}

		.nav-links {
			justify-content: flex-start;
			width: 100%;
		}

		.nav-links a {
			font-size: 14px;
			padding: 8px 10px;
		}

		main {
			padding: 22px 14px;
		}

		:global(.card) {
			border-radius: 12px;
			padding: 18px;
		}

		:global(.section-title) {
			font-size: 21px;
		}

		:global(.form-grid) {
			grid-template-columns: 1fr;
		}

		:global(.actions) {
			align-items: stretch;
			flex-direction: column;
		}

		:global(.btn) {
			width: 100%;
		}

		:global(table) {
			min-width: 640px;
		}

		:global(th),
		:global(td) {
			padding: 12px 10px;
		}
	}

	@media (max-width: 420px) {
		.navbar {
			padding: 12px;
		}

		.nav-links {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.nav-links a {
			text-align: center;
		}

		main {
			padding: 18px 10px;
		}

		:global(.page-header) {
			margin-bottom: 18px;
		}

		:global(.page-header h1) {
			font-size: 28px;
		}

		:global(.card) {
			padding: 14px;
		}

		:global(table) {
			font-size: 14px;
			min-width: 560px;
		}
	}
</style>
