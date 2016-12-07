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
	if (mongoDB.classes) {
		mongoDB.classes.find().each(function(err, item) {
			links += '<a href="/classes/' + item.class-code + '">' + item.class-name + '</a>';
		});
		return links;
	} else {
		return "";	
	}
});



// Run the python script to add a new class
app.post('/classes/create/add', function(req, res) {
  
  if ( !req.body || !req.body['class-code'] ) {
    res.redirect('/');
  }

  else {
/*
  // Construct the list of arguments
    args = ['create_class'
      ,'-c', req.body['class-code']
      ,'-r', "'" + req.body['class-name'] + "'"
      ,'-f', req.body['instructor-first'] 
      ,'-l', req.body['instructor-last']
      ,'-e', req.body.email
      ,'-u', req.body['instructor-id']
      ,'-d', "'" + req.body.description + "'"
      ,'-n', 'jupyter.cgrb.oregonstate.local'
      ,'-v', 'latest'
      ,'-m', '8GB'
      ,'-s', '1024']

    // Escape the arguments to prevent injection attacks
    var escapedArgs = shellescape(args);

    var command = '/data/scripts/docker_python/manage_class.py ' + escapedArgs;

    console.log('Creating class');
    console.log('Executing command: ' + command);

    child_process.exec(command, function(error, stdout, stderr) {
      console.log('Command Result: ');
      console.log(JSON.stringify({ error: error,
        stdout: stdout,
        stderr: stderr
      }));
      // on function complete re-render index
      // to give time to build page, db info should be fine
      update = true;
      return res.render('index', { update: true });
      update = false;
    });
  }*/
			MongoDB.classes.insert_one({
				"code": req.body.class-code,
				"name": req.body.class-name,
				"first": req.body.instructor-first,
				"last": req.body.instructor-last,
				"email": req.body.email,
				"instructor-id": req.body.instructor-id,
				"description": req.body.description
			});		
	}  
  
});

app.get('/', function(req, res, next) {
  res.render('index');
});

app.get('/classes/:thisClass', function(req, res, next) {
  //var class_info = classes[req.params.thisClass];
  
	if(mongoDB.classes) {  
  		var classInfo = mongoDB.classes.find({ "code": req.params.thisClass});

  		if(class_info) {        
   		res.render('classes', classInfo)  
  		} else {
   		next();
	  	}
	}
});

app.get('/classes/create', function(req, res,next) {
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

/* Connecto to the MongoDB and start up the web server */
MongoClient.connect(mongoURL, function (err, db) {
  if (err) {
    console.log("== Unable to make connection to MongoDB Database.")
    throw err;
  }
  mongoDB = db;
  app.listen(port, function () {
    console.log("== Listening on port", port);
  });
});
