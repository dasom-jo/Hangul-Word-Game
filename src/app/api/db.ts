import mysql from "mysql2/promise";
import { RowDataPacket } from "mysql2";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function query<T extends RowDataPacket[]>(sql: string, params: unknown[] = []): Promise<T> {
  try {
    const [rows] = await pool.execute<T>(sql, params);
    return rows;
  } catch (error) {
    console.error("DB Query Error:", error);
    throw new Error("데이터베이스 쿼리 실행 실패");
  }
}
