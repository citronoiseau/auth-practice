const pool = require('./database');

async function addUser(first_name, last_name, username, password, isMember, isAdmin) {
  await pool.query(
    `INSERT INTO users
      (first_name, last_name, username, password, member, admin) 
     VALUES 
      ($1, $2, $3, $4, $5, $6)`,
    [first_name, last_name, username, password, isMember, isAdmin]
  );
}

async function getUserByUserName(username) {
  const result = await pool.query(
    `SELECT * FROM users WHERE username = $1`,
    [username]
  );
  return result.rows[0]; 
}

async function getUserById(id) {
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
    ORDER BY messages.timestamp DESC
  `);
  return rows;
}

async function getMessageById(id) {
    const result = await pool.query(
    `SELECT * FROM messages WHERE id = $1`,
    [id]
  );
  return result.rows[0]; 
  
}
async function addMessage(title, content, userId) {
    await pool.query(
    `INSERT INTO messages
      (user_id, title, content) 
     VALUES 
      ($1, $2, $3)`,
    [userId, title, content]
  );
}

async function deleteMessage(id) {
   await pool.query(`DELETE FROM messages WHERE id = $1`, [id]);
}

async function giveMembership(id) {
  await pool.query(
    `UPDATE users SET member = TRUE WHERE id = $1`,
    [id]
  );
}

module.exports = {
  addUser, getUserByUserName, getUserById, getAllMessages, addMessage, getMessageById, deleteMessage,  giveMembership
};