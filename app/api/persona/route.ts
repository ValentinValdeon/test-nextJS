import { NextResponse } from "next/server";
import pg from "pg";

const { PG_HOST, PG_PORT, PG_USER, PG_PASSWORD, PG_DATABASE } = process.env;

const pool = new pg.Pool({
  host: PG_HOST,
  port: Number(PG_PORT),
  user: PG_USER,
  password: PG_PASSWORD,
  database: PG_DATABASE,
});

export async function POST(req: Request) {
  try {
    const { nombre, apellido, nacimiento, dni } = await req.json();

    if (!nombre || !apellido || !nacimiento || !dni) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO persona (nombre, apellido, nacimiento, dni)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [nombre, apellido, nacimiento, dni];

    const result = await pool.query(query, values);

    return NextResponse.json(
      { message: "Persona creada", data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("ERROR INSERT:", error);
    return NextResponse.json(
      { error: "Error al insertar persona" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const query = `
      SELECT id, nombre, apellido, nacimiento, dni
      FROM persona
      ORDER BY id DESC;
    `;

    const result = await pool.query(query);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("ERROR SELECT:", error);
    return NextResponse.json(
      { error: "Error obteniendo personas" },
      { status: 500 }
    );
  }
}