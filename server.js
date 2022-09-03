// Load Node modules
let express = require('express');
let path = require('path');
let cors = require('cors');
let corsOption = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
};
// Initialise Express
let app = express();
//config cors
app.use(cors(corsOption));
// Render static files
app.use('/examples', express.static(path.join(__dirname, 'examples')));
app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Port website will run on
app.listen(process.env.PORT || 3000, function() {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});