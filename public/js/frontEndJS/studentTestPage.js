
function updateQuestion(newQTopic, newQChoice1, newQChoice2, newQChoice3, newQChoice4, nowIndex, questions, index) {
    newQTopic.innerHTML = questions[index]["topic"];
    newQChoice1.innerHTML = questions[index].options[0].option;
    newQChoice2.innerHTML = questions[index].options[1].option;
    newQChoice3.innerHTML = questions[index].options[2].option;
    newQChoice4.innerHTML = questions[index].options[3].option;
    // index+1 單純顯示用 程式紀錄的index不去更動
    nowIndex.innerHTML = (index + 1);
}

function updateQNum(newQNum, questions) {
    newQNum.innerHTML = questions.length;
}

function initAnswerList(data, list) {
    for (let i = 0; i < data.length; i++) {
        list[i] = {
            qId: data[i].qId,
            answerCode: undefined,
            answerText: undefined
        }
    }
}

function convertAnswerCode(currentIndex, list) {
    let option;
    let answerCode = list[currentIndex].answerCode;
    // console.log("answer:", answerCode);
    switch (answerCode) {
        case '(A)': {
            option = 0;
            break;
        }
        case '(B)': {
            option = 1;
            break;
        }
        case '(C)': {
            option = 2;
            break;
        }
        case '(D)': {
            option = 3;
            break;
        }
        default: {
            break;
        }
    }
    // console.log("option:", option);
    return option;
}

function storeAnswer(currentIndex, list) {
    try {
        let selectAnswer = document.querySelector(".color-blue1");
        list[currentIndex].answerCode = selectAnswer.querySelector(".quizTest_left").innerHTML;
        list[currentIndex].answerText = selectAnswer.querySelector(".quizTest_right").innerHTML;
    }
    catch (err) {
        // 錯誤代表的是 使用者沒有選擇選項就跳過做下一題
        // 錯誤也不需執行任何操
        // 初始化時已將各題的answerCode Text都已經設定是 undefined
    }
}

function removeSelect(options) {
    options.forEach((option) => {
        option.classList.remove("color-blue1");
    });
}

window.addEventListener("load", () => {
    let topicIndex = 0;
    let qList = [];
    let answerList = [];

    let qUnit = document.getElementById("qUnit");
    let qTopic = document.getElementById("qTopic");
    let qChoice1 = document.getElementById("qChoice1");
    let qChoice2 = document.getElementById("qChoice2");
    let qChoice3 = document.getElementById("qChoice3");
    let qChoice4 = document.getElementById("qChoice4");
    let qOptions = document.getElementsByClassName("quizTest_option");
    let qIndex = document.getElementById("qIndex");
    let prev = document.getElementById("prev");
    let next = document.getElementById("next");
    let qNum = document.getElementById("qNum");
    let qSubmit = document.getElementById("qSubmit");

    let reqQUrl = "/student/quiz/question/";

    //獲取當前頁面埋藏的unit文字，在設定請求url(trim修剪空白) 
    let qUnitText = qUnit.innerHTML.trim();

    // 設定請求問題的單元
    if (qUnitText == "all") {
        reqQUrl += "all";
    }
    else {
        reqQUrl += qUnitText;
    }


    $.ajax({
        url: reqQUrl,
        method: "GET",
        dataType: "json",
        success: (res) => {
            qList = res;

            // 設置頁面
            updateQuestion(qTopic, qChoice1, qChoice2, qChoice3, qChoice4, qIndex, qList, topicIndex);
            // 更新總題數 僅需做一次
            updateQNum(qNum, qList);
            // 初始化答案串列
            answerList = new Array(qList.length);
            // 將qList每筆資料的id加入answerList的每一格，每一格內容同樣是物件
            initAnswerList(qList, answerList);
        },
        error: (err) => {
            console.log(err)
        },
    });

    next.addEventListener("click", () => {
        if (topicIndex < 9) {
            // 儲存用戶選擇
            storeAnswer(topicIndex, answerList);
            // try {
            //     let selectAnswer = document.querySelector(".color-blue1");
            //     answerList[topicIndex].answerCode = selectAnswer.querySelector(".quizTest_left").innerHTML;
            //     answerList[topicIndex].answerText = selectAnswer.querySelector(".quizTest_right").innerHTML;
            // }
            // catch (err) {
            //     // 錯誤代表的是 使用者沒有選擇選項就跳過做下一題
            //     // 錯誤也不需執行任何操
            //     // 初始化時已將各題的answerCode Text都已經設定是 undefined
            // }

            // 更新題目
            topicIndex++;
            updateQuestion(qTopic, qChoice1, qChoice2, qChoice3, qChoice4, qIndex, qList, topicIndex);

            // 清除選取
            removeSelect([qOptions[0], qOptions[1], qOptions[2], qOptions[3]]);

            // 標記顏色(有作答過才去取標記)
            if (answerList[topicIndex].answerCode) {
                let answerIndex = convertAnswerCode(topicIndex, answerList);
                qOptions[answerIndex].classList.add("color-blue1");
            }

            // 檢查是否為最後一題
            if (topicIndex == answerList.length - 1) {
                qSubmit.hidden = false;
            }
        }
    });

    prev.addEventListener("click", () => {
        if (topicIndex > 0) {
            // 儲存用戶選擇
            storeAnswer(topicIndex, answerList);
            // try {
            //     let selectAnswer = document.querySelector(".color-blue1");
            //     answerList[topicIndex].answerCode = selectAnswer.querySelector(".quizTest_left").innerHTML;
            //     answerList[topicIndex].answerText = selectAnswer.querySelector(".quizTest_right").innerHTML;
            // }
            // catch (err) {
            //     // 錯誤代表的是 使用者沒有選擇選項就跳過做下一題
            //     // 錯誤也不需執行任何操
            //     // 初始化時已將各題的answerCode Text都已經設定是 undefined
            // }

            // 更新題目
            topicIndex--;
            updateQuestion(qTopic, qChoice1, qChoice2, qChoice3, qChoice4, qIndex, qList, topicIndex);

            // 清除選取
            removeSelect([qOptions[0], qOptions[1], qOptions[2], qOptions[3]]);

            // 標記顏色(有作答過才去取標記)
            if (answerList[topicIndex].answerCode) {
                let answerIndex = convertAnswerCode(topicIndex, answerList);
                qOptions[answerIndex].classList.add("color-blue1");
            }

            // 檢查是否不是最後一題
            if (topicIndex !== answerList.length - 1) {
                qSubmit.hidden = true;
            }

        }
    });


    for (let i = 0; i < qOptions.length; i++) {
        qOptions[i].addEventListener("click", () => {
            removeSelect([qOptions[0], qOptions[1], qOptions[2], qOptions[3]]);
            qOptions[i].classList.add("color-blue1");
        })
    }

    qSubmit.addEventListener("click", () => {
        // 送出前先將目前題目儲存
        storeAnswer(topicIndex, answerList);

        // tricky作法
        // 動態新增表單，將資料藏在表單hidden欄位後，再將表單送出
        let formHTML = '<form action="/student/quiz/answer/' + qUnitText + '" name="ansForm" method="post"><input type="hidden" name="ans" value=' + JSON.stringify(answerList) + '></form>';

        document.write(formHTML);
        document.ansForm.submit();
    });
});