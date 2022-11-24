export function resetInput(topic,choose1,choose2,choose3,choose4,correctChoose, unit, explain){
    topic.value = "";
    choose1.value = "";
    choose2.value = "";
    choose3.value = "";
    choose4.value = "";
    explain.value = "";
    correctChoose.options[0].selected = true;
    unit.options[0].selected = true;
}

export function resetImage(inputText,inputImgButton,imgPreviewDOM,fileName,fileSize,uploadHint,uploadInfo){
    // 檔案文字區塊
    inputText.innerHTML = "未選擇任何檔案";

    // 檔案上傳區塊
    inputImgButton.value = "";
    imgPreviewDOM.setAttribute("src", "");
    fileName.innerHTML = "";
    fileSize.innerHTML = "";
    uploadHint.classList.remove("d-none");
    uploadInfo.classList.add("d-none");
}