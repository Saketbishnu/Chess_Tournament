<script>
	let name = $state("");
	let location = $state("");
	let start_date = $state("");
	let tournaments = $state([]);
	let players = $state([]);
	let assignedPlayerIds = $state([]);
	let selectedTournament = $state(null);
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

	// Clear the selected tournament player assignment section
	function clearSelectedTournament() {
		selectedTournament = null;
		players = [];
		assignedPlayerIds = [];
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

	// Load every player so they can be shown as checkbox options
	async function loadPlayers() {
		try {
			const response = await fetch("/tournaments?players=all");

			if (!response.ok) {
				throw new Error("Failed to load players");
			}

			players = await response.json();
		} catch (error) {
			console.error(error);
			message = "Unable to load players.";
		}
	}

	// Load players already assigned to the selected tournament
	async function loadAssignedPlayers(tournamentId) {
		try {
			const response = await fetch(`/tournaments?tournament_id=${tournamentId}`);

			if (!response.ok) {
				throw new Error("Failed to load assigned players");
			}

			const assignedPlayers = await response.json();
			assignedPlayerIds = assignedPlayers.map((player) => player.id);
		} catch (error) {
			console.error(error);
			message = "Unable to load assigned players.";
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

			if (selectedTournament) {
				const updatedTournament = tournaments.find((tournament) => tournament.id === selectedTournament.id);
				selectedTournament = updatedTournament ?? selectedTournament;
			}
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

	// Select a tournament and show its player assignment checkboxes
	async function selectTournament(tournament) {
		selectedTournament = tournament;
		message = "";

		await loadPlayers();
		await loadAssignedPlayers(tournament.id);
	}

	// Check or uncheck a player for the selected tournament
	function togglePlayer(playerId, checked) {
		if (checked) {
			if (!assignedPlayerIds.includes(playerId)) {
				assignedPlayerIds = [...assignedPlayerIds, playerId];
			}
		} else {
			assignedPlayerIds = assignedPlayerIds.filter((id) => id !== playerId);
		}
	}

	// Save checked players for the selected tournament
	async function saveTournamentPlayers() {
		if (!selectedTournament) {
			message = "Please select a tournament first.";
			return;
		}

		try {
			const response = await fetch("/tournaments", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					action: "save_players",
					tournament_id: selectedTournament.id,
					player_ids: assignedPlayerIds
				})
			});

			if (!response.ok) {
				throw new Error("Failed to save tournament players");
			}

			await loadAssignedPlayers(selectedTournament.id);
			message = "Players saved successfully.";
		} catch (error) {
			console.error(error);
			message = "Unable to save tournament players.";
		}
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

			if (selectedTournament?.id === id) {
				clearSelectedTournament();
			}
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

<section class="page-header">
	<h1>Tournament Management</h1>
	<p>Create tournaments, manage schedules, and assign players from one clean workspace.</p>
</section>

{#if message}
	<p class="message">{message}</p>
{/if}

<div class="stack">
	<section class="card">
		<h2 class="section-title">{editingTournamentId === null ? "Add Tournament" : "Update Tournament"}</h2>

		<form
			onsubmit={(event) => {
				event.preventDefault();
				saveTournament();
			}}
		>
			<div class="form-grid">
				<div class="field">
					<label for="name">Tournament Name</label>
					<input id="name" type="text" bind:value={name} required>
				</div>

				<div class="field">
					<label for="location">Location</label>
					<input id="location" type="text" bind:value={location} required>
				</div>

				<div class="field">
					<label for="start_date">Start Date</label>
					<input id="start_date" type="date" bind:value={start_date} required>
				</div>
			</div>

			<div class="actions">
				<button class="btn btn-success" type="submit">
					{editingTournamentId === null ? "Add Tournament" : "Update Tournament"}
				</button>

				<button class="btn btn-muted" type="button" onclick={clearForm}>Cancel</button>
			</div>
		</form>
	</section>

	<section class="card">
		<h2 class="section-title">Tournaments List</h2>

		<div class="table-wrap">
			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>Tournament Name</th>
						<th>Location</th>
						<th>Start Date</th>
						<th>Players</th>
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
								<button class="btn btn-primary" type="button" onclick={() => selectTournament(tournament)}>
									Add Players
								</button>
							</td>
							<td>
								<button class="btn btn-primary" type="button" onclick={() => editTournament(tournament)}>
									Edit
								</button>
							</td>
							<td>
								<button class="btn btn-danger" type="button" onclick={() => deleteTournament(tournament.id)}>
									Delete
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	{#if selectedTournament}
		<section class="card assign-card">
			<h2 class="section-title">Assign Players</h2>

			<div class="tournament-details">
				<p><strong>ID:</strong> {selectedTournament.id}</p>
				<p><strong>Tournament Name:</strong> {selectedTournament.name}</p>
				<p><strong>Location:</strong> {selectedTournament.location}</p>
				<p><strong>Start Date:</strong> {selectedTournament.start_date}</p>
			</div>

			<h3>Available Players</h3>

			{#if players.length === 0}
				<p class="empty-text">No players available.</p>
			{:else}
				<div class="player-checklist">
					{#each players as player}
						<label>
							<input
								type="checkbox"
								checked={assignedPlayerIds.includes(player.id)}
								onchange={(event) => togglePlayer(player.id, event.currentTarget.checked)}
							>
							<span>{player.name}</span>
							<small>Age: {player.age} | Rating: {player.rating} | Country: {player.country}</small>
						</label>
					{/each}
				</div>

				<div class="actions">
					<button class="btn btn-success" type="button" onclick={saveTournamentPlayers}>
						Save Players
					</button>
				</div>
			{/if}
		</section>
	{/if}
</div>

<style>
	.assign-card h3 {
		color: #0f2a4a;
		margin: 22px 0 12px;
	}

	.tournament-details {
		background: #f8fafc;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		display: grid;
		gap: 12px;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		padding: 16px;
	}

	.tournament-details p {
		margin: 0;
	}

	.player-checklist {
		display: grid;
		gap: 12px;
	}

	.player-checklist label {
		align-items: center;
		background: #f8fafc;
		border: 1px solid #e5e7eb;
		border-radius: 10px;
		display: grid;
		gap: 8px;
		grid-template-columns: auto 1fr;
		padding: 12px;
	}

	.player-checklist input {
		height: 18px;
		width: 18px;
	}

	.player-checklist span {
		color: #0f2a4a;
		font-weight: 700;
	}

	.player-checklist small {
		color: #64748b;
		grid-column: 2;
	}

	.empty-text {
		color: #64748b;
		margin: 0;
	}
</style>
