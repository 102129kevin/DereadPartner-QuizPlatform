import { checkInputTextEmpty } from "./check.js";
import {preview , format_float , makeQData} from './uploadPic.js';

window.addEventListener("load", () => {
    let inputImgButton = document.getElementById("inputImg");
    let inputText = document.getElementById("upload_state");
    let uploadHint = document.getElementById("uploadHint");
    let uploadInfo = document.getElementById("uploadInfo");
    let imgPreviewDOM = document.getElementById("inputImgPreview");
    let clearInputImg = document.getElementById("clearInputImg");
    let examUploadButton = document.getElementById("examUpload");
    let fileName = document.getElementById("fileName");
    let fileSize = document.getElementById("fileSize");

    inputImgButton.addEventListener("change", (e) => {     
        // 取得檔案資訊
        let files = e.target.files[0];

        // 檔案文字區塊
        inputText.innerHTML = files.name;

        // 檔案上傳區塊
        preview(files, imgPreviewDOM);
        fileName.innerHTML = files.name;
        fileSize.innerHTML = "大小:" + format_float(files.size / 1024, 1) + " KB";
        uploadHint.classList.add("d-none");
        uploadInfo.classList.remove("d-none");
    });

    examUploadButton.addEventListener("click", (e) => {
        e.preventDefault();

        let topic = document.querySelector("textarea[name='topic']");
        let choose1 = document.querySelector("input[name='choose1']");
        let choose2 = document.querySelector("input[name='choose2']");
        let choose3 = document.querySelector("input[name='choose3']");
        let choose4 = document.querySelector("input[name='choose4']");
        let explain = document.querySelector("textarea[name='explain']");
        let correctChoose = document.querySelector("select[name='correctChoose']");
        let unit = document.querySelector("select[name='unit']");


        if (checkInputTextEmpty(topic.value) || checkInputTextEmpty(choose1.value) ||
            checkInputTextEmpty(choose2.value) || checkInputTextEmpty(choose3.value) ||
            checkInputTextEmpty(choose4.value)) {
            alert("請將此題目敘述、選項填寫完整!");
        }
        else {
            let qData = makeQData(topic,choose1,choose2,choose3,choose4,correctChoose,unit,inputImgButton,explain);
           
            fetch("/teacher/exam/addQuestion", {
                method: "POST",
                body: qData
            }).then((res) => {
                return res.text();
            }).then((msg) => {
                alert(msg);
            });
        }
    });

    clearInputImg.addEventListener("click", (e) => {
        e.preventDefault();

        // 檔案文字區塊
        inputText.innerHTML = "未選擇任何檔案";

        // 檔案上傳區塊
        inputImgButton.value = "";
        imgPreviewDOM.setAttribute("src", "");
        fileName.innerHTML = "";
        fileSize.innerHTML = "";
        uploadHint.classList.remove("d-none");
        uploadInfo.classList.add("d-none");
    })
});