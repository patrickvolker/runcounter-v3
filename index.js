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

if (process.env.JAWSDB_URL) {
  var db = mysql.createConnection(process.env.JAWSDB_URL);
}
//or local connection
// var db = mysql.createConnection({
//     host: dbHost,
//     user: dbUser,
//     password: dbPassword,
//     database: dbJaws,
//     port: (dbPort || 5000)
// });

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use(cors());

var corsOptions = {
  origin: 'http://patrickvolker.com',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL connected!');
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

//INSERT INTO `opsm2s45yqnsyksc`.`stats` (`id`, `run_date`, `run_length`) VALUES ('82', '2021-02-07', '6.1');
