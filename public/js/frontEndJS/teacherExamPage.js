import { checkInputTextEmpty } from "./check.js";
import { resetInput , resetImage } from "./examInput.js";
import { preview, format_float, makeQData } from './uploadPic.js';

window.addEventListener("load", () => {
    // 基本欄位
    let topic = document.querySelector("textarea[name='topic']");
    let choose1 = document.querySelector("input[name='choose1']");
    let choose2 = document.querySelector("input[name='choose2']");
    let choose3 = document.querySelector("input[name='choose3']");
    let choose4 = document.querySelector("input[name='choose4']");
    let explain = document.querySelector("textarea[name='explain']");
    let correctChoose = document.querySelector("select[name='correctChoose']");
    let unit = document.querySelector("select[name='unit']");
    // 圖片上傳
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

        if (checkInputTextEmpty(topic.value) || checkInputTextEmpty(choose1.value) ||
            checkInputTextEmpty(choose2.value) || checkInputTextEmpty(choose3.value) ||
            checkInputTextEmpty(choose4.value)) {
            alert("請將此題目敘述、選項填寫完整!");
        }
        else {
            Swal.fire({
                title: "處理中...",
                html: "Please wait a moment"
            });
            Swal.showLoading();

            let qData = makeQData(topic, choose1, choose2, choose3, choose4, correctChoose, unit, inputImgButton, explain);

            fetch("/teacher/exam/addQuestion", {
                method: "POST",
                body: qData
            }).then((res) => {
                return res.text();
            }).then((msg) => {
                if(msg == "新增題目成功"){

                    // 清空資料
                    resetInput(topic,choose1,choose2,choose3,choose4,correctChoose, unit, explain);
                    resetImage(inputText,inputImgButton,imgPreviewDOM,fileName,fileSize,uploadHint,uploadInfo);

                    // 更新提示窗
                    Swal.showLoading();
                    Swal.fire({
                        icon: 'success',
                        title: msg,
                        text: '快通知學生做題目吧!'
                    });
                }
            }).catch(err=>{
                Swal.showLoading();
                Swal.fire({
                    icon: 'error',
                    title: "新增題目失敗",
                    text:  "something error occured..."
                });
                console.log(err);
            });
        }
    });

    clearInputImg.addEventListener("click", (e) => {
        e.preventDefault();

        // 清空圖片上傳資訊
        resetImage(inputText,inputImgButton,imgPreviewDOM,fileName,fileSize,uploadHint,uploadInfo);
    })
});