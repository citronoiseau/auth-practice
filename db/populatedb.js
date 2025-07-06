require("dotenv").config();
const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS users (
   id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   first_name VARCHAR(100) NOT NULL,
   last_name VARCHAR(100) NOT NULL,
   username VARCHAR(255) NOT NULL,
   password VARCHAR(255) NOT NULL,
   membership BOOLEAN NOT NULL DEFAULT false,
   admin BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    title TEXT,
    content TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.DB_STRING,
  });
  try {
    await client.connect();
    await client.query(SQL);
    console.log("Table created and data inserted");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
  console.log("done");
}

main();
