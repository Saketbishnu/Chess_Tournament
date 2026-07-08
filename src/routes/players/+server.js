import { json } from "@sveltejs/kit";
import { pool } from "$lib/server/db";

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

    } catch (err) {
        console.error(err);

        return json(
            { error: "Failed to add player" },
            { status: 500 }
        );
    }
}