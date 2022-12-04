import { checkSIDFormat, checkTIDFormat, checkIDStart } from "./check.js";

function sendLoginReq(logId,logPasswd){
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
}

window.addEventListener("load", function () {

    //取得按鈕
    let loginBtn = document.getElementById("loginButton");
    let loginBtn_rwd = document.getElementById("loginButton_rwd");
    let stuFill = document.getElementById("stuFill");
    let trFill = document.getElementById("trFill");

    let userid = document.querySelector("input[name=userid]");
    let userpasswd = document.querySelector("input[name=userpasswd]");
    let userid_rwd = document.querySelector("input[name=userid_rwd]");
    let userpasswd_rwd = document.querySelector("input[name=userpasswd_rwd]");

    // alert("您好!\n體驗學生版功能，請輸入:\n帳號:s1311034099\n密碼:99\n\n體驗教師版功能，請輸入:\n帳號:tr005\n密碼:005\n\n另外，也可以使用手機開啟我們的網站唷~");

    loginBtn.addEventListener("click", () => {

        //取得輸入資料
        let logId = userid.value;
        let logPasswd = userpasswd.value;

        // 送出請求
        sendLoginReq(logId,logPasswd);
        
    });

    loginBtn_rwd.addEventListener("click", () => {

        //取得輸入資料
        let logId = userid_rwd.value;
        let logPasswd = userpasswd_rwd.value;

        // 送出請求
        sendLoginReq(logId,logPasswd);
        
    });

    stuFill.addEventListener("click",()=>{
        userid_rwd.value = "s1311034099";
        userpasswd_rwd.value = "99";
    })

    trFill.addEventListener("click",()=>{
        userid_rwd.value = "tr005";
        userpasswd_rwd.value = "005";
    })
});