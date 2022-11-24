import { setRadarChartData, drawRadarChart, setHistData, drawHist } from "./stateChart.js";

function checkHist(data) {
    let sum = 0; 

    Object.entries(data).forEach(([unit, arr]) => {
        sum += arr.reduce((accumulator,currentValue) =>{
            return accumulator + currentValue;
        })
    });

    return (sum > 0);
}

window.addEventListener("load", () => {
    // 提示訊息
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "3000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
    toastr["info"]("正在處理資料中", "請稍後......");


    let chartContainer = document.getElementsByClassName("chartContainer");

    let radar = document.getElementById("radarChart");
    let unitAllHist = document.getElementById("unitAllHist");
    let unit1Hist = document.getElementById("unit1Hist");
    let unit2Hist = document.getElementById("unit2Hist");
    let unit3Hist = document.getElementById("unit3Hist");
    let unit4Hist = document.getElementById("unit4Hist");

    let waiting = document.querySelector(".waiting");

    $.ajax({
        url: "/teacher/analyze/getInitData",
        method: "POST",
        success: (res) => {
            // 隱藏等待畫面
            waiting.classList.remove("d-flex");
            waiting.classList.add("d-none");

            if (checkHist(res.unitAccuracyHist)) {
                // 提示訊息
                toastr.options = {
                    "closeButton": false,
                    "debug": false,
                    "newestOnTop": false,
                    "progressBar": true,
                    "positionClass": "toast-bottom-right",
                    "preventDuplicates": true,
                    "onclick": null,
                    "showDuration": "400",
                    "hideDuration": "800",
                    "timeOut": "7500",
                    "extendedTimeOut": "1000",
                    "showEasing": "swing",
                    "hideEasing": "linear",
                    "showMethod": "fadeIn",
                    "hideMethod": "fadeOut"
                };
                toastr["success"]("您可以查看班級的各項能力指標、各單元答對率分佈圖。", "學習資料分析");

                // 打開隱藏的表格div
                Array.prototype.forEach.call(chartContainer, el => {
                    el.classList.remove("d-none");
                });

                // 雷達圖
                let radarChartData = setRadarChartData(res.classRadarData);
                drawRadarChart(radarChartData, radar);

                // 分佈圖
                let unitAllHistData = setHistData(res.unitAccuracyHist.unitAll);
                let unit1HistData = setHistData(res.unitAccuracyHist.unit1);
                let unit2HistData = setHistData(res.unitAccuracyHist.unit2);
                let unit3HistData = setHistData(res.unitAccuracyHist.unit3);
                let unit4HistData = setHistData(res.unitAccuracyHist.unit4);
                drawHist(unitAllHistData, unitAllHist);
                drawHist(unit1HistData, unit1Hist);
                drawHist(unit2HistData, unit2Hist);
                drawHist(unit3HistData, unit3Hist);
                drawHist(unit4HistData, unit4Hist);
            }
            else {
                
                let hint = document.querySelector(".analyzeHint");
                Array.prototype.forEach.call(chartContainer, el => {
                    el.classList.add("d-none");
                });

                hint.classList.remove("d-none");
            }

        },
        error: (err) => {
            console.log(err);
            alert(err);
        }
    })

})