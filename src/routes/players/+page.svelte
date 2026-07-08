<script>
	let name = $state("");
	let age = $state("");
	let rating = $state("");
	let country = $state("");

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
		} else {
			alert("Failed to add player");
		}
	}
</script>

<h1>Player Management</h1>

<form onsubmit={(e) => { e.preventDefault(); addPlayer(); }}>
	<div>
		<label>Name</label><br>
		<input bind:value={name} type="text" />
	</div>

	<br>

	<div>
		<label>Age</label><br>
		<input bind:value={age} type="number" />
	</div>

	<br>

	<div>
		<label>Rating</label><br>
		<input bind:value={rating} type="number" />
	</div>

	<br>

	<div>
		<label>Country</label><br>
		<input bind:value={country} type="text" />
	</div>

	<br>

	<button type="submit">Add Player</button>
</form>