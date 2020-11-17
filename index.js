const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');

const port = process.env.PORT || 80;
const host = "0.0.0.0";

var app = express();
var upload = multer(); 

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(upload.array());

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://nx:na@cluster0.owlb6.mongodb.net/db?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//express functions
/*website links, request urls, etc below*/
app.get('/',(req, res) => {
	res.status(200);
	res.sendFile(path.join(__dirname+'/html/index.html'));
});
app.get('/submit',(req, res) => {
	res.status(200);
	res.sendFile(path.join(__dirname+'/html/schedule.html'));
});
app.get('/search',(req, res) => {
	res.status(200);
	res.sendFile(path.join(__dirname+'/html/view_map.html'));
});
//retrieves data from a database
app.post('/search_results', async function (req, res) {
	res.status(200);
	await client.connect( async function(err, db) {
		var query = {name: req.body.location, date: req.body.date};
		if (err) throw err;
		var dbo = db.db("db");
		var result = await dbo.collection("locations").find(query).toArray();
		res.send(result);
	});
});
//sends location, time start, time end, into a database
app.post('/submit_result', async function (req, res) {
	res.status(200);
	var time_start = new Date(req.body.date + " " + req.body.time_start);
	var time_end = new Date(req.body.date + " " + req.body.time_end);
	var location_obj = {name: req.body.location, date: req.body.date, time_start: time_start, time_end: time_end, no_of_people: parseInt(req.body.no_of_people)};
	if (validateSubmission(location_obj)) {
		await client.connect( async function(err, db) {
			var dbo = db.db("db");
			await dbo.collection("locations").insertOne(location_obj);
			res.sendFile(path.join(__dirname+'/html/submit_result.html'));
		});
	}
	else {
		res.sendFile(path.join(__dirname+'/html/schedule_error.html'));
	}
});
//returns true if the submission form is clean. false if it isn't
function validateSubmission(location_obj) {
	try {
		if (isNaN(parseInt(location_obj.no_of_people))) {
			return false;
		}
		else if (location_obj.time_start == null || location_obj.time_end == null || location_obj.name == null) {
			return false;
		}
		else {
			return true;
		}
	}
	catch (err) {
		return false;
	}
}
app.listen(port, host);
client.close();