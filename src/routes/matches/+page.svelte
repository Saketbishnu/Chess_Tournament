<script>
	let selectedTournament = $state("");

	const tournaments = [
		"City Chess Championship",
		"Rapid Masters Cup",
		"Junior Open Tournament"
	];

	const matches = [
		{
			player1: "Aarav Sharma",
			player2: "Nikhil Rao",
			winner: "Pending",
			status: "Not Started"
		},
		{
			player1: "Meera Iyer",
			player2: "Rohan Das",
			winner: "Pending",
			status: "Not Started"
		},
		{
			player1: "Kavya Sen",
			player2: "Arjun Nair",
			winner: "Pending",
			status: "Not Started"
		}
	];
</script>

<section class="page-header">
	<h1>Matches</h1>
	<p>Generate tournament pairings here once the match system backend is ready.</p>
</section>

<div class="stack">
	<section class="card">
		<h2 class="section-title">Generate Matches</h2>

		<div class="form-grid">
			<div class="field">
				<label for="tournament">Tournament</label>
				<select id="tournament" bind:value={selectedTournament}>
					<option value="">Select Tournament</option>
					{#each tournaments as tournament}
						<option value={tournament}>{tournament}</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="actions">
			<button class="btn btn-primary" type="button">Generate Matches</button>
		</div>
	</section>

	<section class="card">
		<h2 class="section-title">Match List</h2>

		<div class="table-wrap">
			<table>
				<thead>
					<tr>
						<th>Player 1</th>
						<th>Player 2</th>
						<th>Winner</th>
						<th>Status</th>
					</tr>
				</thead>

				<tbody>
					{#each matches as match}
						<tr>
							<td>{match.player1}</td>
							<td>{match.player2}</td>
							<td>{match.winner}</td>
							<td>{match.status}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
</div>
