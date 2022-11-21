export function preview(input, previewDOM) {
    if (input) {
        let reader = new FileReader();
        reader.addEventListener("load", () => {
            previewDOM.setAttribute("src", reader.result);
        });

        reader.readAsDataURL(input);
    }
}

export function format_float(num, pos) {
    let size = Math.pow(10, pos);
    return Math.round(num * size) / size;
}

export function makeQData(topic,opt1,opt2,opt3,opt4,corOpt,unit,imgInput,explain){
    let qData = new FormData();
    qData.append("topic", topic.value);
    qData.append("choose1", opt1.value);
    qData.append("choose2", opt2.value);
    qData.append("choose3", opt3.value);
    qData.append("choose4", opt4.value);
    qData.append("correctChoose", corOpt.value);
    qData.append("unit", unit.value);

    if (imgInput.files[0]) {
        let qImg = imgInput.files[0];
        qData.append("qImg", qImg);
    }

    if(explain.value!=""){
        qData.append("explain",explain.value);
    }

    return qData;
}