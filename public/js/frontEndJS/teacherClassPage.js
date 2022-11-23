import { setBarChartData, drawBarChart, setRadarChartData, drawRadarChart, splitTimeInfo } from "./stateChart.js"

window.addEventListener("load", () => {
    let initData;
    let titleToggle;
    let barChart;
    let radarChart;

    $.ajax({
        url: "/teacher/class/getInitData",
        method: "post",
        success: (res) => {
            initData = res;

            // 渲染一堆有的沒的
            renderPage(initData);

            // 事件監聽
            titleToggle = document.getElementsByClassName("titleToggle");
            Array.prototype.forEach.call(titleToggle, el => {
                el.addEventListener("click", (e) => {
                    // 取得抽屜內容節點
                    let content = e.currentTarget.parentNode.nextElementSibling;

                    // 判斷內容節點是否隱藏，使用jquey提供的slide方法進行伸縮
                    if (window.getComputedStyle(content).display != "none") {
                        $(content).slideUp();
                        // // 邊界特效
                        // $(panel).removeClass("menuPanel_borderOpen");
                    }
                    else {
                        $(content).slideDown();
                        // // 邊界特效
                        // $(panel).addClass("menuPanel_borderOpen");
                    }
                })
            });

            // 繪圖-長條圖
            barChart = document.getElementsByClassName("barChart");

            // 修改時間標籤
            initData.forEach((rec) => {
                if (rec.barData) {
                    for (let i = 0; i < rec.barData.label.length; i++) {
                        rec.barData.label[i] = splitTimeInfo(rec.barData.label[i]);
                    }
                }

            });

            for (let i = 0; i < barChart.length; i++) {
                if (initData[i].barData) {
                    let barChartData = setBarChartData(initData[i].barData.label, initData[i].barData.data);
                    drawBarChart(barChartData, barChart[i]);
                }
            }

            // 繪圖-雷達圖
            radarChart = document.getElementsByClassName("radarChart");
            for (let i = 0; i < radarChart.length; i++) {
                if (initData[i].radarData) {
                    let radarChartData = setRadarChartData(initData[i].radarData);
                    drawRadarChart(radarChartData, radarChart[i]);
                }
            }

        },
        error: (err) => {
            console.log(err);
            alert(err);
        }
    })
})

function renderPage(data) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].lastTestTime) {
            $("section").append(
                $("<div/>")
                    .addClass("menuPanel background-white")
                    .append(
                        $("<div/>")
                            .addClass("menuOuter margin-0-auto")
                            .append(
                                $("<div/>")
                                    .addClass("menuTitle d-flex flexDirectionRow")
                                    .append(
                                        $("<div/>").html(
                                            data[i].sID + " " + data[i].name
                                        )
                                    )
                                    .append(
                                        $("<button/>")
                                            .addClass("titleToggle cAlign borderNone background-trasparent")
                                            .append(
                                                $("<img/>")
                                                    .attr("src", "/public/assest/tr_exam/extend.png")
                                            )
                                    )
                            )
                            .append(
                                $("<div/>")
                                    .addClass("menuContent d-none")
                                    .append(
                                        $("<div/>")
                                            .addClass("chartContainer")
                                            .append(
                                                $("<img/>")
                                                    .addClass("chartTitle")
                                                    .attr("src", "/public/assest/stu_state/correctRate.png")
                                            )
                                            .append(
                                                $("<canvas/>")
                                                    .addClass("barChart background-white")
                                                    .attr("width", "250")
                                                    .attr("height", "250")
                                            )
                                    )
                                    .append(
                                        $("<div/>")
                                            .addClass("chartContainer")
                                            .append(
                                                $("<img/>")
                                                    .addClass("chartTitle")
                                                    .attr("src", "/public/assest/stu_state/radarChart.png")
                                            )
                                            .append(
                                                $("<canvas/>")
                                                    .addClass("radarChart")
                                                    .attr("width", "250")
                                                    .attr("height", "250")
                                            )
                                    )
                                    .append(
                                        $("<div/>")
                                            .addClass("totalNum")
                                            .html("總作答題數:" + data[i].totalNum)
                                    )
                                    .append(
                                        $("<div/>")
                                            .addClass("totalQNum")
                                            .html("總答對題數:" + data[i].totalQNum)
                                    )
                                    .append(
                                        $("<div/>")
                                            .addClass("totalRate")
                                            .html("總答對率:" + data[i].totalRate)
                                    )
                                    .append(
                                        $("<div/>")
                                            .addClass("lastTestTime")
                                            .html("上次測驗時間:" + data[i].lastTestTime)
                                    )
                                    .append(
                                        $("<div/>")
                                            .html("各單元作答次數:")
                                    )
                                    .append(
                                        $("<div/>")
                                            .addClass("unitAllNum")
                                            .html("總複習作答次數:" + data[i].unitNum.unitAll)
                                    )
                                    .append(
                                        $("<div/>")
                                            .addClass("unit1Num")
                                            .html("單元1作答次數:" + data[i].unitNum.unit1)
                                    )
                                    .append(
                                        $("<div/>")
                                            .addClass("unit2Num")
                                            .html("單元2作答次數:" + data[i].unitNum.unit2)
                                    )
                                    .append(
                                        $("<div/>")
                                            .addClass("unit3Num")
                                            .html("單元3作答次數:" + data[i].unitNum.unit3)
                                    )
                                    .append(
                                        $("<div/>")
                                            .addClass("unit4Num")
                                            .html("單元4作答次數:" + data[i].unitNum.unit4)
                                    )
                            )
                    )
            )
        }
        else {
            $("section").append(
                $("<div/>")
                    .addClass("menuPanel background-white")
                    .append(
                        $("<div/>")
                            .addClass("menuOuter margin-0-auto")
                            .append(
                                $("<div/>")
                                    .addClass("menuTitle d-flex flexDirectionRow")
                                    .append(
                                        $("<div/>").html(
                                            data[i].sID + " " + data[i].name
                                        )
                                    )
                                    .append(
                                        $("<button/>")
                                            .addClass("titleToggle cAlign borderNone background-trasparent")
                                            .append(
                                                $("<img/>")
                                                    .attr("src", "/public/assest/tr_exam/extend.png")
                                            )
                                    )
                            )
                            .append(
                                $("<div/>")
                                    .addClass("menuContent d-none")
                                    .append(
                                        $("<div/>")
                                            .addClass("chartContainer d-none")
                                            .append(
                                                $("<img/>")
                                                    .addClass("chartTitle")
                                                    .attr("src", "/public/assest/stu_state/correctRate.png")
                                            )
                                            .append(
                                                $("<canvas/>")
                                                    .addClass("barChart background-white")
                                                    .attr("width", "250")
                                                    .attr("height", "250")
                                            )
                                    )
                                    .append(
                                        $("<div/>")
                                            .addClass("chartContainer d-none")
                                            .append(
                                                $("<img/>")
                                                    .addClass("chartTitle")
                                                    .attr("src", "/public/assest/stu_state/radarChart.png")
                                            )
                                            .append(
                                                $("<canvas/>")
                                                    .addClass("radarChart")
                                                    .attr("width", "250")
                                                    .attr("height", "250")
                                            )
                                    )
                                    .append(
                                        $("<div/>")
                                            .html("這位同學尚未有作答紀錄唷~")
                                    )

                            )
                    )
            )
        }
    }
}