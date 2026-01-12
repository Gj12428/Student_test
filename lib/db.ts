import mysql from "mysql2/promise"
import { logger } from "./logger"

let pool: mysql.Pool | null = null

export function getDB() {
  if (pool) return pool

  if (!process.env.DB_HOST) {
    logger.error("DB ENV NOT LOADED")
    return null
  }

  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT || 3306),
    waitForConnections: true,
    connectionLimit: 10,
  })

  logger.info("✅ MySQL pool created")
  return pool
}
