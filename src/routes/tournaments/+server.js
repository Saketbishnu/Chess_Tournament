import { json } from "@sveltejs/kit";
import { pool } from "$lib/server/db";

// Create the tournaments table if it does not already exist
async function createTournamentsTable() {
	await pool.query(`
		CREATE TABLE IF NOT EXISTS tournaments (
			id SERIAL PRIMARY KEY,
			name VARCHAR(100) NOT NULL,
			location VARCHAR(100) NOT NULL,
			start_date DATE NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`);
}

// GET all tournaments
export async function GET() {
	try {
		await createTournamentsTable();

		const result = await pool.query(
			`SELECT
				id,
				name,
				location,
				TO_CHAR(start_date, 'YYYY-MM-DD') AS start_date
			FROM tournaments
			ORDER BY id ASC`
		);

		return json(result.rows, { status: 200 });
	} catch (error) {
		console.error("Failed to fetch tournaments:", error);

		return json(
			{ error: "Failed to fetch tournaments" },
			{ status: 500 }
		);
	}
}

// POST create a new tournament
export async function POST({ request }) {
	try {
		await createTournamentsTable();

		const { name, location, start_date } = await request.json();

		if (!name || !location || !start_date) {
			return json(
				{ error: "Tournament name, location, and start date are required" },
				{ status: 400 }
			);
		}

		const result = await pool.query(
			`INSERT INTO tournaments (name, location, start_date)
			VALUES ($1, $2, $3)
			RETURNING id, name, location, TO_CHAR(start_date, 'YYYY-MM-DD') AS start_date`,
			[name, location, start_date]
		);

		return json(
			{
				message: "Tournament added successfully",
				tournament: result.rows[0]
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Failed to add tournament:", error);

		return json(
			{ error: "Failed to add tournament" },
			{ status: 500 }
		);
	}
}

// PUT update an existing tournament
export async function PUT({ request }) {
	try {
		await createTournamentsTable();

		const { id, name, location, start_date } = await request.json();

		if (!id || !name || !location || !start_date) {
			return json(
				{ error: "Tournament id, name, location, and start date are required" },
				{ status: 400 }
			);
		}

		const result = await pool.query(
			`UPDATE tournaments
			SET name = $1,
				location = $2,
				start_date = $3
			WHERE id = $4
			RETURNING id, name, location, TO_CHAR(start_date, 'YYYY-MM-DD') AS start_date`,
			[name, location, start_date, id]
		);

		if (result.rowCount === 0) {
			return json(
				{ error: "Tournament not found" },
				{ status: 404 }
			);
		}

		return json(
			{
				message: "Tournament updated successfully",
				tournament: result.rows[0]
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Failed to update tournament:", error);

		return json(
			{ error: "Failed to update tournament" },
			{ status: 500 }
		);
	}
}

// DELETE remove a tournament
export async function DELETE({ request }) {
	try {
		await createTournamentsTable();

		const { id } = await request.json();

		if (!id) {
			return json(
				{ error: "Tournament id is required" },
				{ status: 400 }
			);
		}

		const result = await pool.query(
			"DELETE FROM tournaments WHERE id = $1 RETURNING id",
			[id]
		);

		if (result.rowCount === 0) {
			return json(
				{ error: "Tournament not found" },
				{ status: 404 }
			);
		}

		return json(
			{ message: "Tournament deleted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Failed to delete tournament:", error);

		return json(
			{ error: "Failed to delete tournament" },
			{ status: 500 }
		);
	}
}
