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

// Definimos el tipo para los params (Next.js 15/16 requiere que sea una Promesa)
type Params = Promise<{ id: string }>;

// --- METODO GET ---
export async function GET(request: Request, { params }: { params: Params }) {
  try {
    // 1. IMPORTANTE: En Next.js 15+, params se debe esperar con 'await'
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID no válido" }, { status: 400 });
    }

    const query = `
      SELECT id, nombre, apellido, nacimiento, dni
      FROM persona
      WHERE id = $1;
    `;

    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: `Persona con ID ${id} no encontrada` },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0], { status: 200 });

  } catch (error) {
    console.error("ERROR SELECT BY ID:", error);
    return NextResponse.json(
      { error: "Error obteniendo persona por ID" },
      { status: 500 }
    );
  }
}

// --- METODO PUT ---
export async function PUT(request: Request, { params }: { params: Params }) {
  try {
    // 1. IMPORTANTE: Esperamos el params
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID no válido" }, { status: 400 });
    }

    const { nombre, apellido, nacimiento, dni } = await request.json();

    if (!nombre || !apellido || !nacimiento || !dni) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const query = `
      UPDATE persona
      SET nombre = $1, apellido = $2, nacimiento = $3, dni = $4
      WHERE id = $5
      RETURNING *;
    `;

    const values = [nombre, apellido, nacimiento, dni, id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: `Persona con ID ${id} no encontrada` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: `Persona con ID ${id} actualizada`, data: result.rows[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("ERROR UPDATE:", error);
    return NextResponse.json(
      { error: "Error al actualizar persona" },
      { status: 500 }
    );
  }
}