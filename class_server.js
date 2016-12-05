var fs = require('fs');
var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var classes = require('./class_info.json');
var shellescape = require('shell-escape');
var child_process = require('child_process');

var app = express();
var port = process.env.PORT || 8889;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars');

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/classes', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Run the python script to add a new class
app.post('/classes/create/add', function(req, res) {
	if (req.body 
			&& req.body.classCode
			&& req.body.className
			&& req.body.instructorFirst 
			&& req.body.instructorLast
			&& req.body.email
			&& req.body.instructorId
			&& req.body.description)
	{
		// Construct the list of arguments
		args = ['create_class'
			,'-c', req.body.classCode
			,'-r', req.body.className
			,'-f', req.body.instructorFirst 
			,'-l', req.body.instructorLast
			,'-e', req.body.email
			,'-u', req.body.instructorId
			,'-d', req.body.description]
			
		// Escape the arguments to prevent injection attacks
		var escapedArgs = shellescape(args);
		
		var command = 'manage_class.py ' + escapedArgs;
		
		console.log('Creating class');
		console.log('Executing command: ' + command);
		
		child_process.exec(command, function(error, stdout, stderr) {
			res.json({
					error: error,
					stdout: stdout,
					stderr: stderr
			});
		});
	} else {
		res.status(500).send();
	}
	
});

app.get('/', function(req, res, next) {
	res.render('index');
});

app.get('/classes/:thisClass', function(req, res, next) {
	var class_info = classes[req.params.thisClass];

    if(class_info) {        
		res.render('classes', class_info)  
    } else {
        next();
    }
});

app.get('/classes/create', function(req, res,next) {
	res.render('create');
});

//404
app.get('*', function(req, res) {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.listen(port, function() {
    console.log("==Listening on port", port);
});
