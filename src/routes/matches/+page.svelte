<script>
	let selectedTournament = $state("");
	let tournaments = $state([]);
	let matches = $state([]);
	let message = $state("");

	// Load tournaments and generated matches
	async function loadMatchesPageData() {
		try {
			const response = await fetch("/matches");
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to load matches");
			}

			tournaments = data.tournaments;
			matches = data.matches;
		} catch (error) {
			console.error(error);
			message = error.message;
		}
	}

	// Generate random matches for the selected tournament
	async function generateMatches() {
		message = "";

		try {
			const response = await fetch("/matches", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					tournament_id: selectedTournament
				})
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to generate matches");
			}

			message = data.message;
			await loadMatchesPageData();
		} catch (error) {
			console.error(error);
			message = error.message;
		}
	}

	// Load data when this page opens
	$effect(() => {
		loadMatchesPageData();
	});
</script>

<section class="page-header">
	<h1>Matches</h1>
	<p>Generate random matches for players assigned to a tournament.</p>
</section>

{#if message}
	<p class="message">{message}</p>
{/if}

<div class="stack">
	<section class="card">
		<h2 class="section-title">Generate Matches</h2>

		<div class="form-grid">
			<div class="field">
				<label for="tournament">Tournament</label>
				<select id="tournament" bind:value={selectedTournament}>
					<option value="">Select Tournament</option>
					{#each tournaments as tournament}
						<option value={tournament.id}>{tournament.name}</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="actions">
			<button class="btn btn-primary" type="button" onclick={generateMatches}>
				Generate Matches
			</button>
		</div>
	</section>

	<section class="card">
		<h2 class="section-title">Generated Matches</h2>

		{#if matches.length === 0}
			<p class="empty-text">No matches generated.</p>
		{:else}
			<div class="table-wrap">
				<table>
					<thead>
						<tr>
							<th>Player 1</th>
							<th>Player 2</th>
							<th>Winner</th>
						</tr>
					</thead>

					<tbody>
						{#each matches as match}
							<tr>
								<td>{match.player1_name}</td>
								<td>{match.player2_name}</td>
								<td>{match.winner_name}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>
</div>

<style>
	.empty-text {
		color: #64748b;
		margin: 0;
	}
</style>
