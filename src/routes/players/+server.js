import { json } from "@sveltejs/kit";
import { pool } from "$lib/server/db";

// GET ALL PLAYERS
export async function GET() {
	try {
		const result = await pool.query(
			"SELECT * FROM players ORDER BY id ASC"
		);

		return json(result.rows);

	} catch (err) {

		console.error(err);

		return json(
			{ error: "Failed to fetch players" },
			{ status: 500 }
		);
	}
}

// CREATE PLAYER
export async function POST({ request }) {

	try {

		const { name, age, rating, country } = await request.json();

		const result = await pool.query(
			`INSERT INTO players(name, age, rating, country)
			VALUES($1,$2,$3,$4)
			RETURNING *`,
			[name, age, rating, country]
		);

		return json(result.rows[0], { status: 201 });

	}
	catch (err) {

		console.error(err);

		return json(
			{ error: "Failed to add player" },
			{ status: 500 }
		);

	}

}

// UPDATE PLAYER
export async function PUT({ request }) {

	try {

		const { id, name, age, rating, country } = await request.json();

		const result = await pool.query(
			`UPDATE players
			SET
				name=$1,
				age=$2,
				rating=$3,
				country=$4
			WHERE id=$5
			RETURNING *`,
			[name, age, rating, country, id]
		);

		return json(result.rows[0]);

	}
	catch (err) {

		console.error(err);

		return json(
			{ error: "Failed to update player" },
			{ status: 500 }
		);

	}

}

// DELETE PLAYER
export async function DELETE({ request }) {

	try {

		const { id } = await request.json();

		await pool.query(
			"DELETE FROM players WHERE id=$1",
			[id]
		);

		return json({
			message: "Player Deleted Successfully"
		});

	}
	catch (err) {

		console.error(err);

		return json(
			{ error: "Failed to delete player" },
			{ status: 500 }
		);

	}

}