// Load Node modules
let express = require('express');
let session = require("express-session");
let path = require('path');
let cors = require('cors');

//Load Router
let loginAPI = require("./js/router/login");
let regAPI = require("./js/router/register");
let teacherAPI = require("./js/router/teacher");

//cors
let corsOption = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
};

// Initialise Express
let app = express();

//set ejs
app.set('view engine', 'ejs'); //設定要使用的範本引擎，這邊用ejs
app.set('views', path.join(__dirname, '/views'))  //設定檔案所在的目錄

// middleware中介軟體設置
//config cors
app.use(cors(corsOption));

// bodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//session
app.use(session({
    secret: "arnftWEBFrontendBackEndchallenge",
    name: "user",
    saveUninitialized: false,
    resave: true,
    cookie: {
        maxAge: 1000 * 60 * 60 //暫存session一小時
    }
}));

// Render static files
app.use('/examples', express.static(path.join(__dirname, 'examples')));
app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use('/js', express.static(path.join(__dirname, 'js')));

//Add Router
app.use("/login", loginAPI);
app.use("/reg", regAPI);
app.use("/teacher", teacherAPI);

//get Index request
app.get('/', (req, res) => {
    // console.log(req.session);
    // console.log(req.sessionID);
    // console.log("----a round!!!!!!!!!!!!----");
    console.log("logged:", req.session.name);
    res.render("logged", { name: req.session.name });
})

// Port website will run on
app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});