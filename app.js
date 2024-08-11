const express = require('express')
const app = express()
const port = 3000

// Get the client
const mysql = require('mysql2/promise');

// Create the connection to database
const connection = mysql.createPool({
    host: 'localhost',
    port: 3308,
    user: 'root',
    database: 'login',
    password: '',
});

// connection.connect()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/login', async(req, res) => {
    // res.send('login!')
    const datos = req.query;
    console.log(datos);
    try {
        const [results, fields] = await connection.query(
            "SELECT * FROM `user` WHERE `usuario` = ? AND `password` = ?", [datos.usuario, datos.password]
        );

        if (results.length > 0) {
            res.status(200).send('Inicio de sesión correcto')
        } else {
            res.status(401).send('Usuario o clave incorrecta')
        }

        console.log(results); // results contains rows returned by server
        console.log(fields); // fields contains extra meta data about results, if available
    } catch (err) {
        console.log(err);
    }
})

app.get('/register', async(req, res) => {
    // res.send('Registro');
    const datos = req.query;
    console.log(datos);

    const register = "INSERT INTO user (usuario, password) VALUES (?,?)";
    try {
        const [results, fields] = await connection.query(
            register, [datos.usuario, datos.password]
        );

        if (results.affectedRows == 1) {
            res.status(200).send('Registro de usuario realizado')
        } else {
            res.status(401).send('Registro incorrecto')
        }

        console.log(results); // results contains rows returned by server
        console.log(fields); // fields contains extra meta data about results, if available
    } catch (err) {
        console.log(err);
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})