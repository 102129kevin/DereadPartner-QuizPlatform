let express = require("express");
let studentAPI = express.Router();
let StudentController = require("../controllers/studentController");

let studentController = new StudentController();

studentAPI.get("/", studentController.renderPage);

studentAPI.get("/quiz", studentController.renderQuizPage);

studentAPI.get("/quiz/unit/:unit", studentController.renderTestPage);

studentAPI.get("/quiz/question/:unit", studentController.updataQuestion);

studentAPI.post("/quiz/answer/:unit", studentController.handleAnswer);

module.exports = studentAPI;