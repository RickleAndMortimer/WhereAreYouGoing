const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://nx:na@cluster0.owlb6.mongodb.net/db?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
//mongodb functions
function add_schedule(location_obj) {
	client.connect( function(err, db) {
		var dbo = db.db("db");
		dbo.collection("locations").insertOne(location_obj, function(err, res) {
			if (err) throw err;	
			console.log(res);
			console.log("dun");
		})
	});
}
function find_schedule (query) {
	var res;
	client.connect(function(err, db) {
		if (err) throw err;
		var dbo = db.db("db");
		dbo.collection("locations").findOne(query, function(err, result) {
			if (err) throw err;
			console.log(result)
			res = result;
			console.log("ajinba!!!!!")
		})
	});
	return res;
}
function find_schedules_in_period (location_obj) {
	var res;
	client.connect( function(err, db) {
		if (err) throw err;
		var dbo = db.db("db");
		var query = {
			name: location_obj.name,
			time_start: { 
				$gte: location_obj.time_start, 
				$lt: location_obj.time_end
			},
			time_end: { 
				$gte: location_obj.time_start, 
				$lt: location_obj.time_end
			}
		}
		dbo.collection("locations").find(query, function(err, result) {
			if (err) throw err;
			res = result;
			console.log(result);
			console.log("done")
		})
	});
	return res;
}
var d = new Date(2018, 11, 24, 10, 33, 30);
var e = new Date(2018, 11, 24, 10, 35, 30);
var obj = {name: "nathan street",  time_start: d, time_end: e, no_of_people: 10};
find_schedules_in_period(obj);
add_schedule(obj);
find_schedule(obj);
console.log("mon");