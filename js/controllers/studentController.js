const StudentModel = require("../models/studentModel");
const QuestionModel = require("../models/questionModel");
const ExamRecordModel = require("../models/examRecordModel");

let studentModel = new StudentModel;
let questionModel = new QuestionModel;
let examRecordModel = new ExamRecordModel;

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

async function getStudentExRecIDList(id) {
    let stuData = await studentModel.getStudentData(id);
    let stuExRecList = stuData["exRecIDList"];
    return stuExRecList;
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

    renderTestPage(req, res, next) {
        // 獲取請求單元(1、2..OR ALL)
        let reqUnit = req.params.unit;
        let reqUnitPicName = "unit_" + reqUnit;

        // 判斷是否有登入
        if (req.session.name) {
            res.render("quizTest", { r_unit: reqUnit, r_reqUnitPicName: reqUnitPicName });
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

            // 初始化結果陣列(用於response、登記作答紀錄)
            // 需要順便設定4選項、正確選項、使用者選擇選項
            let resultList = reqAnsList.map((ans) => ({
                qId: ans.qId,
                qCorrect: undefined,
                qTopic: undefined,
                qOptions: ans.options,
                qExplain: undefined,
                qAnsText: ans.answerText,
                qUnit: ans.qUnit,
                qImg: ans.qImg
            }))

            // 計算答對題數 
            let resultCorrectNum = 0;

            for (let i = 0; i < reqAnsList.length; i++) {
                // 取得每筆問題的資料(欠改)
                let qData = await questionModel.getQuestionById(reqAnsList[i].qId);

                // 如果使用者選擇選項==目前這個選項
                // 如果這個選項是對的 > 標記綠色
                // 反則(此選項錯) > 標記紅色

                for (let j = 0; j < resultList[i].qOptions.length; j++) {
                    // 先找出正確選項(每一題都會需要)
                    if (resultList[i].qOptions[j].value) {
                        resultList[i].qOptions[j]["color"] = "color-green";
                    }

                    // 再判斷使用者選擇是否正確
                    if (resultList[i].qAnsText == resultList[i].qOptions[j].option) {
                        if (resultList[i].qOptions[j].value) {
                            resultList[i].qCorrect = true;
                            // resultList[i].qOptions[j]["color"] = "color-green";
                            resultCorrectNum++;
                        }
                        else {
                            resultList[i].qCorrect = false;
                            resultList[i].qOptions[j]["color"] = "color-red1";
                        }
                    }
                }

                // 設定結果陣列-題目
                resultList[i].qTopic = qData.topic;

                // 設定詳解
                resultList[i].qExplain = qData.explain;
            }

            try {
                // 獲取所需資訊
                let stuName = await getStudentName(req.session.name);
                let reqUnit = req.params.unit;

                // 儲存作答紀錄
                let exRecId = await examRecordModel.setExamRecord(req, resultCorrectNum, resultList);

                // 確認學生是否參與過測驗
                let stuExRecIDList = await getStudentExRecIDList(req.session.name);
                if (stuExRecIDList) {
                    stuExRecIDList.push(exRecId);
                }
                else {
                    stuExRecIDList = new Array(exRecId);
                }

                // 該作答紀錄id寫入學生資料中
                await studentModel.setExRecList(req.session.name, stuExRecIDList);

                // 渲染
                res.render("quizResult", {
                    r_stuName: stuName,
                    r_resultList: resultList,
                    r_resultCorrectNum: resultCorrectNum,
                    r_unit: reqUnit
                });
            }
            catch (err) {
                console.log(err);
                res.send(err);
            }
        }
        else {
            res.redirect("/login");
        }

    }

    renderReviewPage(req, res, next) {
        if (req.session.name) {
            res.render("review");
        }
        else {
            res.redirect("/login");
        }
    }

    renderReview(req, res, next) {
        // 獲取請求單元(1、2..OR ALL)
        let reqUnit = req.params.unit;
        let reqUnitPicName = "unit_" + reqUnit;

        // 判斷是否有登入
        if (req.session.name) {
            res.render("reviewLook", { r_unit: reqUnit, r_reqUnitPicName: reqUnitPicName });
        }
        else {
            res.redirect("/login");
        }
    }

    async updataReview(req, res, next) {
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

        // 回傳題目資料
        res.json(qList);
    }

    renderStatePage(req, res, next) {
        if (req.session.name) {
            res.render("stu_state");
        }
        else {
            res.redirect("/login");
        }
    }

    async getChartData(req, res, next) {
        let exRecData = await examRecordModel.getExamRecord(req.session.name);

        // 排序日期資料使用自訂排序
        exRecData.sort((prev, next) => {
            let prevDate = new Date(prev.timeInfo);
            let nextDate = new Date(next.timeInfo);

            // return -1 : 回傳"前" , "後"
            // return 1 : 回傳"後" , "前"
            if (prevDate < nextDate) {
                return -1;
            }

            if (prevDate > nextDate) {
                return 1;
            }

            return 0;
        });

        res.send(exRecData);
    }

    renderScanPage(req, res, next) {
        if (req.session.name) {
            res.render("stu_ar");
        }
        else {
            res.redirect("/login");
        }
    }

    renderLearnMapPage(req, res, next) {
        if (req.session.name) {
            // 渲染
            res.render("stu_learnMap");
        }
        else {
            res.redirect("/login")
        }
    }

    async getLearnMap(req, res, next) {

        let exRecList = await examRecordModel.getExamRecord(req.session.name);

        // 具有作答紀錄
        if (exRecList) {

            // 月份對照表
            let month_name = {
                "m01": "January", "m02": "Febrary", "m03": "March", "m04": "April",
                "m05": "May", "m06": "June", "m07": "July", "m08": "Auguest",
                "m09": "September", "m10": "October", "m11": "November", "m12": "December"
            };

            // 學習地圖物件
            let learnMap = {};
            Object.keys(month_name).forEach((key) => {
                learnMap[month_name[key]] = [];
            });

            let timeList = exRecList.map((item) => {
                let date = item["timeInfo"].split(" ");
                return date[0];
            })

            // 產生獨立陣列，並去除重複
            let uniqueDate = timeList.filter((item, index, arr) => {
                return arr.indexOf(item) === index;
            })

            for (let i = 0; i < uniqueDate.length; i++) {
                let dateSplit = uniqueDate[i].split("/");
                let month = month_name["m" + dateSplit[1]];
                learnMap[month].push(dateSplit[2]);
            }
            console.log(learnMap);
            res.send(learnMap);
        }

    };
}    