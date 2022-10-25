let LoginModel = require("../models/loginModel");
let loginModel = new LoginModel();

function checkLogin(record, reqID, reqPasswd, reqType) {

    let idField;
    // 判斷是學生還是老師的請求
    if (reqType == "students") {
        // 學生
        idField = "sID";
    }
    else {
        //老師
        idField = "tID";
    }

    return (record[idField] == reqID && record["password"] == reqPasswd);
}

function createSession(req) {
    if (req.session.name != req.body["userId"]) {
        req.session.name = req.body["userId"];
    }
}

module.exports = class LoginController {

    Login(req, res, next) {
        // model查詢用戶資料
        loginModel.getUserData(req.body["userId"], req.body["logType"]).then(function (accData) {
            //判斷輸入資料
            if (checkLogin(accData, req.body["userId"], req.body["userPasswd"], req.body["logType"])) {
                //建立session
                createSession(req);
                res.send("done");
            }
            else {
                console.log("login info incorrect!");
                res.send("帳號或密碼錯誤~");
            }
        }).catch(function (err) {
            console.log("no find Data in collection", err);
            res.send("您尚未註冊");
        })
    }
    // 如果正確 > 建立session > 登入系統(分老師與學生頁面(兩個view))

    // 登出
    logout(req, res, next) {
        req.session.destroy(() => {
            console.log("session logout!")
        })
        res.redirect("/");
    }
}