import {updateQuestion, updateQNum , removeSelect} from "./viewQuestion.js";

function updateExaplain(newExplain,list,index){
    if(list[index].explain){
        newExplain.innerHTML = "解析:" + list[index].explain;
    }
    else{
        newExplain.innerHTML = "";
    }
}

function getCorrectIndex(options){
    for(let i = 0 ; i<options.length ;i++){
        if(options[i].value){
            return i;
        }
    }
}

function markCorrect(corIndex, optionDOM) {
        optionDOM[corIndex].classList.add("color-green");
}

window.addEventListener("load", () => {

    let topicIndex = 0;
    let qList = [];
    let allQNum = 0;

    let qUnitEle = document.getElementById("qUnit");
    let qImg = document.getElementById("qImg");
    let qTopic = document.getElementById("qTopic");
    let qChoice1 = document.getElementById("qChoice1");
    let qChoice2 = document.getElementById("qChoice2");
    let qChoice3 = document.getElementById("qChoice3");
    let qChoice4 = document.getElementById("qChoice4");
    let qOptions = document.getElementsByClassName("quizTest_option");
    let qExplain = document.getElementById("qExplain");
    let qIndex = document.getElementById("qIndex");
    let prev = document.getElementById("prev");
    let next = document.getElementById("next");
    let nextArea = document.getElementById("nextArea");
    let qNum = document.getElementById("qNum");
    let qSubmit = document.getElementById("qSubmit");
    let qSubmitArea = document.getElementById("submitArea");
    let exit = document.getElementById("exit");

    // 基本路由設置
    let reqQUrl = "/student/review/question/";

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
            // 設置詳解
            updateExaplain(qExplain,qList,topicIndex);
            // 更新總題數 僅需做一次
            updateQNum(qNum, qList);

            // 取得問題數
            allQNum = qList.length;

            // 標記正解顏色
            let correctIndex = getCorrectIndex(qList[topicIndex].options);
            markCorrect(correctIndex , qOptions);

        },
        error: (err) => {
            console.log(err)
        },
    });

    next.addEventListener("click", () => {

        if (topicIndex < allQNum) {

            // 清除選取
            removeSelect([qOptions[0], qOptions[1], qOptions[2], qOptions[3]],"color-green");

            // 更新題目
            topicIndex++;
            updateQuestion(qImg, qTopic, qChoice1, qChoice2, qChoice3, qChoice4, qIndex, qList, topicIndex);

            // 設置詳解
            updateExaplain(qExplain,qList,topicIndex);

            // 標記正解顏色
            let correctIndex = getCorrectIndex(qList[topicIndex].options);
            markCorrect(correctIndex , qOptions);

            // 檢查是否為最後一題
            if (topicIndex == allQNum - 1) {
                qSubmitArea.classList.remove("d-none");
                nextArea.classList.add("d-none");
            }

        }
    });

    prev.addEventListener("click", () => {
        if (topicIndex > 0) {

            // 清除選取
            removeSelect([qOptions[0], qOptions[1], qOptions[2], qOptions[3]],"color-green");

            // 更新題目
            topicIndex--;
            updateQuestion(qImg, qTopic, qChoice1, qChoice2, qChoice3, qChoice4, qIndex, qList, topicIndex);

            // 設置詳解
            updateExaplain(qExplain,qList,topicIndex);

            // 標記正解顏色
            let correctIndex = getCorrectIndex(qList[topicIndex].options);
            markCorrect(correctIndex , qOptions);
            

            // 檢查是否不是最後一題
            if (topicIndex !== allQNum - 1) {
                nextArea.classList.remove("d-none");
                qSubmitArea.classList.add("d-none");
            }

        }
    });

    qSubmit.addEventListener("click", () => {

        window.location.href = "/student/review";

    });

    exit.addEventListener("click",()=>{
        window.location.href = "/student/review";
    });
});