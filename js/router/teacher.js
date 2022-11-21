let express = require("express");
let teacherAPI = express.Router();
// let multer = require('multer');
// let upload = multer({ dest: "/public/qPic/" });
let TeacherController = require("../controllers/teacherController");
let teacherController = new TeacherController();

teacherAPI.get("/", teacherController.renderPage);

teacherAPI.post("/addClass", teacherController.addClass);

teacherAPI.get("/addStu/:cID", teacherController.addStu);

teacherAPI.get("/exam", teacherController.renderExamPage);

teacherAPI.get("/examList", teacherController.renderExamListPage);

teacherAPI.post("/exam/addQuestion", teacherController.addQuestion);

teacherAPI.post("/exam/editQuestion", teacherController.editQuestion);

teacherAPI.get("/analyze", teacherController.renderAnalyzePage);

teacherAPI.post("/analyze/getInitData", teacherController.getAnalyzeData);


module.exports = teacherAPI;