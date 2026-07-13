import { json } from "@sveltejs/kit";
import { pool } from "$lib/server/db";

// Randomly reorder players before making pairs
function shufflePlayers(players) {
	return [...players].sort(() => Math.random() - 0.5);
}

// GET all tournaments and all generated matches
export async function GET() {
	try {
		const tournamentsResult = await pool.query(
			`SELECT id, name
			FROM tournaments
			ORDER BY id ASC`
		);

		const matchesResult = await pool.query(
			`SELECT
				m.id,
				m.tournament_id,
				t.name AS tournament_name,
				p1.name AS player1_name,
				p2.name AS player2_name,
				w.name AS winner_name
			FROM matches m
			INNER JOIN tournaments t ON t.id = m.tournament_id
			INNER JOIN players p1 ON p1.id = m.player1_id
			INNER JOIN players p2 ON p2.id = m.player2_id
			INNER JOIN players w ON w.id = m.winner_id
			ORDER BY m.id ASC`
		);

		return json(
			{
				tournaments: tournamentsResult.rows,
				matches: matchesResult.rows
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Failed to load matches page data:", error);

		return json(
			{ error: "Failed to load matches page data" },
			{ status: 500 }
		);
	}
}

// POST generate random matches for a tournament
export async function POST({ request }) {
	try {
		const { tournament_id } = await request.json();

		if (!tournament_id) {
			return json(
				{ error: "Tournament is required" },
				{ status: 400 }
			);
		}

		const playersResult = await pool.query(
			`SELECT p.id, p.name
			FROM players p
			INNER JOIN tournament_players tp ON tp.player_id = p.id
			WHERE tp.tournament_id = $1
			ORDER BY p.id ASC`,
			[tournament_id]
		);

		const assignedPlayers = playersResult.rows;

		if (assignedPlayers.length === 0) {
			return json(
				{ error: "Tournament must contain at least 1 player." },
				{ status: 400 }
			);
		}

		const shuffledPlayers = shufflePlayers(assignedPlayers);
		const byePlayer = shuffledPlayers.length % 2 === 1 ? shuffledPlayers.pop() : null;
		const generatedMatches = [];
		const client = await pool.connect();

		try {
			await client.query("BEGIN");

			// Replace matches only for the selected tournament
			await client.query(
				"DELETE FROM matches WHERE tournament_id = $1",
				[tournament_id]
			);

			for (let index = 0; index < shuffledPlayers.length; index += 2) {
				const player1 = shuffledPlayers[index];
				const player2 = shuffledPlayers[index + 1];
				const winner = Math.random() < 0.5 ? player1 : player2;

				const matchResult = await client.query(
					`INSERT INTO matches (tournament_id, player1_id, player2_id, winner_id)
					VALUES ($1, $2, $3, $4)
					RETURNING id`,
					[tournament_id, player1.id, player2.id, winner.id]
				);

				generatedMatches.push({
					id: matchResult.rows[0].id,
					tournament_id,
					player1_name: player1.name,
					player2_name: player2.name,
					winner_name: winner.name
				});
			}

			await client.query("COMMIT");
		} catch (error) {
			await client.query("ROLLBACK");
			throw error;
		} finally {
			client.release();
		}

		const message = byePlayer
			? `Matches generated successfully. ${byePlayer.name} received a BYE this round.`
			: "Matches generated successfully.";

		return json(
			{
				message,
				matches: generatedMatches,
				byePlayer: byePlayer ? byePlayer.name : null
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Failed to generate matches:", error);

		return json(
			{ error: "Failed to generate matches" },
			{ status: 500 }
		);
	}
}
