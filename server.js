// Load Node modules
var express = require('express');
var path = require('path');
// Initialise Express
var app = express();

// Render static files
app.use('/examples', express.static(path.join(__dirname, 'examples')));
app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Port website will run on
app.listen(process.env.PORT || 3000, function() {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});