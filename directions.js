const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv').config();
const _ = require('lodash')
const  requestPromise = require("request-promise");
const { PORT, GOOGLE_KEY } = process.env; 
const app = express()

app.use(cors())
app.use(bodyParser.json())

let  cache  = {};

const transit = (params) =>  {

    const url =  `https://maps.googleapis.com/maps/api/directions/json?${params}&key=${GOOGLE_KEY}`
    const headers =  {
	method: 'GET',
	json: true,
	url: url};
    return headers; 
    
}

app.get('/', (req, res) =>  res.send("no-smoke"));
app.get('/cache', (req, res) =>  res.send(cache));
app.get('/' + GOOGLE_KEY, (req,res) => { cache = {}; res.send(cache) })
app.get('/api/transit/:params', (req,res) => {
    const params = req.params.params;
    if (cache[params]) {
	const result = cache[params]; 
	result['from-cache'] = true;
	res.send(result)
    }
    if (!cache[params]) {
    	requestPromise(transit(req.params.params))
	    .then(x => {
		cache[params] = x; 
		res.send(x);
	    })
    }
})

app.listen(PORT);
console.log(`listening on ${PORT}`);
