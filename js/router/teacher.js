let express = require("express");
let teacherAPI = express.Router();
let TeacherController = require("../controllers/teacherController");

let teacherController = new TeacherController;

teacherAPI.get("/", teacherController.renderPage);

module.exports = teacherAPI;