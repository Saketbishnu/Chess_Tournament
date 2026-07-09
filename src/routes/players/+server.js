import { json } from "@sveltejs/kit";
import { pool } from "$lib/server/db";

function isMissingPlayerData({ name, age, rating, country }) {
	return !name || age === undefined || rating === undefined || !country;
}

// Get all players
export async function GET() {
	try {
		const result = await pool.query("SELECT * FROM players ORDER BY id ASC");

		return json(result.rows, { status: 200 });
	} catch (error) {
		console.error("Failed to fetch players:", error);

		return json({ error: "Failed to fetch players" }, { status: 500 });
	}
}

// Create a new player
export async function POST({ request }) {
	try {
		const { name, age, rating, country } = await request.json();

		if (isMissingPlayerData({ name, age, rating, country })) {
			return json({ error: "Name, age, rating, and country are required" }, { status: 400 });
		}

		const result = await pool.query(
			`INSERT INTO players (name, age, rating, country)
			 VALUES ($1, $2, $3, $4)
			 RETURNING id, name, age, rating, country`,
			[name, Number(age), Number(rating), country]
		);

		return json(
			{ message: "Player created successfully", player: result.rows[0] },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Failed to create player:", error);

		return json({ error: "Failed to create player" }, { status: 500 });
	}
}

// Update an existing player
export async function PUT({ request }) {
	try {
		const { id, name, age, rating, country } = await request.json();

		if (!id) {
			return json({ error: "Player id is required" }, { status: 400 });
		}

		if (isMissingPlayerData({ name, age, rating, country })) {
			return json({ error: "Name, age, rating, and country are required" }, { status: 400 });
		}

		const result = await pool.query(
			`UPDATE players
			 SET name = $1,
				 age = $2,
				 rating = $3,
				 country = $4
			 WHERE id = $5
			 RETURNING id, name, age, rating, country`,
			[name, Number(age), Number(rating), country, Number(id)]
		);

		if (result.rowCount === 0) {
			return json({ error: "Player not found" }, { status: 404 });
		}

		return json(
			{ message: "Player updated successfully", player: result.rows[0] },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Failed to update player:", error);

		return json({ error: "Failed to update player" }, { status: 500 });
	}
}

// Delete a player
export async function DELETE({ request }) {
	try {
		const { id } = await request.json();

		if (!id) {
			return json({ error: "Player id is required" }, { status: 400 });
		}

		const result = await pool.query("DELETE FROM players WHERE id = $1 RETURNING id", [Number(id)]);

		if (result.rowCount === 0) {
			return json({ error: "Player not found" }, { status: 404 });
		}

		return json({ message: "Player deleted successfully" }, { status: 200 });
	} catch (error) {
		console.error("Failed to delete player:", error);

		return json({ error: "Failed to delete player" }, { status: 500 });
	}
}
