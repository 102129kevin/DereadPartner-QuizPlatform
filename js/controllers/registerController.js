let RegisterModel = require('../models/registerModel');

let registerModel = new RegisterModel();

function checkRegIdFormat(id) {
    let idFormat = /^s\d{10}$/;
    let result = idFormat.test(id);
    return result;
}

function checkRegPasswd(passwd, passwd2) {
    let result = (passwd == passwd2);
    return result;
}

function checkRegName(name) {
    let nameFormat = /^[\u4E00-\u9FA5]+$/
    let result = nameFormat.test(name);
    return result;
}

function checkRegIdentity(regID, classMember) {
    return classMember.includes(regID);
}


module.exports = class RegisterController {

    // do something
    // 從資料庫將資料撈完後進行res.json的動作。

    // 檢查是否為該班級成員
    // 檢查是否已經註冊過

    register(req, res, next) {
        // 檢查學號格式
        if (checkRegIdFormat(req.body["regID"])) {
            // 檢查密碼是否正確
            if (checkRegPasswd(req.body["regPasswd"], req.body["regPasswd2"])) {
                // 檢查姓名是否為中文
                if (checkRegName(req.body["regName"])) {
                    // 檢查是否在註冊班級的學生名單裡面
                    // 先用model抓資料後回來判斷
                    registerModel.getClassID(req.body["regClassText"]).then((cID) => {
                        registerModel.getClassMember(cID).then((classMemberList) => {
                            let result = checkRegIdentity(req.body["regID"], classMemberList);
                            if (result) {
                                registerModel.setRegisterRequest(req, res, next);
                                res.send("新增帳號成功，請重新登入唷");
                            }
                            else {
                                res.send("你未在該班級名單裡面，請通知任課老師");
                            }
                        })
                    }).catch(err => {
                        console.log(err);
                        res.send("該班級尚未開課，請通知任課老師");
                    });
                }
                else {
                    res.send("請輸入您的本名");
                }
            }
            else {
                res.send("密碼輸入不一致");
            }
        }
        else {
            res.send("學號格式不對喔")
        }
    }
}