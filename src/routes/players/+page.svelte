<script>
	let name = $state("");
	let age = $state("");
	let rating = $state("");
	let country = $state("");

	let players = $state([]);

	async function loadPlayers() {
		const response = await fetch("/players");

		if (response.ok) {
			players = await response.json();
		}
	}

	async function addPlayer() {
		const response = await fetch("/players", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				name,
				age,
				rating,
				country
			})
		});

		if (response.ok) {
			alert("Player Added Successfully!");

			name = "";
			age = "";
			rating = "";
			country = "";

			await loadPlayers();
		} else {
			alert("Failed to add player");
		}
	}

	$effect(() => {
		loadPlayers();
	});
</script>

<h1>Player Management</h1>

<form
	onsubmit={(e) => {
		e.preventDefault();
		addPlayer();
	}}
>
	<div>
		<label>Name</label><br />
		<input bind:value={name} type="text" />
	</div>

	<br />

	<div>
		<label>Age</label><br />
		<input bind:value={age} type="number" />
	</div>

	<br />

	<div>
		<label>Rating</label><br />
		<input bind:value={rating} type="number" />
	</div>

	<br />

	<div>
		<label>Country</label><br />
		<input bind:value={country} type="text" />
	</div>

	<br />

	<button type="submit">Add Player</button>
</form>

<hr />

<h2>Players List</h2>

<table border="1" cellpadding="8">
	<thead>
		<tr>
			<th>ID</th>
			<th>Name</th>
			<th>Age</th>
			<th>Rating</th>
			<th>Country</th>
		</tr>
	</thead>

	<tbody>
		{#each players as player}
			<tr>
				<td>{player.id}</td>
				<td>{player.name}</td>
				<td>{player.age}</td>
				<td>{player.rating}</td>
				<td>{player.country}</td>
			</tr>
		{/each}
	</tbody>
</table>