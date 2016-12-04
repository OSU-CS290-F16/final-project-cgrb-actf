var fs = require('fs');
var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var classes = require('./class_info.json');

var app = express();
var port = process.env.PORT || 8889;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars');

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/classes', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.post('/classes/create/add', function(req, res) {
	console.log('Creating class');
	console.log(req.body);
	if (req.body) {
		console.log(req.body.instructorId + req.body.instructorFirst + req.body.instructorLast + req.body.email + req.body.classCode + req.body.className + req.body.description);
	}
	res.status(200).send();
	//res.send('POST request to the homepage');
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
