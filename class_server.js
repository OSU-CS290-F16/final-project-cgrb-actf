var fs = require('fs');
var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var handlebars = require('handlebars');
var bodyParser = require('body-parser');
//var classes = require('./class_info.json');
//var shellescape = require('shell-escape');
//var child_process = require('child_process');
var MongoClient = require('mongodb').MongoClient;
var update = false;

var app = express();
var port = process.env.PORT || 8889;

var mongoHost = process.env.MONGO_HOST || 'classmongo.engr.oregonstate.edu';
var mongoPort = process.env.MONGO_PORT || 27017;
var mongoUser = process.env.MONGO_USER || 'cs290_morgaalb';
// I shouldn't bake the password into this, but I don't want any problems during the demo
var mongoPassword = process.env.MONGO_PASSWORD || 'uT8NXP2djfFT9H9';
var mongoDBName = process.env.MONGO_DB || 'cs290_morgaalb';
var mongoURL = 'mongodb://' + mongoUser + ':' + mongoPassword + '@' + mongoHost + ':' + mongoPort + '/' + mongoDBName;
var mongoDB;
var classes;
// Local cache of the list of classes.
// This provides two benefits:
// 	1. Do not have to query the DB for every page request
// 	2. Prevents weirdness with mongo async queries
var classCache = [];

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars');

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/classes', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

handlebars.registerHelper('class-list', function(context, options) {
	var links = "";

	classCache.forEach(function(item) {
		links += '<a href="/classes/' + item.code + '">' + item.name + '</a>';
	});
	
	return links;
});

// Run the python script to add a new class
app.post('/create/add', function(req, res) {
  if ( !req.body || !req.body['class-code'] ) {
    res.redirect('/');
  } else {
		// Make sure the class doesn't already exist
		
		var alreadyInCache = false;
				
		classCache.forEach(function(item) {
			if (item.code == req.body['class-code']) {
				alreadyInCache = true;
			}				
		});
		
		if(alreadyInCache) {
			res.render('already-exists');
		} else {
	
			newClass = {
				"code": req.body['class-code'],
				"name": req.body['class-name'],
				"first": req.body['instructor-first'],
				"last": req.body['instructor-last'],
				"email": req.body.email,
				"instructor-id": req.body['instructor-id'],
				"description": req.body.description
			}	
		
			var classes = mongoDB.collection('classes');
			classes.insert(newClass);		
			classCache.push(newClass);
			res.redirect('/classes/' + req.body['class-code']);
		}
	}  
});

app.get('/', function(req, res, next) {
  res.render('index');
});

app.get('/classes/:thisClass', function(req, res, next) {
  //var class_info = classes[req.params.thisClass];
  
	var classes = mongoDB.collection('classes')  
  	var classInfo = classes.findOne({"code": req.params.thisClass}, function(err, document) {
  		console.log(document); 
		if(document) {        
   		res.render('classes', document)
  		} else {
   		next();
		}  		
  	});

});

app.get('/create', function(req, res, next) {
	res.render('create');
});

app.get('/favicon.ico', function(req, res) {
  //do nothing
});

//404
app.get('*', function(req, res) {
  //res.status(404).sendFile(path.join(__dirname, '404.html'));
  res.render('404');
});

/* Connect to to the MongoDB and start up the web server */
MongoClient.connect(mongoURL, function (err, db) {
  	if (err) {
   	console.log("== Unable to make connection to MongoDB Database.")
   	throw err;
  	}
  	mongoDB = db;

	// initialize the class cache
	classes = mongoDB.collection('classes');

	classes.find().each(function(err, item) {
		if(item) {	
			classCache.push(item);
		} else { // cache load complete; start the server up
			app.listen(port, function () {
    		console.log("== Listening on port", port);
  		});
		
		}
	});
  
});
