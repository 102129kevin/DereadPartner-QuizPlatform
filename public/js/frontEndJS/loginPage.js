import { checkSIDFormat, checkTIDFormat, checkIDStart } from "./check.js";

window.addEventListener("load", function () {

    //取得按鈕
    let loginBtn = document.getElementById("loginButton");

    alert("您好!\n體驗學生版功能，請輸入:\n帳號:s1311034099\n密碼:99\n\n體驗教師版功能，請輸入:\n帳號:tr005\n密碼:005\n\n另外，也可以使用手機開啟我們的網站唷~");

    loginBtn.addEventListener("click", function () {

        //取得輸入資料
        let logId = document.getElementsByName("userid")[0].value;
        let logPasswd = document.getElementsByName("userpasswd")[0].value;

        // (送出前)檢查
        if (logId == "" || logPasswd == "") {
            alert("請輸入帳號、密碼");
        }
        else {
            let logType = checkIDStart(logId);

            if (logType) {
                if (checkSIDFormat(logId) || checkTIDFormat(logId)) {
                    // 製作資料
                    let loginData = {
                        userId: logId,
                        userPasswd: logPasswd,
                        logType: logType
                    };

                    //送出request
                    $.ajax({
                        type: "post",
                        url: "/login/post",
                        cache: false,
                        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                        data: loginData,
                        success: function (msg) {
                            if (msg != "done") {
                                alert(msg);
                            }
                            else {
                                if (logType == "students") {
                                    //學生導到首頁
                                    window.location.href = "/student"
                                }
                                else {
                                    // 老師導到控制面板
                                    window.location.href = "/teacher";
                                }

                            }
                        },
                        error: function (err) {
                            console.log("錯誤");
                        }
                    });

                }
                else {
                    alert("輸入帳號有誤，請重新輸入。")
                }

            }
            else {
                alert("您並非學生或教師...請確認您輸入的帳號密碼。")
            }
        }
    });
});