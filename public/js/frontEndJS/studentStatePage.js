function splitTimeInfo(timeRec) {
    let timeSplit = timeRec.split(" ");
    let date = timeSplit[0].split("/");
    let time = timeSplit[1].split(":");
    let result = [];
    result.push(date[1] + "/" + date[2] + "/" + date[0].replace("20", ""));
    result.push(time[0] + ":" + time[1]);

    return result;
}

window.addEventListener("load", () => {
    let lineChartDOM = document.getElementById("lineChart").getContext("2d");
    let radarChartDOM = document.getElementById("radarChart").getContext("2d");

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
            const data = {
                labels: lineChartLabel,
                datasets: [{
                    label: '最近5次答題狀況折線圖',
                    backgroundColor: [
                        "rgba(255,176,193,0.3)",
                        "rgba(255,197,135,0.3)",
                        "rgba(255,222,108,0.3)",
                        "rgba(93,243,241,0.3)",
                        "rgba(59,168,252,0.3)"
                    ],
                    borderColor: [
                        "rgb(254,99,132)",
                        "rgb(255,159,65)",
                        "rgb(255,205,86)",
                        "rgb(76,192,192)",
                        "rgb(54,162,235)"
                    ],
                    data: lineChartData,
                    borderWidth: 1
                }]
            };

            const config = {
                type: 'bar',
                data: data,
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 0.1,
                                callback: function (value) {
                                    return (value / this.max * 100).toFixed(0) + '%'; // convert it to percentage
                                },
                            },
                            suggestedMin: 0,
                            suggestedMax: 1
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        customCanvasBackgroundColor: {
                            color: 'white',
                        }
                    }
                }
            };

            const setlineChart = new Chart(
                lineChartDOM,
                config
            );

            // 雷達圖
            // 製作圖表標籤、圖表資料
            let radarChartLabel = ["單元1", "單元2", "單元3", "單元4"];
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
            const radarData = {
                labels: radarChartLabel,
                datasets: [{
                    label: '各單元能力雷達圖',
                    backgroundColor: 'rgba(156, 189, 55, 0.2)',
                    borderColor: 'rgb(156 ,189 ,55)',
                    pointBackgroundColor: 'rgb(156, 189, 55)',
                    data: radarChartData,
                }]
            };

            const radarConfig = {
                type: 'radar',
                data: radarData,
                options: {
                    elements: {
                        line: {
                            borderWidth: 3
                        }
                    },
                    scales: {
                        r: {
                            ticks: {
                                backdropColor: "rgba(0,0,0,0)",
                                stepSize: 0.2,
                                callback: function (value) {
                                    return (value / this.max * 100).toFixed(0) + '%'; // convert it to percentage
                                },
                            },
                            angleLines: {
                                display: false
                            },
                            pointLabels: {
                                font: {
                                    size: 20
                                }
                            },
                            suggestedMin: 0,
                            suggestedMax: 1
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            };

            const radarChart = new Chart(
                radarChartDOM,
                radarConfig
            );
        },
        error: (err) => {
            console.log(err)
        },
    });



})