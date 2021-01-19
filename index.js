require('dotenv').config();
const express = require('express');
const mysql =  require('mysql');
const app = express();
const cors = require('cors');
const dbHost = process.env.dbHost;
const dbUser = process.env.dbUser;
const dbPassword = process.env.dbPassword;
const dbHeroku = process.env.dbHeroku;

app.use(cors());

//create connection
const db = mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbHeroku
});

app.use(express.urlencoded({
    extended: true
})
)
app.use(express.json());

//connect
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySQL connected!');
});

app.get('/stats', (req, res) => {
    const sql = 'SELECT * from `stats`';
    db.query(sql, (err, result) => {
        if (err) throw 'something bad happened';
        res.send(result);
    });
});

app.get('/stats/run_total', (req, res) => {
    const sql = 'SELECT run_total FROM stats WHERE run_total ORDER BY id DESC LIMIT 1';
    db.query(sql, (err, result) => {
        if (err) throw 'something bad happened';
        res.send(result);
    });
});

app.post('/stats', (req, res) => {
    //get values from req
    let run_date = req.body.run_date;
    let run_length = req.body.run_length;
    let run_total = req.body.run_total;
       //plug values into sql
       const sql = 'INSERT INTO `stats` (run_date, run_length, run_total) VALUES ("' + run_date + '", ' + run_length + ', ' + run_total + ')';
        console.log(sql);
        db.query(sql, (err, result) => {
        if (err) throw 'something bad happened';
        res.send(result);
        console.log('Run posted!');
    });
});

app.listen(5000, () => console.log('Online!'));


//sql line for inserting new run ---> INSERT INTO `stats` (`id`, `run_date`, `run_length`, `run_total`) VALUES (NULL, '2021-01-08', '6', '48');
//sql line for just getting most recent run_total 'SELECT run_total FROM stats WHERE run_total ORDER BY id DESC LIMIT 1'