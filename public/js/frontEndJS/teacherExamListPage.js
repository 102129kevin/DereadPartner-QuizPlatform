import { checkInputTextEmpty } from "./check.js";
import { resetImage } from "./examInput.js";
import {preview , format_float , makeQData} from './uploadPic.js';

function initImgState(imgPreviewDOM){
    let newImgState =  {
        prev: imgPreviewDOM.getAttribute("src").replace("/public/qPic/",""),
        next: imgPreviewDOM.getAttribute("src").replace("/public/qPic/",""),
        addPic: false,
        deletePic : false
    }

    return newImgState;
}

window.addEventListener("load", () => {
    let titleToggle = document.getElementsByClassName("titleToggle");
    let menuContent = document.getElementsByClassName("menuContent");

    Array.prototype.forEach.call(titleToggle, el => {
        el.addEventListener("click", (e) => {
            // 取得抽屜內容節點
            let content = e.currentTarget.parentNode.nextElementSibling;
            let panel = e.currentTarget.parentNode.nextElementSibling.parentNode.parentNode;

            // 判斷內容節點是否隱藏，使用jquey提供的slide方法進行伸縮
            if (window.getComputedStyle(content).display != "none") {
                $(content).slideUp();
                $(panel).removeClass("menuPanel_borderOpen");
            }
            else {
                $(content).slideDown();
                $(panel).addClass("menuPanel_borderOpen");
            }
        })
    });

    Array.prototype.forEach.call(menuContent, el => {
        // qID
        let qID = el.querySelector("input[name=qID]");
        // 輸入欄位
        let topic = el.querySelector("textarea[name=topic]");
        let choose1 = el.querySelector("input[name=choose1]");
        let choose2 = el.querySelector("input[name=choose2]");
        let choose3 = el.querySelector("input[name=choose3]");
        let choose4 = el.querySelector("input[name=choose4]");
        let explain = el.querySelector("textarea[name=explain]");
        let corChoose = el.querySelector("select[name=correctChoose]");
        let unit = el.querySelector("select[name=unit]");
        // 圖片相關
        let uploadHint = el.querySelector(".uploadHint");
        let uploadInfo = el.querySelector(".uploadInfo");
        let imgPreviewDOM = el.querySelector(".inputImgPreview");
        let inputImg = el.querySelector(".inputImg");
        let clearInputImg = el.querySelector(".clearInputImg");
        let inputText = el.querySelector(".upload_state");
        
        let fileName = el.querySelector(".fileName");
        let fileSize = el.querySelector(".fileSize");

        // 編輯確認
        let examEditQuestion = el.querySelector(".examEditQuestion");

        // 圖片狀態
        let imgState = initImgState(imgPreviewDOM);

        // 事件監聽
        inputImg.addEventListener("change",(e)=>{
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

            // 更新圖片狀態
            // 凡上傳必增加圖片
            imgState.addPic = true;
            // 判斷原本是否已有圖片
            if(imgState.prev != ""){
                imgState.deletePic = true;
            }
            else{
                imgState.deletePic = false;
            }
        });

        clearInputImg.addEventListener("click",(e)=>{
            e.preventDefault();

            // 清除圖片
            resetImage(inputText,inputImg,imgPreviewDOM,fileName,fileSize,uploadHint,uploadInfo);

            // 更新圖片狀態
            imgState.next = "";
            // 凡清除必無需增加圖片
            imgState.addPic = false;
            // 有團的狀況下才可以刪圖
            if(imgState.prev != ""){
                imgState.deletePic = true;
            }
            else{
                imgState.deletePic = false;
            }
        });

        examEditQuestion.addEventListener("click", (e) => {
            e.preventDefault();

            if (checkInputTextEmpty(topic.value) || checkInputTextEmpty(choose1.value) ||
                checkInputTextEmpty(choose2.value) || checkInputTextEmpty(choose3.value) ||
                checkInputTextEmpty(choose4.value)) {
                alert("請將此題目敘述、選項填寫完整!");
            }
            else{
                // 更新進度視窗
                Swal.fire({
                    title: "更新中...",
                    html: "Please wait a moment"
                });
                Swal.showLoading();

                let qData = makeQData(topic,choose1,choose2,choose3,choose4,corChoose,unit,inputImg,explain);
                // 更新題目需要加入qID
                qData.append("qID", qID.value);

                // 有關next也許可省?
                if(inputImg.files[0] && inputImg.files[0].name){
                    // alert("有file");
                    imgState.next = inputImg.files[0].name;
                }

                // 使用formData傳遞的資料會轉成字串...
                qData.append("prevImg",imgState.prev);
                qData.append("nextImg",imgState.next);
                qData.append("addPic",imgState.addPic);
                qData.append("deletePic",imgState.deletePic);

                fetch("/teacher/exam/editQuestion", {
                    method: "POST",
                    body: qData
                })
                .then((res) => {
                    return res.text();
                })
                .then((newPicName) => {
                    // 更新完成，更新imgPreviewDOM
                    // 實驗與思考
                    // console.log(imgState); //空或有圖片兩種狀況
                    // console.log("------------");
                    if(imgState.next !== "" && imgState.addPic){
                        imgPreviewDOM.setAttribute("src","/public/qPic/" + newPicName);
                    }
                    
                    inputImg.value="";
                    
                    imgState = initImgState(imgPreviewDOM);
                    
                    // 更新提示窗
                    Swal.showLoading();
                    Swal.fire({
                        icon: 'success',
                        title: "更新題目成功",
                        text: '快通知學生做題目吧!'
                    });

                })
                .catch(err=>{
                    console.log(err);

                    // 更新提示窗
                    Swal.showLoading();
                    Swal.fire({
                        icon: 'error',
                        title: "更新題目失敗",
                        text: 'something error occured...'
                    });
                });
            }

        });

    });
})