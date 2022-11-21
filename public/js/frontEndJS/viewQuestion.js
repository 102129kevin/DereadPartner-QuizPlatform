export function updateQuestion(newQImg, newQTopic, newQChoice1, newQChoice2, newQChoice3, newQChoice4, nowIndex, questions, index) {
    newQTopic.innerHTML = questions[index]["topic"];
    newQChoice1.innerHTML = questions[index].options[0].option;
    newQChoice2.innerHTML = questions[index].options[1].option;
    newQChoice3.innerHTML = questions[index].options[2].option;
    newQChoice4.innerHTML = questions[index].options[3].option;

    // 圖片
    if (questions[index].img) {
        // 設置開啟圖片區
        let imgURL = "/public/qPic/" + questions[index].img;
        newQImg.classList.remove("d-none");
        newQImg.setAttribute("src", imgURL);
    }
    else {
        // 關閉圖片區
        newQImg.classList.add("d-none");
        newQImg.setAttribute("src", "");
    }

    // index+1 單純顯示用 程式紀錄的index不去更動
    nowIndex.innerHTML = (index + 1);
}

export function updateQNum(newQNum, questions) {
    newQNum.innerHTML = questions.length;
}

export function initAnswerList(data, list) {
    for (let i = 0; i < data.length; i++) {
        list[i] = {
            qId: data[i].qId,
            answerCode: undefined,
            answerText: undefined,
            options: data[i].options,
            qUnit: data[i].unit,
            qImg: data[i].img
        }
    }
}

export function convertAnswerCode(currentIndex, list) {
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

export function removeSelect(options,colorClass) {
    options.forEach((option) => {
        option.classList.remove(colorClass);
    });
}