// let check = require("./check");
// let checkSIDFormat = check.checkSIDFormat;
// let checkInputTextEmpty = check.checkInputTextEmpty;
import { checkSIDFormat, checkInputTextEmpty, checkTIDFormat } from "./check.js";

function checksID(form) {
    let newStuId = form.newStuId.value;
    if (!checkInputTextEmpty(newStuId)) {
        if (checkSIDFormat(newStuId)) {
            return true;
        }
        else {
            alert("請輸入正確的學號格式(s+10碼數字)");
            return false;
        }
    }
    else {
        alert("請輸入學生學號以新增學生")
        return false;
    }
}

window.addEventListener("load", function () {
    let addStuForm = document.querySelectorAll(".addStuForm");

    addStuForm.forEach((el) => {
        el.addEventListener("submit", (event) => {
            // 取消預設表單動作
            event.preventDefault();

            // 資料通過審查
            if (checksID(el)) {
                // 取值、做資料
                let targetSID = el.newStuId.value;
                let sendData = {
                    newStuId: targetSID
                }

                // 取得form在render自動生成的action目標
                let reqURL = el.getAttribute("action");

                // 發送請求(get方法使用req.query取值，post方法使用req.body)
                $.ajax({
                    url: reqURL,
                    method: 'GET',
                    data: sendData,
                    success: function (res) {
                        alert(res);
                    },
                    error: function (err) {
                        alert(err);
                    }
                });
            }
        })
    })
})

