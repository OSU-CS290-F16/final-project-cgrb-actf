var fs = require('fs');
var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var classes = require('./class_info.json');

var app = express();
var port = process.env.PORT || 8889;

//Read the source of class page template and compile it with handlebars
//var classPageSource = fs.readFileSync(path.join(__dirname,'public', 'class_template.html'), 'utf8');
//var classPageTemplate = Handlebars.compile(classPageSource);

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars');

app.use('/classes', express.static(path.join(__dirname, 'public')));

app.get('/classes', function(req, res, next) {
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
