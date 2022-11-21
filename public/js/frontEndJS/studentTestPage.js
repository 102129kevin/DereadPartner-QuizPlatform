import { updateQuestion, updateQNum, initAnswerList, convertAnswerCode, removeSelect } from "./viewQuestion.js";


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

function markSelect(list, index, optionDOM) {
    if (list[index].answerCode) {
        let answerIndex = convertAnswerCode(index, list);
        optionDOM[answerIndex].classList.add("color-blue1");
    }
}

window.addEventListener("load", () => {

    let topicIndex = 0;
    let qList = [];
    let answerList = [];

    let qUnitEle = document.getElementById("qUnit");
    let qImg = document.getElementById("qImg");
    let qTopic = document.getElementById("qTopic");
    let qChoice1 = document.getElementById("qChoice1");
    let qChoice2 = document.getElementById("qChoice2");
    let qChoice3 = document.getElementById("qChoice3");
    let qChoice4 = document.getElementById("qChoice4");
    let qOptions = document.getElementsByClassName("quizTest_option");
    let qIndex = document.getElementById("qIndex");
    let prev = document.getElementById("prev");
    let next = document.getElementById("next");
    let nextArea = document.getElementById("nextArea");
    let qNum = document.getElementById("qNum");
    let qSubmit = document.getElementById("qSubmit");
    let qSubmitArea = document.getElementById("submitArea");
    let exit = document.getElementById("exit");

    // 基本路由設置
    let reqQUrl = "/student/quiz/question/";

    //獲取當前頁面埋藏的unit文字，在設定請求url(trim修剪空白) 
    let qUnitText = qUnitEle.innerHTML.trim();

    // 設定請求問題的單元
    reqQUrl += qUnitText;

    $.ajax({
        url: reqQUrl,
        method: "GET",
        dataType: "json",
        success: (res) => {
            qList = res;
            // 設置頁面
            updateQuestion(qImg, qTopic, qChoice1, qChoice2, qChoice3, qChoice4, qIndex, qList, topicIndex);
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

            // 更新題目
            topicIndex++;
            updateQuestion(qImg, qTopic, qChoice1, qChoice2, qChoice3, qChoice4, qIndex, qList, topicIndex);

            // 清除選取
            removeSelect([qOptions[0], qOptions[1], qOptions[2], qOptions[3]], "color-blue1");

            // 標記顏色(有作答過才去取標記)
            markSelect(answerList, topicIndex, qOptions);

            // 檢查是否為最後一題
            if (topicIndex == answerList.length - 1) {
                qSubmitArea.classList.remove("d-none");
                nextArea.classList.add("d-none");
            }
        }
    });

    prev.addEventListener("click", () => {
        if (topicIndex > 0) {
            // 儲存用戶選擇
            storeAnswer(topicIndex, answerList);

            // 更新題目
            topicIndex--;
            updateQuestion(qImg, qTopic, qChoice1, qChoice2, qChoice3, qChoice4, qIndex, qList, topicIndex);

            // 清除選取
            removeSelect([qOptions[0], qOptions[1], qOptions[2], qOptions[3]], "color-blue1");

            // 標記顏色(有作答過才去取標記)
            markSelect(answerList, topicIndex, qOptions);

            // 檢查是否不是最後一題
            if (topicIndex !== answerList.length - 1) {
                nextArea.classList.remove("d-none");
                qSubmitArea.classList.add("d-none");
            }

        }
    });


    for (let i = 0; i < qOptions.length; i++) {
        qOptions[i].addEventListener("click", () => {
            removeSelect([qOptions[0], qOptions[1], qOptions[2], qOptions[3]], "color-blue1");
            qOptions[i].classList.add("color-blue1");
        })
    }

    qSubmit.addEventListener("click", () => {
        // 送出前先將目前題目儲存
        storeAnswer(topicIndex, answerList);

        // 創建表單
        let hiddenForm = document.createElement("form");
        hiddenForm.setAttribute("action", "/student/quiz/answer/" + qUnitText);
        hiddenForm.setAttribute("name", "ansForm");
        hiddenForm.setAttribute("method", "post");

        // 創建輸入1
        let ansInput = document.createElement("input");
        ansInput.setAttribute("type", "hidden");
        ansInput.setAttribute("name", "ans");
        ansInput.setAttribute("value", JSON.stringify(answerList));

        // 添加元素
        hiddenForm.appendChild(ansInput);
        document.body.appendChild(hiddenForm);

        // 送出表單(請求)
        hiddenForm.submit();

    });

    exit.addEventListener("click", () => {
        window.location.href = "/student/quiz";
    });
});