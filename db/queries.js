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

module.exports = {
  addUser, findUserByUserName
};