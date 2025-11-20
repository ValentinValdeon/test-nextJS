import { Pool } from "pg";

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT) || 5432,
});

export async function testConnection() {
    console.log("Password cargada:", process.env.PGPASSWORD);
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Conexion OK:", res.rows[0]);
    return true;
  } catch (err) {
    console.error("Error de conexion:", err);
    return false;
  }
}

export default pool;
