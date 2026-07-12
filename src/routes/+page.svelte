<script>
	const featureCards = [
		{
			icon: "👤",
			title: "Player Management",
			text: "Create, update, and organize chess players.",
			href: "/players",
			button: "Manage Players"
		},
		{
			icon: "🏆",
			title: "Tournament Management",
			text: "Create tournaments and assign players.",
			href: "/tournaments",
			button: "Manage Tournaments"
		},
		{
			icon: "♟",
			title: "Match System",
			text: "Prepare match generation workflows.",
			href: "/matches",
			button: "View Matches"
		},
		{
			icon: "🥇",
			title: "Rankings",
			text: "Review final standings and winners.",
			href: "/ranking",
			button: "View Rankings"
		}
	];

	const projectFeatures = [
		"Manage Players",
		"Manage Tournaments",
		"Assign Players to Tournaments",
		"Generate Random Matches",
		"Display Final Rankings"
	];
</script>

<section class="hero page-header">
	<h1>Chess Tournament Management System</h1>
	<p>
		A clean dashboard for managing chess players, tournaments, match planning,
		and rankings in one place.
	</p>
</section>

<section class="feature-grid">
	{#each featureCards as feature}
		<article class="feature-card card">
			<div class="feature-icon">{feature.icon}</div>
			<h2>{feature.title}</h2>
			<p>{feature.text}</p>
			<a class="btn btn-primary" href={feature.href}>{feature.button}</a>
		</article>
	{/each}
</section>

<section class="card features-section">
	<h2 class="section-title">Project Features</h2>

	<div class="feature-list">
		{#each projectFeatures as feature}
			<p>✔ {feature}</p>
		{/each}
	</div>
</section>

<footer class="footer">
	<p>Chess Tournament Management System</p>
</footer>

<style>
	.hero {
		padding: 34px 0 10px;
		text-align: center;
	}

	.hero p {
		margin-left: auto;
		margin-right: auto;
	}

	.feature-grid {
		display: grid;
		gap: 22px;
		grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
		margin: 28px 0;
	}

	.feature-card {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.feature-icon {
		font-size: 36px;
	}

	.feature-card h2 {
		color: #0f2a4a;
		font-size: 22px;
		margin: 0;
	}

	.feature-card p {
		color: #526070;
		line-height: 1.6;
		margin: 0 0 8px;
	}

	.feature-card .btn {
		align-self: flex-start;
	}

	.features-section {
		margin-top: 28px;
	}

	.feature-list {
		display: grid;
		gap: 12px;
		grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
	}

	.feature-list p {
		background: #f8fafc;
		border: 1px solid #e5e7eb;
		border-radius: 10px;
		color: #344256;
		font-weight: 700;
		margin: 0;
		padding: 14px;
	}

	.footer {
		color: #64748b;
		padding: 28px 0 8px;
		text-align: center;
	}
</style>
