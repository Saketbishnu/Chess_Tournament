import { json } from "@sveltejs/kit";
import { pool } from "$lib/server/db";

// GET dashboard statistics for the home page
export async function GET() {
	try {
		const playersResult = await pool.query("SELECT COUNT(*) FROM players");
		const tournamentsResult = await pool.query("SELECT COUNT(*) FROM tournaments");
		const matchesResult = await pool.query("SELECT COUNT(*) FROM matches");

		const topPlayerResult = await pool.query(
			`SELECT
				p.name,
				p.country,
				p.rating,
				COUNT(m.id) AS wins
			FROM matches m
			INNER JOIN players p ON p.id = m.winner_id
			WHERE m.winner_id IS NOT NULL
			GROUP BY p.id, p.name, p.country, p.rating
			ORDER BY COUNT(m.id) DESC, p.rating DESC
			LIMIT $1`,
			[1]
		);

		const topPlayer = topPlayerResult.rows[0]
			? {
					name: topPlayerResult.rows[0].name,
					wins: Number(topPlayerResult.rows[0].wins)
				}
			: null;

		return json(
			{
				totalPlayers: Number(playersResult.rows[0].count),
				totalTournaments: Number(tournamentsResult.rows[0].count),
				totalMatches: Number(matchesResult.rows[0].count),
				topPlayer
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Failed to fetch dashboard statistics:", error);

		return json(
			{ error: "Failed to fetch dashboard statistics" },
			{ status: 500 }
		);
	}
}
