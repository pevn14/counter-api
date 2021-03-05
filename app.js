
const express = require('express');
const app = express();
const morgan = require('morgan');
const {success, error} = require('./functions');
const config = require('./config');

var counters = new Map();
counters.set('counter1', 100) //jeu de test
counters.set('counter2', 200)
counters.set('counter3', 300)

let countersRouter = express.Router();

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
            res.status(200).json(success({counter1: counters.get('counter1')}))
        } else {
            res.status(500).json(error(`${req.params.id} is not a key`))
        }
    })
    



app.listen(config.port, () => console.log('Started at ' + config.port))

//counters.forEach((v, k, m) => console.log(`${k}, ${v}`));
   
console.log(counters);