const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'S@1234',
    database: 'sign_up',
    authPlugin: 'mysql_native_password'
});

app.get("/health", function (req, res) {
    res.json("Server is up and running");
});

app.post('/sign_up', async (req, res) => {
    try {
        const sql = "INSERT INTO user_signup (Name, Email, Password) VALUES (?, ?, ?)";
        const values = [
            req.body.Name,
            req.body.Email,
            req.body.Password,
        ];

        const data = await new Promise((resolve, reject) => {
            db.query(sql, values, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});

