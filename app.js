
const express = require('express');
const app = express();
const morgan = require('morgan');
const {success, error, getOneObjOfMap} = require('./functions');
const config = require('./config');

var counters = new Map();
let countersRouter = express.Router();

// trace a supprimer
app.use((req, res, next) => {
        console.log(counters);
        next();
    });

app.use(morgan('dev'))
app.use(express.json()) // for parsing application/json
//app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(config.rootApi+'/counters', countersRouter)

countersRouter.route('/')
    .get((req, res) =>{       
        // retourne tous les compteurs avec les valeurs
        //res.status(200).json(success(strMapToObj(counters)))
        // retourne le nombre et tous les noms des compteurs
        let keys = [...counters.keys()]
        res.status(200).json(success({size: counters.size, counters:keys}))
        } 
    )
    
countersRouter.route('/:id')
    .get((req, res) =>{
        if(counters.has(req.params.id)) { 
            res.status(200).json(success(getOneObjOfMap(counters,req.params.id)))
        } else {
            res.status(500).json(error(`${req.params.id} is not a key`))
        }
    })
    .put((req, res) =>{
        let value = parseInt(req.query.val)
        if(!Number.isInteger(value)) value=0
        console.log(value)
        counters.set(req.params.id, parseInt(value))
        res.status(201).json(success(getOneObjOfMap(counters,req.params.id)))
    })
    .patch((req, res) =>{
        if(counters.has(req.params.id)) {
           
            let value = parseInt(req.query.val)
            if(!Number.isInteger(value))
                value=0
            if(req.query.dec == 'on')
                value = counters.get(req.params.id) - value
            else
                value = counters.get(req.params.id) + value
            counters.set(req.params.id, parseInt(value))
            res.status(201).json(success(getOneObjOfMap(counters,req.params.id)))
           
        } else {
            res.status(500).json(error(`${req.params.id} is not a key`))
        }   
    })
    .delete((req, res) =>{
        if(counters.has(req.params.id)) {   
            counters.delete(req.params.id)
            res.status(200).json(success())
        } else {
            res.status(500).json(error(`${req.params.id} is not a key`))
        }
    })

app.listen(config.port, () => console.log('Started at ' + config.port))

// jeu de test a supprimer
counters.set('counter1', 100) 
counters.set('counter2', 200)
counters.set('counter3', 300)
