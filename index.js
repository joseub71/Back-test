const express = require('express');
const bodyParser = require('body-parser');

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/user', (req, res, next) => {
    // res.end para no enviar nada
    // localhost:3000/user

    res.send({ menssage: 'Ja quien lo diria !!' })
})

app.get('/user/:userId', (req, res, next) => {
    // res.end para no enviar nada
    // localhost:3000/user/5?more=5
    // return next('Ja')
    // Todos los params son siempre obligatorios
    // Castear valores

    let userId = parseInt(req.params.userId)
    let more = parseInt(req.query.more)

    res.status(200).send({ menssage: `Tu id es el numero ${userId + more}` })
})


app.post('/user', (req, res, next) => {
    // res.body para acceder a la data de los formularios
    res.send({ menssage: 'Ja quien lo diria data recibida para guardar!!' })
})

app.put('/user/:userId', (req, res, next) => {
    res.send(200, { menssage: `Ja quien lo diria modificaras el siguiente id = ${req.params.userId}` })
})

app.delete('/user/:userId', (req, res, next) => {
    res.send({ menssage: `Ja quien lo diria eliminaras el siguiente id = ${req.params.userId}` })
})

// const test = (req, res, next) => {
//     console.log(req)
// Crear midelware aqui http://expressjs.com/es/guide/using-middleware.html
// } 

// app.use(test)

app.listen(port, () => {
    console.log(`API Corriendo en http://localhost:${port}`)
})