let TeacherModel = require("../models/teacherModel");
let teacherModel = new TeacherModel;

// 老師進到頁面(路由)
// 去抓該老師資料(用session????) model
// 判斷是否有班級資料(應該能在views寫)
//    有 > 渲染函數 > 抓取班級名單(cID)
//       > 透過cID去抓class表格裡面的cMember > 渲染
//    沒有 > 渲染基本page

module.exports = class TeacherController {

    // 加上錯誤判斷與思考
    // 有老師 但根本沒班級(老師還沒新增班級)
    // 砍班級列表 > 這個應該算很後面 
    // (if cIDList.length == 0 --> 砍掉cIDList欄位)
    // 有班級 但是沒有cMember(老師還沒新增學生)
    // 有cMember 沒有學生
    // 砍學生 > 這個應該算很後面 
    // (if cMemeber.length == 0 --> 砍掉cMember欄位)

    async renderPage(req, res, next) {

        try {
            let classInfo;
            let trData = await teacherModel.getTeacherData(req);
            if ("cIDList" in trData) {
                console.log("hi");
                classInfo = await teacherModel.getClassCMember(trData["cIDList"]);
            }
            res.render("teacherIndex", { r_classInfo: classInfo });
        }
        catch (err) {
            console.log(err);
        }

    };
};