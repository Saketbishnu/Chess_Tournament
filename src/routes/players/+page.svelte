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

<section class="page-header">
	<h1>Player Management</h1>
	<p>Add players, update details, and keep the tournament roster organized.</p>
</section>

{#if errorMessage}
	<p class="message">{errorMessage}</p>
{/if}

<div class="stack">
	<section class="card">
		<h2 class="section-title">{editingPlayerId === null ? "Add Player" : "Update Player"}</h2>

		<form
			onsubmit={(event) => {
				event.preventDefault();
				savePlayer();
			}}
		>
			<div class="form-grid">
				<div class="field">
					<label for="name">Name</label>
					<input id="name" type="text" bind:value={name} required>
				</div>

				<div class="field">
					<label for="age">Age</label>
					<input id="age" type="number" min="1" bind:value={age} required>
				</div>

				<div class="field">
					<label for="rating">Rating</label>
					<input id="rating" type="number" min="0" bind:value={rating} required>
				</div>

				<div class="field">
					<label for="country">Country</label>
					<input id="country" type="text" bind:value={country} required>
				</div>
			</div>

			<div class="actions">
				<button class="btn btn-success" type="submit">
					{editingPlayerId === null ? "Add Player" : "Update Player"}
				</button>

				{#if editingPlayerId !== null}
					<button class="btn btn-muted" type="button" onclick={clearForm}>Cancel</button>
				{/if}
			</div>
		</form>
	</section>

	<section class="card">
		<h2 class="section-title">Players List</h2>

		<div class="table-wrap">
			<table>
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
								<button class="btn btn-primary" type="button" onclick={() => editPlayer(player)}>
									Edit
								</button>
							</td>
							<td>
								<button class="btn btn-danger" type="button" onclick={() => deletePlayer(player.id)}>
									Delete
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
</div>
