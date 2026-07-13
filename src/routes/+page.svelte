<script>
	let dashboard = $state(null);
	let loading = $state(true);
	let errorMessage = $state("");

	const quickLinks = [
		{ label: "Players", href: "/players" },
		{ label: "Tournaments", href: "/tournaments" },
		{ label: "Matches", href: "/matches" },
		{ label: "Ranking", href: "/ranking" },
		{ label: "Contact", href: "/contact" }
	];

	// Load dashboard statistics from the backend
	async function loadDashboard() {
		try {
			loading = true;
			errorMessage = "";

			const response = await fetch("/");
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to load dashboard");
			}

			dashboard = data;
		} catch (error) {
			console.error(error);
			errorMessage = "Unable to load dashboard statistics.";
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		loadDashboard();
	});
</script>

<section class="home">
	<div class="page-header">
		<h1>Chess Tournament Management System</h1>
		<p>
			A simple web application for managing chess players, tournaments, generated
			matches, and final rankings.
		</p>
	</div>

	{#if loading}
		<section class="card">
			<p class="status-text">Loading dashboard...</p>
		</section>
	{:else if errorMessage}
		<section class="card">
			<p class="error-text">{errorMessage}</p>
		</section>
	{:else if dashboard}
		<section class="stats-grid">
			<article class="card stat-card">
				<span>Players</span>
				<strong>{dashboard.totalPlayers}</strong>
			</article>

			<article class="card stat-card">
				<span>Tournaments</span>
				<strong>{dashboard.totalTournaments}</strong>
			</article>

			<article class="card stat-card">
				<span>Matches</span>
				<strong>{dashboard.totalMatches}</strong>
			</article>

			<article class="card stat-card">
				<span>Top Player</span>
				<strong>{dashboard.topPlayer ? dashboard.topPlayer.name : "None"}</strong>
				<small>{dashboard.topPlayer ? `${dashboard.topPlayer.wins} wins` : "No wins yet"}</small>
			</article>
		</section>
	{/if}

	<section class="card quick-nav">
		<h2 class="section-title">Quick Navigation</h2>

		<div class="quick-links">
			{#each quickLinks as link}
				<a class="btn btn-primary" href={link.href}>{link.label}</a>
			{/each}
		</div>
	</section>
</section>

<style>
	.home {
		display: grid;
		gap: 24px;
	}

	.stats-grid {
		display: grid;
		gap: 20px;
		grid-template-columns: repeat(auto-fit, minmax(min(210px, 100%), 1fr));
	}

	.stat-card {
		display: grid;
		gap: 8px;
	}

	.stat-card span {
		color: #64748b;
		font-size: 14px;
		font-weight: 700;
		text-transform: uppercase;
	}

	.stat-card strong {
		color: #0f2a4a;
		font-size: 34px;
		line-height: 1.2;
		overflow-wrap: anywhere;
	}

	.stat-card small {
		color: #526070;
		font-weight: 700;
	}

	.quick-links {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}

	@media (max-width: 760px) {
		.home {
			gap: 20px;
		}

		.stats-grid {
			grid-template-columns: 1fr;
		}

		.stat-card strong {
			font-size: 30px;
		}

		.quick-links {
			align-items: stretch;
			flex-direction: column;
		}
	}

	.status-text,
	.error-text {
		margin: 0;
	}

	.status-text {
		color: #526070;
	}

	.error-text {
		color: #dc2626;
		font-weight: 700;
	}
</style>
