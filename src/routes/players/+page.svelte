<script>
	let name = $state("");
	let age = $state("");
	let rating = $state("");
	let country = $state("");
	let players = $state([]);
	let editingPlayerId = $state(null);
	let errorMessage = $state("");

	// Clear the form and return to add mode
	function clearForm() {
		name = "";
		age = "";
		rating = "";
		country = "";
		editingPlayerId = null;
		errorMessage = "";
	}

	// Load all players
	async function loadPlayers() {
		try {
			const response = await fetch("/players");

			if (!response.ok) {
				throw new Error("Failed to load players");
			}

			players = await response.json();
		} catch (error) {
			console.error(error);
			errorMessage = "Unable to load players.";
		}
	}

	// Add a new player or update the selected player
	async function savePlayer() {
		const playerData = {
			name,
			age: Number(age),
			rating: Number(rating),
			country
		};

		if (editingPlayerId !== null) {
			playerData.id = editingPlayerId;
		}

		try {
			const response = await fetch("/players", {
				method: editingPlayerId === null ? "POST" : "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(playerData)
			});

			if (!response.ok) {
				throw new Error("Failed to save player");
			}

			clearForm();
			await loadPlayers();
		} catch (error) {
			console.error(error);
			errorMessage = "Unable to save player.";
		}
	}

	// Populate the form with selected player details
	function editPlayer(player) {
		editingPlayerId = player.id;
		name = player.name;
		age = String(player.age);
		rating = String(player.rating);
		country = player.country;
		errorMessage = "";
	}

	// Delete the selected player after confirmation
	async function deletePlayer(id) {
		const shouldDelete = confirm("Are you sure you want to delete this player?");

		if (!shouldDelete) {
			return;
		}

		try {
			const response = await fetch("/players", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ id })
			});

			if (!response.ok) {
				throw new Error("Failed to delete player");
			}

			clearForm();
			await loadPlayers();
		} catch (error) {
			console.error(error);
			errorMessage = "Unable to delete player.";
		}
	}

	// Load players when the page opens
	$effect(() => {
		loadPlayers();
	});
</script>

<h1>Player Management</h1>

{#if errorMessage}
	<p>{errorMessage}</p>
{/if}

<form
	onsubmit={(event) => {
		event.preventDefault();
		savePlayer();
	}}
>
	<div>
		<label for="name">Name</label><br>
		<input id="name" type="text" bind:value={name} required>
	</div>

	<br>

	<div>
		<label for="age">Age</label><br>
		<input id="age" type="number" min="1" bind:value={age} required>
	</div>

	<br>

	<div>
		<label for="rating">Rating</label><br>
		<input id="rating" type="number" min="0" bind:value={rating} required>
	</div>

	<br>

	<div>
		<label for="country">Country</label><br>
		<input id="country" type="text" bind:value={country} required>
	</div>

	<br>

	<button type="submit">
		{editingPlayerId === null ? "Add Player" : "Update Player"}
	</button>

	{#if editingPlayerId !== null}
		<button type="button" onclick={clearForm}>Cancel</button>
	{/if}
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
					<button type="button" onclick={() => editPlayer(player)}>Edit</button>
				</td>
				<td>
					<button type="button" onclick={() => deletePlayer(player.id)}>Delete</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
