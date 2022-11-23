import {setBarChartData , drawBarChart , setRadarChartData , drawRadarChart , splitTimeInfo} from "./stateChart.js"

window.addEventListener("load", () => {
    let lineChartDOM = document.getElementById("lineChart").getContext("2d");
    let radarChartDOM = document.getElementById("radarChart").getContext("2d");
    let container = document.getElementsByClassName("chartContainer");

    // 要資料
    $.ajax({
        url: "/student/state/chart",
        method: "GET",
        success: (res) => {
            // 同一份資料可做折線圖與雷達圖

            // 折線圖
            // 製作圖表標籤、圖表資料
            let lineChartLabel = [];
            let lineChartData = [];

            if(res.length > 0){

                Array.prototype.forEach.call(container,el=>{
                    el.classList.remove("d-none");
                });

                if (res.length > 5) {
                    // 大於5筆-取前5筆資料
                    for (let i = res.length - 5; i < res.length; i++) {
                        // lineChartLabel.push(res[i].timeInfo);
    
                        // test
                        let label = splitTimeInfo(res[i].timeInfo);
                        lineChartLabel.push(label);
    
                        let recCorrectRate = res[i].qCorrectNum / res[i].qNum;
                        lineChartData.push(recCorrectRate);
                    }
                }
                else {
                    // 小於5筆
                    res.forEach(rec => {
                        // lineChartLabel.push(rec.timeInfo);
                        let label = splitTimeInfo(rec.timeInfo);
                        lineChartLabel.push(label);
    
                        lineChartData.push(rec.qCorrectNum / rec.qNum);
                    });
                }
    
                // 製圖
                let barData = setBarChartData(lineChartLabel,lineChartData);
                drawBarChart(barData,lineChartDOM);
                
                // 雷達圖
                // 製作圖表標籤、圖表資料
                // let radarChartLabel = ["單元1", "單元2", "單元3", "單元4"];
                let radarChartData = [];
    
                let qNum = [0, 0, 0, 0];
                let qCorrectNum = [0, 0, 0, 0];
    
                res.forEach((rec) => {
                    for (let i = 0; i < rec.qUnitCal.length; i++) {
                        qNum[i] += rec.qUnitCal[i].qNum;
                        qCorrectNum[i] += rec.qUnitCal[i].qCor;
                    }
                })
    
                for (let i = 0; i < qNum.length; i++) {
                    radarChartData.push(qCorrectNum[i] / qNum[i]);
                }
    
                // 製圖
                let radarData = setRadarChartData(radarChartData);
                drawRadarChart(radarData,radarChartDOM);
            }
            else {
                
                let hint = document.querySelector(".stateHint");

                Array.prototype.forEach.call(container,el=>{
                    el.classList.add("d-none");
                });

                hint.classList.remove("d-none");
            }

            
        },
        error: (err) => {
            console.log(err)
        },
    });



})