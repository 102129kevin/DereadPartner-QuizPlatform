let express = require("express");
let loginAPI = express.Router();
let LoginController = require("../controllers/loginController");

function checkAuth(req, res, next) {
    if (req.session.name != "") {
        console.log("authenticated");
        next();
    }
    else {
        console.log("not authenticated!");
    }
}

let loginController = new LoginController();

loginAPI.get("/", loginController.renderPage);

loginAPI.post("/post", loginController.Login);

loginAPI.get("/logout", checkAuth, loginController.logout);

module.exports = loginAPI;