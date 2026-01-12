const mysql = require("mysql2/promise");

async function test() {
  try {
    const connection = await mysql.createConnection({
      host: "127.0.0.1",
      user: "root",
      password: "root",
      database: "hssc_cet",
      port: 3306,
    });
    console.log("✅ DB connected!");
    await connection.end();
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
  }
}

test();
