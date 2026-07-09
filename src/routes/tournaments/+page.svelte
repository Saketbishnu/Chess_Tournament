<script>
	let name = $state("");
	let location = $state("");
	let start_date = $state("");
	let tournaments = $state([]);
	let editingTournamentId = $state(null);
	let message = $state("");

	// Clear the form and switch back to add mode
	function clearForm() {
		name = "";
		location = "";
		start_date = "";
		editingTournamentId = null;
		message = "";
	}

	// Load all tournaments from the backend
	async function loadTournaments() {
		try {
			const response = await fetch("/tournaments");

			if (!response.ok) {
				throw new Error("Failed to load tournaments");
			}

			tournaments = await response.json();
		} catch (error) {
			console.error(error);
			message = "Unable to load tournaments.";
		}
	}

	// Add a new tournament or update the selected tournament
	async function saveTournament() {
		const tournamentData = {
			name,
			location,
			start_date
		};

		if (editingTournamentId !== null) {
			tournamentData.id = editingTournamentId;
		}

		try {
			const response = await fetch("/tournaments", {
				method: editingTournamentId === null ? "POST" : "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(tournamentData)
			});

			if (!response.ok) {
				throw new Error("Failed to save tournament");
			}

			clearForm();
			await loadTournaments();
		} catch (error) {
			console.error(error);
			message = "Unable to save tournament.";
		}
	}

	// Fill the form with the selected tournament details
	function editTournament(tournament) {
		editingTournamentId = tournament.id;
		name = tournament.name;
		location = tournament.location;
		start_date = tournament.start_date;
		message = "";
	}

	// Delete a tournament after confirmation
	async function deleteTournament(id) {
		const confirmDelete = confirm("Are you sure you want to delete this tournament?");

		if (!confirmDelete) {
			return;
		}

		try {
			const response = await fetch("/tournaments", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ id })
			});

			if (!response.ok) {
				throw new Error("Failed to delete tournament");
			}

			clearForm();
			await loadTournaments();
		} catch (error) {
			console.error(error);
			message = "Unable to delete tournament.";
		}
	}

	// Load tournaments when this page opens
	$effect(() => {
		loadTournaments();
	});
</script>

<h1>Tournament Management</h1>

{#if message}
	<p>{message}</p>
{/if}

<form
	onsubmit={(event) => {
		event.preventDefault();
		saveTournament();
	}}
>
	<div>
		<label for="name">Tournament Name</label><br>
		<input id="name" type="text" bind:value={name} required>
	</div>

	<br>

	<div>
		<label for="location">Location</label><br>
		<input id="location" type="text" bind:value={location} required>
	</div>

	<br>

	<div>
		<label for="start_date">Start Date</label><br>
		<input id="start_date" type="date" bind:value={start_date} required>
	</div>

	<br>

	<button type="submit">
		{editingTournamentId === null ? "Add Tournament" : "Update Tournament"}
	</button>

	<button type="button" onclick={clearForm}>Cancel</button>
</form>

<hr>

<h2>Tournaments List</h2>

<table border="1" cellpadding="10">
	<thead>
		<tr>
			<th>ID</th>
			<th>Tournament Name</th>
			<th>Location</th>
			<th>Start Date</th>
			<th>Edit</th>
			<th>Delete</th>
		</tr>
	</thead>

	<tbody>
		{#each tournaments as tournament}
			<tr>
				<td>{tournament.id}</td>
				<td>{tournament.name}</td>
				<td>{tournament.location}</td>
				<td>{tournament.start_date}</td>
				<td>
					<button type="button" onclick={() => editTournament(tournament)}>
						Edit
					</button>
				</td>
				<td>
					<button type="button" onclick={() => deleteTournament(tournament.id)}>
						Delete
					</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
