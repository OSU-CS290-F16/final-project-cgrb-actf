var fs = require('fs');
var path = require('path');
var express = require('express');
var Handlebars = require('handlebars');
var classes = require('./class_info.json');
var app = express();
var port = process.env.PORT || 8889;

//Read the source of class page template and compile it with handlebars
var classPageSource = fs.readFileSync(path.join(__dirname,'public', 'class_template.html'), 'utf8');
var classPageTemplate = Handlebars.compile(classPageSource);

app.use('/classes', express.static(path.join(__dirname, 'public')));


app.get('/classes/:thisClass', function(req, res, next) {
    var class_info = classes[req.params.thisClass];

    if(class_info) {
        
        var content = classPageTemplate(class_info);
        res.send(content);

    } else {

        next();

    }
});

//404
app.get('*', function(req, res) {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.listen(port, function() {
    console.log("==Listening on port", port);
});
