const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 3306,
  database: process.env.DB_NAME     || 'sama_avis',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || 'Nguari2006',
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;