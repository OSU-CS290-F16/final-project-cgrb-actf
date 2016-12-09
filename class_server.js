var fs = require('fs');
var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var handlebars = require('handlebars');
var bodyParser = require('body-parser');
var escape = require('escape-html');
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

// Creates a list of classes for the dropdown.
// This is done as a helper so the layout can use it without having to pass it in from every route
handlebars.registerHelper('class-list', function(context, options) {
	var links = "";

	classCache.forEach(function(item) {
		links += '<a href="/classes/' + escape(item.code) + '">' + escape(item.name) + '</a>';
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


// Update page
app.get('/update/:thisClass', function(req, res, next) {
	var classes = mongoDB.collection('classes');
	var classInfo = classes.findOne({"code": req.params.thisClass}, function(err, document) {
		if(document) {   
			res.render('update', document)
  		} else {
			next();
		}  		
  	});
});

// POST action for the update page
app.post('/update', function(req, res, next) {
  if ( !req.body || !req.body['class-code'] ) {
    res.redirect('/');
  } else {
		var classes = mongoDB.collection('classes')  
		
		// Update the data store
		classes.update(
			{"code": req.body['class-code']},
			{ 
				$set: {
					"name": req.body['class-name'],
					"first": req.body['instructor-first'],
					"last": req.body['instructor-last'],
					"email": req.body.email,
					"instructor-id": req.body['instructor-id'],
					"description": req.body.description
					}
			}		
		);
		
		// Update the local cache		
		classCache.forEach(function(item) {
			if (item.code == req.body['class-code']) {
				item.name = req.body['class-name'];
				item.first = req.body['instructor-first'];
				item.last = req.body['instructor-last'];
				item.email = req.body.email;
				item['instructor-id'] = req.body['instructor-id'];
				item.description = req.body.description;
			}
		});
		
		res.redirect('/classes/' + req.body['class-code']);
	}  
});

// Delete again
app.post('/delete/:thisClass', function(req, res, next) {
	var classes = mongoDB.collection('classes');
  	var classInfo = classes.findOne({"code": req.params.thisClass}, function(err, document) {
		if(document) {
			// Remove from the mongo DB
			classes.remove({"code": req.params.thisClass});			
			
			// Remove from the local cache			
			for(var i = 0; i < classCache.length; i++) {
				if (classCache[i].code == req.params.thisClass) {
					classCache.splice(i, 1);
					break;
				}
			}
			res.render('delete', document)
  		} else {
			next();
		}  		
  	});
});

// Index
app.get('/', function(req, res, next) {
	res.render('index');
});

// Class view
app.get('/classes/:thisClass', function(req, res, next) {
	var classes = mongoDB.collection('classes')  
  	var classInfo = classes.findOne({"code": req.params.thisClass}, function(err, document) {
		if(document) {        
			res.render('classes', document)
  		} else {
			next();
		}  		
  	});

});

// Create page
app.get('/create', function(req, res, next) {
	res.render('create');
});

//404
app.get('*', function(req, res) {
	res.render('404');
});

/* Connect to to the MongoDB and start up the web server */
MongoClient.connect(mongoURL, function (err, db) {
  	if (err) {
		console.log("== Unable to make connection to MongoDB Database.")
		throw err;
  	}
	
	console.log("== Connection established to MongoDB.")
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
