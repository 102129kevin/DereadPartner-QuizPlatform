

window.addEventListener("load", function () {

    //取得按鈕
    let loginBtn = document.getElementById("login_btn");

    loginBtn.addEventListener("click", function () {
        //取得輸入資料
        let logType = document.querySelector("[name=identity]:checked").value;
        let logId = document.getElementsByName("userid")[0].value;
        let logPasswd = document.getElementsByName("userpasswd")[0].value;

        // (送出前)檢查 > 
        if (logId == "" || logPasswd == "") {
            alert("請輸入帳號、密碼");
        }
        else {
            // 製作資料
            let loginData = {
                userId: logId,
                userPasswd: logPasswd,
                logType: logType
            }

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
                            window.location.href = "/"
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
    })

})