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

// Create the tournament_players table if it does not already exist
async function createTournamentPlayersTable() {
	await pool.query(`
		CREATE TABLE IF NOT EXISTS tournament_players (
			id SERIAL PRIMARY KEY,
			tournament_id INT NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
			player_id INT NOT NULL REFERENCES players(id) ON DELETE CASCADE
		)
	`);

	await pool.query(`
		CREATE UNIQUE INDEX IF NOT EXISTS tournament_players_unique
		ON tournament_players (tournament_id, player_id)
	`);
}

// GET tournaments, all players, or players assigned to a tournament
export async function GET({ url }) {
	try {
		await createTournamentsTable();
		await createTournamentPlayersTable();

		const fetchPlayers = url.searchParams.get("players");
		const tournamentId = url.searchParams.get("tournament_id");

		if (fetchPlayers === "all") {
			const playersResult = await pool.query(
				`SELECT id, name, age, rating, country
				FROM players
				ORDER BY id ASC`
			);

			return json(playersResult.rows, { status: 200 });
		}

		if (tournamentId) {
			const assignedPlayersResult = await pool.query(
				`SELECT p.id, p.name, p.age, p.rating, p.country
				FROM players p
				INNER JOIN tournament_players tp ON tp.player_id = p.id
				WHERE tp.tournament_id = $1
				ORDER BY p.id ASC`,
				[tournamentId]
			);

			return json(assignedPlayersResult.rows, { status: 200 });
		}

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

// POST create a new tournament or assign players to a tournament
export async function POST({ request }) {
	try {
		await createTournamentsTable();
		await createTournamentPlayersTable();

		const body = await request.json();
		const { action, id, name, location, start_date, tournament_id, player_ids } = body;

		if (action === "save_players") {
			if (!tournament_id || !Array.isArray(player_ids)) {
				return json(
					{ error: "Tournament id and player ids are required" },
					{ status: 400 }
				);
			}

			const client = await pool.connect();

			try {
				await client.query("BEGIN");
				await client.query(
					"DELETE FROM tournament_players WHERE tournament_id = $1",
					[tournament_id]
				);

				for (const playerId of player_ids) {
					await client.query(
						`INSERT INTO tournament_players (tournament_id, player_id)
						VALUES ($1, $2)
						ON CONFLICT (tournament_id, player_id) DO NOTHING`,
						[tournament_id, playerId]
					);
				}

				await client.query("COMMIT");
			} catch (error) {
				await client.query("ROLLBACK");
				throw error;
			} finally {
				client.release();
			}

			return json(
				{ message: "Tournament players saved successfully" },
				{ status: 200 }
			);
		}

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
		await createTournamentPlayersTable();

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

// DELETE remove a tournament or remove one player from a tournament
export async function DELETE({ request }) {
	try {
		await createTournamentsTable();
		await createTournamentPlayersTable();

		const { id, tournament_id, player_id } = await request.json();

		if (tournament_id && player_id) {
			const result = await pool.query(
				`DELETE FROM tournament_players
				WHERE tournament_id = $1 AND player_id = $2
				RETURNING id`,
				[tournament_id, player_id]
			);

			if (result.rowCount === 0) {
				return json(
					{ error: "Tournament player assignment not found" },
					{ status: 404 }
				);
			}

			return json(
				{ message: "Player removed from tournament successfully" },
				{ status: 200 }
			);
		}

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
