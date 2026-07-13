import { json } from "@sveltejs/kit";
import { pool } from "$lib/server/db";

// GET player rankings calculated from match winners
export async function GET() {
	try {
		const result = await pool.query(
			`SELECT
				p.name,
				p.country,
				p.rating,
				COUNT(m.id) AS wins
			FROM matches m
			INNER JOIN players p ON p.id = m.winner_id
			WHERE m.winner_id IS NOT NULL
			GROUP BY p.id, p.name, p.country, p.rating
			ORDER BY COUNT(m.id) DESC, p.rating DESC`
		);

		return json(result.rows, { status: 200 });
	} catch (error) {
		console.error("Failed to fetch rankings:", error);

		return json(
			{ error: "Failed to fetch rankings" },
			{ status: 500 }
		);
	}
}
