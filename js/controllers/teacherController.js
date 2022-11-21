const TeacherModel = require("../models/teacherModel");
const ClassModel = require("../models/classModel");
const StudentModel = require("../models/studentModel");
const QuestionModel = require("../models/questionModel");
const ExamRecordModel = require("../models/examRecordModel");
const path = require("path");
const fs = require("fs");

let teacherModel = new TeacherModel;
let classModel = new ClassModel;
let studentModel = new StudentModel;
let questionModel = new QuestionModel;
let examRecordModel = new ExamRecordModel;

// 也許可改到classModel
async function getClassInfo(trData) {
    let classInfo;

    if (trData["cIDList"]) {
        classInfo = await teacherModel.getClassCMember(trData["cIDList"]);
    }
    else {
        classInfo = undefined;
    }

    return classInfo;
}

function isStuExistCMember(stuID, cMemberList) {
    return (cMemberList.includes(stuID));
}

function isKeyExist(obj, key) {
    return (key in obj);
}

async function storeImg(file) {
    let time = new Date();
    let newFileName = time.getTime() + "_" + file.name;
    let picPath = path.join(__dirname, "../../public/qPic", newFileName);

    // 搬移檔案
    await file.mv(picPath, (error) => {
        if (error) {
            res.status(500).send(err);
        }
    });

    return newFileName;
}

