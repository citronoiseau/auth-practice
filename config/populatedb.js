require("dotenv").config();
const { Client } = require("pg");

const SQL = `
CREATE TABLE users (
   id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   username VARCHAR(255) NOT NULL,
   password VARCHAR(255) NOT NULL,
   admin BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE posts (
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
