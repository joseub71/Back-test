const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
var request = require('request');
const app = express()
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/americanFootball');
const Schema = mongoose.Schema;
const torneoSchema = new Schema({ type: Schema.Types.Mixed }, { strict : false, _id: false });
const torneoModel = mongoose.model('torneo', torneoSchema);
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

//Uso de file system

app.get('/file/:fileName', (req, res, next) => {
    
    fs.readFile(`files/${req.params.fileName}.json`, 'utf8', function(err,data) {
        if(err)
            res.status(500).send({ menssage: 'Algo salio mal' })
        else
        res.status(200).send(JSON.parse(data))
    });
})


app.post('/file', (req, res, next) => {
    fs.writeFile(`files/${req.body.name}.json`, req.body.content, "utf8", (err) => {
        if (err) throw err;
    
        res.send({ menssage: 'El archivo se creo correctamente' })
    });

})
// 
// Test de sportRadar
app.get('/torneos', (req, res, next) => {
           
    request('http://api.sportradar.us/football-t1/american/en/tournaments.json?api_key=ed2utyf36m636v2424vgtxgj', function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
        var x =  JSON.parse(body).tournaments;
        let info = [];
        x.map((value) => {        
            info.push(request(`http://api.sportradar.us/football-t1/american/en/tournaments/${value.id}/info.json?api_key=ed2utyf36m636v2424vgtxgj`));
            value._id = value.id

            return value;
        });

        Promise.all(info).then(values => { 
            console.log(values);
          });
        // res.send( x);
        
        torneoModel.insertMany(x, function(err, response){
            if (err) res.send({err: err});
            res.send({ response:response });
        })


    });


})


// const test = (req, res, next) => {
//     console.log(req)
// Crear midelware aqui http://expressjs.com/es/guide/using-middleware.html
// } 

// app.use(test)

app.listen(port, () => {
    console.log(`API Corriendo en http://localhost:${port}`)
})