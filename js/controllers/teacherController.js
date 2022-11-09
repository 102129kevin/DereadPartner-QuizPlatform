const TeacherModel = require("../models/teacherModel");
const ClassModel = require("../models/classModel");
const StudentModel = require("../models/studentModel");
let teacherModel = new TeacherModel;
let classModel = new ClassModel;
let studentModel = new StudentModel;

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

        // 待處理事項1029
        // ajax請求寫法優化(分函數)
        // res.send(錯誤訊息的呈現方式思考?alert?即時顯示(ajax)?)
        // 1.新增學生、班級用ajax重新渲染... 
        // 2.找出能改用ajax的地方(先老師這邊做就好，其他地方再說)
        // 刪除學生
        // studentModel、classModel拆分的可能性思考

        // 學習1027
        // 應該向哪個表要資料，就把api寫在那個表的model
        // modelAPi一個只做一個工作(這就是設計原則精華)，比如查(get)資料(all?一個field?)，設(set)資料(all?一個field?)
        // try 裡面就是寫code就對了，裡面出錯全部都會跑到catch
        // firebase很多api不知道會回傳什麼?測測看就知道了(感謝console.log)

        // ajax請求流程
        // 前端:填寫資料 > 前端頁面驗證(通過) > 製作資料 > 發出ajax請求
        // 後端:路由收到請求 > controller處理請求 > model資料抓取 > 資料庫更新完成 > (關鍵)回覆前端
        // 前端:更新資料(?)

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
};