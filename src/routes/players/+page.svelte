<script>
let name = $state("");
let age = $state("");
let rating = $state("");
let country = $state("");
</script>

<h1>Player Management</h1>

<form>
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

    <button>Add Player</button>
</form>