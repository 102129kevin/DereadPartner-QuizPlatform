let express = require("express");
let teacherAPI = express.Router();
let TeacherController = require("../controllers/teacherController");

let teacherController = new TeacherController();

teacherAPI.get("/", teacherController.renderPage);

teacherAPI.post("/addClass", teacherController.addClass);

teacherAPI.get("/addStu/:cID", teacherController.addStu);

module.exports = teacherAPI;