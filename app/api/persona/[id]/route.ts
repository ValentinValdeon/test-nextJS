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

// --- FUNCIÓN DE UTILIDAD PARA EXTRAER EL ID ---
// Se extrae el ID de la URL de la Request.
function extractIdFromRequest(request: Request): string | null {
    try {
        const url = new URL(request.url);
        const pathSegments = url.pathname.split('/');
        // El ID debería ser el último segmento (ej: /api/persona/2 -> '2')
        const id = pathSegments[pathSegments.length - 1]; 
        
        // Verificamos que no sea la carpeta padre 'persona'
        return (id && id !== 'persona' && id.match(/^\d+$/)) ? id : null;
    } catch (e) {
        return null;
    }
}


// --- METODO GET (Usando extractIdFromRequest) ---
// Quitamos { params } de la firma para evitar el error.
export async function GET(request: Request) { 
  try {
    // 1. OBTENEMOS EL ID DIRECTAMENTE DE LA URL
    const id = extractIdFromRequest(request); 

    if (!id) {
      return NextResponse.json(
        { error: "ID de persona no proporcionado en la URL" },
        { status: 400 }
      );
    }
    
    const query = `
      SELECT id, nombre, apellido, nacimiento, dni
      FROM persona
      WHERE id = $1;
    `;

    const result = await pool.query(query, [id]);
    // ... (El resto del manejo de 404/200 es igual)
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

// --- METODO PUT (Usando extractIdFromRequest) ---
// Quitamos { params } de la firma para evitar el error.
export async function PUT(request: Request) {
  try {
    // 1. OBTENEMOS EL ID DIRECTAMENTE DE LA URL
    const id = extractIdFromRequest(request); 
    
    if (!id) {
      return NextResponse.json(
        { error: "ID de persona no proporcionado en la URL" },
        { status: 400 }
      );
    }
    
    const { nombre, apellido, nacimiento, dni } = await request.json();

    if (!nombre || !apellido || !nacimiento || !dni) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // ... (El resto de la lógica SQL se mantiene igual)
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