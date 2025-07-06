const pool = require('./database');

async function addUser(first_name, last_name, username, password, isAdmin) {
  await pool.query(
    `INSERT INTO users
      (first_name, last_name, username, password, membership, admin) 
     VALUES 
      ($1, $2, $3, $4, FALSE, $5)`,
    [first_name, last_name, username, password, isAdmin]
  );
}

async function findUserByUserName(username) {
  const result = await pool.query(
    `SELECT * FROM users WHERE username = $1`,
    [username]
  );
  return result.rows[0]; 
}

async function findUserById(id) {
  const result = await pool.query(
    `SELECT * FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0]; 
}

async function getAllMessages() {
  const { rows } = await pool.query(`
    SELECT 
      messages.id,
      messages.user_id,
      messages.title,
      messages.content,
      messages.timestamp,
      users.first_name AS first_name,
      users.last_name AS last_name,
      users.username AS username
    FROM messages
    JOIN users ON messages.user_id = users.id
    ORDER BY messages.timestamp
  `);
  return rows;
}

module.exports = {
  addUser, findUserByUserName, findUserById, getAllMessages
};