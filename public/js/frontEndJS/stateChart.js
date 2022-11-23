export function setBarChartData(figLable, figData) {
    const data = {
        labels: figLable,
        datasets: [{
            label: '最近5次答題狀況長條圖',
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
            data: figData,
            borderWidth: 1
        }]
    };

    return data;
}

export function drawBarChart(barChartData, el) {
    const config = {
        type: 'bar',
        data: barChartData,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 0.1,
                        callback: function (value) {
                            return (value / this.max * 100).toFixed(0) + '%'; // convert it to percentage
                        }
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
        el,
        config
    );
}

export function setRadarChartData(radarChartData) {

    const data = {
        labels: ["單元一", "單元二", "單元三", "單元四"],
        datasets: [{
            label: '各單元能力雷達圖',
            backgroundColor: 'rgba(156, 189, 55, 0.2)',
            borderColor: 'rgb(156 ,189 ,55)',
            pointBackgroundColor: 'rgb(156, 189, 55)',
            data: radarChartData,
        }]
    };

    return data;
}

export function drawRadarChart(radarData, el) {
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
        el,
        radarConfig
    );
}

export function setHistData(unitHist) {
    let x_vals = [0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95];

    let backgroundColor = Array(x_vals.length).fill('rgba(156, 189, 55, 0.2)');
    let borderColor = Array(x_vals.length).fill('rgb(156 ,189 ,55)');

    let histData = {
        labels: x_vals,
        datasets: [{
            label: '正答率分佈',
            data: unitHist,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 1,
            barPercentage: 1,
            categoryPercentage: 1,
            borderRadius: 5,
        }]
    }

    return histData;
}

export function drawHist(histData, el) {
    const histConfig = {
        type: 'bar',
        data: histData,
        options: {
            scales: {
                x: {
                    type: 'linear',
                    offset: false,
                    grid: {
                        offset: false
                    },
                    ticks: {
                        stepSize: 0.1,
                        callback: function (value) {
                            return (value / this.max * 100).toFixed(0) + '%'; // convert it to percentage
                        }
                    },
                    title: {
                        display: true,
                        text: '答對率',
                        font: {
                            size: 14
                        }
                    }
                },
                y: {
                    // beginAtZero: true
                    title: {
                        display: true,
                        text: '次數',
                        font: {
                            size: 14
                        }
                    },
                    ticks: {
                        stepSize: 1
                    },
                    suggestedMin: 0,
                    suggestedMax: 15
                }
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    callbacks: {
                        // title: (items) => {
                        //     if (!items.length) {
                        //         return '';
                        //     }
                        //     const item = items[0];
                        //     const x = item.parsed.x;
                        //     const min = x - 0.5;
                        //     const max = x + 0.5;
                        //     return `Hours: ${min} - ${max}`;
                        // }
                    }
                }
            }
        }
    }

    const hist = new Chart(
        el,
        histConfig
    );


}

export function splitTimeInfo(timeRec) {
    let timeSplit = timeRec.split(" ");
    let date = timeSplit[0].split("/");
    let time = timeSplit[1].split(":");
    let result = [];
    result.push(date[1] + "/" + date[2] + "/" + date[0].replace("20", ""));
    result.push(time[0] + ":" + time[1]);

    return result;
}