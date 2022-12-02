let express = require("express");
let studentAPI = express.Router();
let StudentController = require("../controllers/studentController");

let studentController = new StudentController();

studentAPI.get("/", studentController.renderPage);

studentAPI.get("/quiz", studentController.renderQuizPage);

studentAPI.get("/quiz/unit/:unit", studentController.renderTestPage);

studentAPI.get("/quiz/question/:unit", studentController.updataQuestion);

studentAPI.post("/quiz/answer/:unit", studentController.handleAnswer);

studentAPI.get("/review", studentController.renderReviewPage);

studentAPI.get("/review/unit/:unit", studentController.renderReview);

studentAPI.get("/review/question/:unit", studentController.updataReview);

studentAPI.get("/state", studentController.renderStatePage);

studentAPI.get("/state/chart", studentController.getChartData);

studentAPI.get("/scan", studentController.renderScanPage);

studentAPI.get("/learnMap", studentController.renderLearnMapPage);

studentAPI.get("/learnMap/data", studentController.getLearnMap);

module.exports = studentAPI;