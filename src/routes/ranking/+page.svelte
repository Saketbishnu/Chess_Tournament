<script>
	const rankings = [
		{ rank: 1, player: "Aarav Sharma", wins: 5 },
		{ rank: 2, player: "Meera Iyer", wins: 4 },
		{ rank: 3, player: "Rohan Das", wins: 3 },
		{ rank: 4, player: "Kavya Sen", wins: 2 },
		{ rank: 5, player: "Arjun Nair", wins: 1 }
	];
</script>

<section class="page-header">
	<h1>Rankings</h1>
	<p>Review final player standings and tournament results.</p>
</section>

<section class="card">
	<h2 class="section-title">Final Rankings</h2>

	<div class="table-wrap">
		<table>
			<thead>
				<tr>
					<th>Rank</th>
					<th>Player</th>
					<th>Wins</th>
				</tr>
			</thead>

			<tbody>
				{#each rankings as ranking}
					<tr>
						<td>{ranking.rank}</td>
						<td>{ranking.player}</td>
						<td>{ranking.wins}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
