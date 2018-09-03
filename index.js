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
    // req.body para acceder a la data de los formularios
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
        let x = JSON.parse(body).tournaments;
        let ola = x.map((value) => {        
                value._id = value.id
                return PromiseData(value);
                // var initializePromise = PromiseData(value);
                // return initializePromise.then((result) => {
                //     value.tournamentInfo = result;
                //     console.log(value);
                //     return value;
                // }, function(err) {
                //     console.log(err);
                // })
            });
console.log(ola);
            Promise.all(ola).then(values => { 
                console.log(values);
              });

            // torneoModel.insertMany(value, function(err, response){
            //     if (err) return res.send({err: err});
            //     res.send({ response: response });
            // })

        res.send(ola);
        
      
        })

        function PromiseData(data){
            return new Promise((resolve, reject) => {
                request(`http://api.sportradar.us/football-t1/american/en/tournaments/${data._id}/info.json?api_key=ed2utyf36m636v2424vgtxgj`, (errorT, responseT, bodyT) => {
                    // console.log('error:', errorT); // Print the error if one occurred
                    // console.log('statusCode:', responseT && responseT.statusCode); // Print the response status code if a response was received
                    // console.log('body:', bodyT); // Print the HTML for the Google homepage.
                    if(responseT.statusCode == '200'){
                        resolve(JSON.parse(bodyT));
                    }
                    if (errorT) {
                        reject(errorT);
                    }
                });
            })
        }
    });


// const test = (req, res, next) => {
//     console.log(req)
// Crear midelware aqui http://expressjs.com/es/guide/using-middleware.html
// } 

// app.use(test)

app.listen(port, () => {
    console.log(`API Corriendo en http://localhost:${port}`)
})