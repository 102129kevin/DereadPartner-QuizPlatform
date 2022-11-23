import { setRadarChartData, drawRadarChart, setHistData, drawHist } from "./stateChart.js";

function checkHist(data) {
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (data[i][j] != 0) {
                return true;
            }
        }
    }

    return false;
}

window.addEventListener("load", () => {

    let radar = document.getElementById("radarChart");
    let unitAllHist = document.getElementById("unitAllHist");
    let unit1Hist = document.getElementById("unit1Hist");
    let unit2Hist = document.getElementById("unit2Hist");
    let unit3Hist = document.getElementById("unit3Hist");
    let unit4Hist = document.getElementById("unit4Hist");

    $.ajax({
        url: "/teacher/analyze/getInitData",
        method: "POST",
        success: (res) => {

            if (checkHist(res.unitAccuracyHist)) {
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
                let chartContainer = document.getElementsByClassName("chartContainer");
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