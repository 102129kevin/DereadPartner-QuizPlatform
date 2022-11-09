const StudentModel = require("../models/studentModel");
const QuestionModel = require("../models/questionModel");
let studentModel = new StudentModel;
let questionModel = new QuestionModel;

function shuffle(questionsList) {
    for (let i = questionsList.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = questionsList[i];
        questionsList[i] = questionsList[j];
        questionsList[j] = temp;
    }
}

async function getStudentName(id) {
    let stuData = await studentModel.getStudentData(id);
    let stuName = stuData["name"];
    return stuName;
}

module.exports = class StudentController {


    async renderPage(req, res, next) {
        // 判斷是否有登入
        if (req.session.name) {
            try {
                let stuName = await getStudentName(req.session.name);
                res.render("student", { r_stuName: stuName });
            }
            catch (err) {
                console.log(err);
            }
        }
        else {
            res.redirect("/login");
        }
    };

    async renderQuizPage(req, res, next) {
        // 判斷是否有登入
        if (req.session.name) {
            res.render("quiz");
        }
        else {
            res.redirect("/login");
        }
    };

    async renderTestPage(req, res, next) {
        // 獲取請求單元(1、2..OR ALL)
        let reqUnit = req.params.unit;

        // 判斷是否有登入
        if (req.session.name) {
            res.render("quizTest", { r_unit: reqUnit });
        }
        else {
            res.redirect("/login");
        }
    };

    async updataQuestion(req, res, next) {
        // 獲取請求單元(1、2..OR ALL)
        let reqUnit = req.params.unit;
        let qList;
        // 此函數由頁面發送ajax進行呼叫
        if (reqUnit == "all") {
            qList = await questionModel.getAllQuestionData();
        }
        else {
            qList = await questionModel.getQuestionDataByUnit(parseInt(reqUnit, 10));
        }

        // 打亂題目
        shuffle(qList);
        // 取前10筆題目
        let randomQList = qList.slice(0, 10);
        // 回傳題目資料
        res.json(randomQList);
    }

    async handleAnswer(req, res, next) {

        if (req.session.name) {

            // 接收request(使用者填答資料為json格式)
            let reqAnsList = JSON.parse(req.body["ans"]);

            // 初始化結果陣列(用於response)
            // 需要順便設定4選項、正確選項、使用者選擇選項
            let resultList = reqAnsList.map((ans) => ({
                qId: ans.qId,
                qCorrect: undefined,
                qTopic: undefined
            }))


            // 計算答對題數 
            let resultCorrectNum = 0;

            for (let i = 0; i < reqAnsList.length; i++) {
                // 取得每筆問題的資料
                let qData = await questionModel.getQuestionById(reqAnsList[i].qId);

                // 過濾該問題中正確的選項
                let filtered = qData.options.filter((option) => {
                    if (option.value == true) {
                        return true;
                    }
                });

                // 檢查使用者填寫是否正確，並設定結果陣列-是否正確
                if (reqAnsList[i].answerText == filtered[0].option) {
                    resultList[i].qCorrect = true;
                    resultCorrectNum++;
                }
                else {
                    resultList[i].qCorrect = false;
                }

                // 設定結果陣列-題目
                resultList[i].qTopic = qData.topic;
            }

            try {
                // 渲染
                let stuName = await getStudentName(req.session.name);
                let reqUnit = req.params.unit;
                res.render("quizResult", {
                    r_stuName: stuName,
                    r_resultList: resultList,
                    r_resultCorrectNum: resultCorrectNum,
                    r_unit: reqUnit
                });
            }
            catch (err) {
                console.log(err);
            }
        }
        else {
            res.redirect("/login");
        }

    }

};