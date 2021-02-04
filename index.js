require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const app = express();
const cors = require('cors');
const dbHost = process.env.dbHost;
const dbUser = process.env.dbUser;
const dbPassword = process.env.dbPassword;
const dbJaws = process.env.dbJaws;
const dbPort = process.env.dbPort;
const PORT = process.env.PORT;

app.use(cors());
if (process.env.JAWSDB_URL) {
  var db = mysql.createConnection(process.env.JAWSDB_URL);
}

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL connected!');
});

app.get('/stats', (req, res) => {
  const sql = 'SELECT * FROM `stats`';
  db.query(sql, (err, result) => {
    if (err) throw 'Something bad happened...sorry...';
    res.send(result);
  });
});

app.get('/stats/run_total', (req, res) => {
  const sql = 'SELECT SUM(run_length) FROM `stats`';
  db.query(sql, (err, result) => {
    if (err) throw 'Something bad happened...sorry...';
    res.send(result);
  });
});

app.post('/stats', (req, res) => {
  let run_date = req.body.run_date;
  let run_length = req.body.run_length;
  const sql =
    'INSERT INTO `stats` (run_date, run_length) VALUES ("' +
    run_date +
    '", ' +
    run_length +
    ')';
  console.log(sql);
  db.query(sql, (err, result) => {
    if (err) throw 'Something bad happened...sorry...';
    res.send(result);
    console.log('Run posted!');
  });
});

app.listen(process.env.PORT || process.env.dbPort, () =>
  console.log('Online!')
);
