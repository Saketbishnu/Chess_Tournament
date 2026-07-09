<script>
	let name = $state("");
	let age = $state("");
	let rating = $state("");
	let country = $state("");

	let players = $state([]);

	// Stores the player currently being edited
	let editingPlayerId = $state(null);

	// -------------------------
	// Load all players
	// -------------------------
	async function loadPlayers() {
		const response = await fetch("/players");

		if (response.ok) {
			players = await response.json();
		}
	}

	// -------------------------
	// Add or Update Player
	// -------------------------
	async function savePlayer() {

		// UPDATE PLAYER
		if (editingPlayerId !== null) {

			const response = await fetch("/players", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					id: editingPlayerId,
					name,
					age,
					rating,
					country
				})
			});

			if (response.ok) {

				alert("Player Updated Successfully!");

				editingPlayerId = null;

				name = "";
				age = "";
				rating = "";
				country = "";

				await loadPlayers();

			} else {

				alert("Failed to update player");

			}

			return;
		}

		// ADD PLAYER
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

	// -------------------------
	// Edit Player
	// -------------------------
	function editPlayer(player) {

		editingPlayerId = player.id;

		name = player.name;
		age = player.age;
		rating = player.rating;
		country = player.country;

	}

	// -------------------------
	// Delete Player
	// -------------------------
	async function deletePlayer(id) {

		const confirmDelete = confirm(
			"Are you sure you want to delete this player?"
		);

		if (!confirmDelete) return;

		const response = await fetch("/players", {

			method: "DELETE",

			headers: {
				"Content-Type": "application/json"
			},

			body: JSON.stringify({
				id
			})

		});

		if (response.ok) {

			alert("Player Deleted Successfully!");

			// If currently editing the deleted player
			if (editingPlayerId === id) {
				editingPlayerId = null;

				name = "";
				age = "";
				rating = "";
				country = "";
			}

			await loadPlayers();

		} else {

			alert("Failed to delete player");

		}

	}

	// -------------------------
	// Load Players
	// -------------------------
	$effect(() => {
		loadPlayers();
	});
</script>

<h1>Player Management</h1>

<form
	onsubmit={(e) => {
		e.preventDefault();
		savePlayer();
	}}
>

	<div>
		<label>Name</label><br>
		<input bind:value={name} type="text" required>
	</div>

	<br>

	<div>
		<label>Age</label><br>
		<input bind:value={age} type="number" required>
	</div>

	<br>

	<div>
		<label>Rating</label><br>
		<input bind:value={rating} type="number" required>
	</div>

	<br>

	<div>
		<label>Country</label><br>
		<input bind:value={country} type="text" required>
	</div>

	<br>

	<button type="submit">

		{editingPlayerId !== null
			? "Update Player"
			: "Add Player"}

	</button>

</form>

<hr>

<h2>Players List</h2>

<table border="1" cellpadding="10">

	<thead>

	<tr>

		<th>ID</th>
		<th>Name</th>
		<th>Age</th>
		<th>Rating</th>
		<th>Country</th>
		<th>Edit</th>
		<th>Delete</th>

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

		<td>

			<button
				type="button"
				onclick={() => editPlayer(player)}
			>
				Edit
			</button>

		</td>

		<td>

			<button
				type="button"
				onclick={() => deletePlayer(player.id)}
			>
				Delete
			</button>

		</td>

	</tr>

	{/each}

	</tbody>

</table>