module.exports = class TeacherController {

    // 加上錯誤判斷與思考 (思考究竟空值的欄位是用undefined 還是 刪掉)
    // 有老師 但根本沒班級(老師還沒新增班級)
    // 砍班級列表 > 這個應該算很後面 
    // (if cIDList.length == 0 --> 砍掉cIDList欄位)
    // 有班級 但是沒有cMember(老師還沒新增學生)
    // 有cMember 沒有學生
    // 砍學生 > 這個應該算很後面 
    // (if cMemeber.length == 0 --> 砍掉cMember欄位)

    async renderPage(req, res, next) {
        if (req.session.name) {
            try {
                let trData = await teacherModel.getTeacherData(req);
                let trName = trData["name"];
                trData = teacherModel.preprocessTeacherData(trData);
                let classInfo = await getClassInfo(trData);

                res.render("teacher", { r_trName: trName });
            }
            catch (err) {
                console.log(err);
            }
        }
        else {
            res.redirect("/login");
        }

    };

    async addClass(req, res, next) {
        let addClassName = req.body["newClassName"];

        // 檢查是否已有此班級
        let classExist = await classModel.checkClassExist(addClassName);

        if (!classExist) {
            try {
                // 老師資料預處理
                let trData = await teacherModel.getTeacherData(req);
                trData = teacherModel.preprocessTeacherData(trData);

                let cId = await classModel.setClass(addClassName);
                // cId回寫至class中該doc的欄位(cId)，以利後續查詢
                await classModel.setClassCID(cId);
                // 新增至該教師cIdList
                await teacherModel.addcIdList(req, cId, trData);
                res.redirect("/teacher");
            }
            catch (err) {
                console.log(err);
                res.send(err);
            }
        }
        else {
            res.send("提醒使用這班級有啦，不給你新增");
        }

    }

    async addStu(req, res, next) {
        // 目前ejs採用get方法埋下cID，可思考如何改用post
        let addStuID = req.query.newStuId;
        let reqCID = req.params.cID;

        try {
            let stuData = await studentModel.getStudentData(addStuID);
            // 如果getDoc沒查到會回傳undefined
            if (stuData) {
                let classData = await classModel.getClassData(reqCID);
                // 判斷學生是否存在於該班級的名單裡面
                if (!isStuExistCMember(addStuID, classData["cMember"])) {
                    // 判斷學生是否存在cid屬性 代表還沒有班級
                    if (!isKeyExist(stuData, "cID")) {
                        classData["cMember"].push(addStuID);
                        // 先新增student到班級class名單
                        await classModel.setClassCMember(reqCID, classData["cMember"]);
                        // 在該位同學上新增cID屬性
                        await studentModel.setStudentCID(addStuID, reqCID);
                        res.redirect("/teacher");

                    }
                    else {
                        res.send("這位同學已經在其他班級囉");
                    }
                }
                else {
                    res.send("該學生已存在這個班級囉");
                }
            }
            else {
                res.send("查無此人");
            }
        }
        catch (err) {
            console.log(err);
            res.send("查詢異常，請查看console(teacherController)");
        }
    }

    renderExamPage(req, res, next) {
        if (req.session.name) {
            res.render("teacherExam");
        }
        else {
            res.redirect("/login");
        }
    }

    async addQuestion(req, res, next) {
        try {
            // 設置此筆問題資料
            let qID = await questionModel.setQuestion(req);
            console.log(qID);

            // 取得檔案
            if (req.files) {
                let qImage = req.files.qImg;
                let fileName = await storeImg(qImage);
                await questionModel.updateQuestionImg(qID, fileName);
            }

            // 新增詳解
            // if(req.body["explain"]){
            //     await questionModel.updateQuestionExplain();
            // }

            res.send("新增題目成功");
        }
        catch (err) {
            res.send(err);
        }

    }

    async editQuestion(req, res, next) {

        try {
            // 設置此筆問題資料
            let qID = await questionModel.updateQuestion(req);
            console.log(qID);

            // 取得圖片狀態
            let prev = req.body["prevImg"];
            let next = req.body["nextImg"];
            let addPic = req.body["addPic"] == "true";
            let deletePic = req.body["deletePic"] == "true";
            let picURL = "../../public/qPic";
            let newPicName = "";

            // 刪除圖片
            if (deletePic) {
                // 舊圖片網址
                let prevURL = path.join(__dirname, picURL, prev);
                // 刪除舊圖片
                fs.unlink(prevURL, (err) => {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    console.log(prev + "->被刪除");
                })

                // 更新資料庫欄位
                await questionModel.updateQuestionImg(qID, "");
            }

            // 新增圖片
            if (addPic) {
                // 儲存圖片
                let qImage = req.files.qImg;
                let fileName = await storeImg(qImage);
                // 更新資料庫欄位
                await questionModel.updateQuestionImg(qID, fileName);
                newPicName = fileName;
            }

            res.send(newPicName);
        }
        catch (err) {
            console.log(err);
            res.send("sometThing error...")
        }

    }

    async renderExamListPage(req, res, next) {
        if (req.session.name) {
            // 取得教師所出過題目
            let qData = await questionModel.getQuestionBytID(req.session.name);

            // 單元
            let units = qData.map((q) => {
                let unit = [];
                for (let i = 0; i < 4; i++) {
                    if ((q["unit"] - 1) == (i)) {
                        unit.push("selected");
                    }
                    else {
                        unit.push("");
                    }
                }
                return unit;
            })

            // 正確選項
            let correctChoices = qData.map((q) => {
                let correctChoice = [];
                q.options.forEach(option => {
                    if (option.value) {
                        correctChoice.push("selected");
                    }
                    else {
                        correctChoice.push("");
                    }
                })
                return correctChoice;
            });

            // 渲染
            res.render("teacherExamList", {
                r_qData: qData,
                r_units: units,
                r_correctChoices: correctChoices
            });
        }
        else {
            res.redirect("/login");
        }
    }

    renderAnalyzePage(req, res, next) {
        if (req.session.name) {
            res.render("teacherAnalyze");
        }
        else {
            res.redirect("/login");
        }
    }

    async getAnalyzeData(req, res, next) {
        try {
            let classStudentData = await studentModel.getStudentsDataByTID(req.session.name);
            let analyzeData = classStudentData.map((data) => ({
                sID: data.sID,
                name: data.name,
                barData: undefined,
                radarData: undefined,
                totalRate: undefined,
                totalNum: undefined,
                totalQNum: undefined,
                lastTestTime: undefined,
                unitNum: undefined
            }));

            for (let i = 0; i < analyzeData.length; i++) {
                if (classStudentData[i].exRec) {
                    let stat = await examRecordModel.calcStudentExamRecords(classStudentData[i].exRec);
                    analyzeData[i].barData = stat.barData;
                    analyzeData[i].radarData = stat.radarData;
                    analyzeData[i].totalRate = stat.totalRate;
                    analyzeData[i].totalNum = stat.totalNum;
                    analyzeData[i].totalQNum = stat.totalQNum;
                    analyzeData[i].lastTestTime = stat.lastTestTime;
                    analyzeData[i].unitNum = stat.unitNum;
                }
            };

            res.send(analyzeData);
        }
        catch (err) {
            console.log(err);
            res.send(err);
        }

    }
};