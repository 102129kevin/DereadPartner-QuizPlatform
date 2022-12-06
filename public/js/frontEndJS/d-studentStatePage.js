import { setBarChartData, drawBarChart, setRadarChartData, drawRadarChart } from "./stateChart.js"

window.addEventListener("load", () => {
    let logo = document.querySelector(".logo");
    let logout = document.querySelector(".icon");
    let lineChartDOM = document.getElementById("lineChart").getContext("2d");
    let radarChartDOM = document.getElementById("radarChart").getContext("2d");
    let container = document.getElementsByClassName("chartContainer");

    Array.prototype.forEach.call(container, el => {
        el.classList.remove("d-none");
    });
    let lineChartLabel = [['12/5/22', '12:57'], ['12/6/22', '13:56'], ['12/6/22', '13:58'], ['12/6/22', '13:59'], ['12/6/22', '14:00']];
    let lineChartData = [1, 0.3, 0.4, 0.8, 0.2];

    // 製圖
    let barData = setBarChartData(lineChartLabel, lineChartData);
    drawBarChart(barData, lineChartDOM);

    // 雷達圖
    let radarChartData = [0.5740740740740741, 0.4444444444444444, 0.6923076923076923, 0.3333333333333333];

    // 製圖
    let radarData = setRadarChartData(radarChartData);
    drawRadarChart(radarData, radarChartDOM);


})