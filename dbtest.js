const db = require('./netlify/functions/db');

db.query('SELECT * FROM problems', (err, result) => {
    console.log(result.rows);
});