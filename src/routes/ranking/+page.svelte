<script>
	let rankings = $state([]);
	let message = $state("");

	// Load rankings when the page opens
	async function loadRankings() {
		try {
			const response = await fetch("/ranking");
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to load rankings");
			}

			rankings = data;
			message = "";
		} catch (error) {
			console.error(error);
			message = error.message;
		}
	}

	$effect(() => {
		loadRankings();
	});
</script>

<section class="page-header">
	<h1>Rankings</h1>
	<p>Review player standings calculated from generated match winners.</p>
</section>

{#if message}
	<p class="message">{message}</p>
{/if}

<section class="card">
	<h2 class="section-title">Ranking Table</h2>

	{#if rankings.length === 0}
		<p class="empty-text">No ranking available.</p>
	{:else}
		<div class="table-wrap">
			<table>
				<thead>
					<tr>
						<th>Rank</th>
						<th>Player</th>
						<th>Country</th>
						<th>Rating</th>
						<th>Wins</th>
					</tr>
				</thead>

				<tbody>
					{#each rankings as ranking, index}
						<tr>
							<td>{index + 1}</td>
							<td>{ranking.name}</td>
							<td>{ranking.country}</td>
							<td>{ranking.rating}</td>
							<td>{ranking.wins}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</section>

<style>
	.empty-text {
		color: #64748b;
		margin: 0;
	}
</style>
