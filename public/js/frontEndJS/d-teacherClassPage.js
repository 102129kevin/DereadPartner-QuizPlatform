import { setBarChartData, drawBarChart, setRadarChartData, drawRadarChart, splitTimeInfo } from "./stateChart.js"

window.addEventListener("load", () => {
    let logo = document.querySelector(".logo");
    let logout = document.querySelector(".icon");

    let initData;
    let titleToggle;
    let barChart;
    let radarChart;
    let waiting = document.querySelector(".waiting");

    // logo.addEventListener("click", () => {
    //     window.location.href = "/teacher";
    // })

    // logout.addEventListener("click", () => {
    //     window.location.href = "/login/logout";
    // })


    waiting.classList.remove("d-flex");
    waiting.classList.add("d-none");

    // 初始化資料
    initData = [{ "sID": "s1311034091", "name": "小美", "barData": { "data": [0.9, 0.6, 1, 0.6, 0.6], "label": ["2022/11/21 2:51:32", "2022/11/21 2:54:17", "2022/11/21 2:55:14", "2022/11/21 2:55:40", "2022/11/21 2:56:17"] }, "radarData": [0.75, 0.9375, 0.7333333333333333, 0.6923076923076923], "totalRate": 0.7833333333333333, "totalNum": 60, "totalQNum": 47, "lastTestTime": "2022/11/21 2:56:17", "unitNum": { "unit1": 1, "unit2": 1, "unit3": 1, "unit4": 1, "unitAll": 2 } }, { "sID": "s1311034092", "name": "小鴻", "barData": { "data": [0.6, 0.5], "label": ["2022/11/21 2:57:14", "2022/11/21 2:57:35"] }, "radarData": [0.5, 0.5454545454545454, 0.6666666666666666, 0.5], "totalRate": 0.55, "totalNum": 20, "totalQNum": 11, "lastTestTime": "2022/11/21 2:57:35", "unitNum": { "unit1": 0, "unit2": 1, "unit3": 0, "unit4": 0, "unitAll": 1 } }, { "sID": "s1311034093", "name": "小光", "barData": { "data": [0.5, 0.6], "label": ["2022/11/21 2:58:31", "2022/11/21 2:58:53"] }, "radarData": [0, 0, 0.5, 0.6], "totalRate": 0.55, "totalNum": 20, "totalQNum": 11, "lastTestTime": "2022/11/21 2:58:53", "unitNum": { "unit1": 0, "unit2": 0, "unit3": 1, "unit4": 1, "unitAll": 0 } }, { "sID": "s1311034094", "name": "小恩", "barData": { "data": [0.4, 0.5], "label": ["2022/11/21 2:59:40", "2022/11/21 2:59:59"] }, "radarData": [0, 0.5, 0.6666666666666666, 0], "totalRate": 0.45, "totalNum": 20, "totalQNum": 9, "lastTestTime": "2022/11/21 2:59:59", "unitNum": { "unit1": 0, "unit2": 1, "unit3": 0, "unit4": 0, "unitAll": 1 } }, { "sID": "s1311034095", "name": "小蓁", "barData": { "data": [0.4, 1, 0.8, 0.6, 0.4], "label": ["2022/11/21 3:01:05", "2022/11/21 3:01:46", "2022/11/21 3:02:19", "2022/11/21 3:02:46", "2022/11/21 3:03:03"] }, "radarData": [0.5333333333333333, 1, 0.6129032258064516, 1], "totalRate": 0.6833333333333333, "totalNum": 60, "totalQNum": 41, "lastTestTime": "2022/11/21 3:03:03", "unitNum": { "unit1": 1, "unit2": 1, "unit3": 3, "unit4": 0, "unitAll": 1 } }, { "sID": "s1311034099", "name": "測試機", "barData": { "data": [0.2, 0.3, 0.4, 0.8, 0.2], "label": ["2022/12/6 10:48:46", "2022/12/6 13:56:10", "2022/12/6 13:58:40", "2022/12/6 13:59:09", "2022/12/6 14:00:25"] }, "radarData": [0.515625, 0.4444444444444444, 0.6923076923076923, 0.3333333333333333], "totalRate": 0.5, "totalNum": 110, "totalQNum": 55, "lastTestTime": "2022/12/6 14:00:25", "unitNum": { "unit1": 5, "unit2": 0, "unit3": 0, "unit4": 1, "unitAll": 5 } }];

    // 渲染一堆有的沒的
    renderPage(initData);

    // 事件監聽
    titleToggle = document.getElementsByClassName("titleToggle");
    Array.prototype.forEach.call(titleToggle, el => {
        el.addEventListener("click", (e) => {
            // 取得抽屜內容節點
            let content = e.currentTarget.parentNode.nextElementSibling;
            let panel = e.currentTarget.parentNode.parentNode.parentNode;

            // 判斷內容節點是否隱藏，使用jquey提供的slide方法進行伸縮
            if (window.getComputedStyle(content).display != "none") {
                $(content).slideUp();
                // // 邊界特效
                $(panel).removeClass("menuPanel_borderOpen");
            }
            else {
                $(content).slideDown();
                // // 邊界特效
                $(panel).addClass("menuPanel_borderOpen");
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

})

function renderPage(data) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].lastTestTime) {
            let correctRate = ((Math.round(data[i].totalRate * 1000) / 1000) * 100).toFixed(2);
            let lastTestTime = data[i].lastTestTime.split(" ");

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
                                            .addClass("d-flex flexAlignCneter outer")
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
                                    )
                                    .append(
                                        $("<div/>")
                                            .addClass("trClass_table_container")
                                            .append(
                                                $("<div/>")
                                                    .addClass("tr_wrap_outer")
                                                    .append(
                                                        $("<div/>")
                                                            .addClass("tr_wrap")
                                                            .append(
                                                                $("<table/>")
                                                                    .addClass("font-size-18 w-100 trClass_table")
                                                                    .append(
                                                                        $("<thead/>")
                                                                            .addClass("color-white trClass_tHead trClass_table_high1")
                                                                            .append(
                                                                                $("<tr/>")
                                                                                    .append(
                                                                                        $("<th/>")
                                                                                            .attr("colspan", "2")
                                                                                            .html("作答概況")
                                                                                    )
                                                                            )
                                                                    )
                                                                    .append(
                                                                        $("<tbody/>")
                                                                            .addClass("trClass_tBody")
                                                                            .append(
                                                                                $("<tr/>")
                                                                                    .addClass("background-white2 trClass_table_high")
                                                                                    .append(
                                                                                        $("<td/>")
                                                                                            .addClass("w-60 trClass_tBody_title b-box")
                                                                                            .html("總作答題數")
                                                                                    )
                                                                                    .append(
                                                                                        $("<td/>")
                                                                                            .addClass("w-40 rAlign b-box")
                                                                                            .html(data[i].totalNum)
                                                                                    )
                                                                            )
                                                                            .append(
                                                                                $("<tr/>")
                                                                                    .addClass("trClass_table_high")
                                                                                    .append(
                                                                                        $("<td/>")
                                                                                            .addClass("w-60 trClass_tBody_title b-box")
                                                                                            .html("總答對題數")
                                                                                    )
                                                                                    .append(
                                                                                        $("<td/>")
                                                                                            .addClass("w-40 rAlign b-box")
                                                                                            .html(data[i].totalQNum)
                                                                                    )
                                                                            )
                                                                            .append(
                                                                                $("<tr/>")
                                                                                    .addClass("background-white2 trClass_table_high")
                                                                                    .append(
                                                                                        $("<td/>")
                                                                                            .addClass("w-60 trClass_tBody_title b-box")
                                                                                            .html("總答對率")
                                                                                    )
                                                                                    .append(
                                                                                        $("<td/>")
                                                                                            .addClass("w-40 rAlign b-box")
                                                                                            .html(correctRate + "%")
                                                                                    )
                                                                            )
                                                                            .append(
                                                                                $("<tr/>")
                                                                                    .addClass("trClass_table_high")
                                                                                    .append(
                                                                                        $("<td/>")
                                                                                            .addClass("w-60 trClass_tBody_title b-box")
                                                                                            .html("上次測驗時間")
                                                                                    )
                                                                                    .append(
                                                                                        $("<td/>")
                                                                                            .addClass("w-40 rAlign b-box")
                                                                                            .html(lastTestTime[0] + "<br/>" + lastTestTime[1])
                                                                                    )
                                                                            )
                                                                    )
                                                            )
                                                    )

                                            )
                                            .append(
                                                $("<div/>")
                                                    .addClass("tr_wrap_outer")
                                                    .append(
                                                        $("<div/>")
                                                            .addClass("tr_wrap")
                                                            .append(
                                                                $("<table/>")
                                                                    .addClass("font-size-18 w-100 trClass_table")
                                                                    .append(
                                                                        $("<thead/>")
                                                                            .addClass("color-white trClass_tHead trClass_table_high1")
                                                                            .append(
                                                                                $("<tr/>")
                                                                                    .append(
                                                                                        $("<th/>")
                                                                                            .attr("colspan", "2")
                                                                                            .html("各單元作答次數")
                                                                                    )
                                                                            )
                                                                    )
                                                                    .append(
                                                                        $("<tbody/>")
                                                                            .addClass("trClass_tBody")
                                                                            .append(
                                                                                $("<tr/>")
                                                                                    .addClass("trClass_table_high")
                                                                                    .append(
                                                                                        $("<td/>")
                                                                                            .addClass("w-60 trClass_tBody_title b-box")
                                                                                            .html("總複習")
                                                                                    )
                                                                                    .append(
                                                                                        $("<td/>")
                                                                                            .addClass("w-40 rAlign b-box")
                                                                                            .html(data[i].unitNum.unitAll)
                                                                                    )
                                                                            )
                                                                            .append(
                                                                                $("<tr/>")
                                                                                    .addClass("background-white2 trClass_table_high")
                                                                                    .append(
                                                                                        $("<td/>")
                                                                                            .addClass("w-60 trClass_tBody_title b-box")
                                                                                            .html("單元1")
                                                                                    )
                                                                                    .append(
                                                                                        $("<td/>")
                                                                                            .addClass("w-40 rAlign b-box")
                                                                                            .html(data[i].unitNum.unit1)
                                                                                    )
                                                                            )
                                                                            .append(
                                                                                $("<tr/>")
                                                                                    .addClass("trClass_table_high")
                                                                                    .append(
                                                                                        $("<td/>")
                                                                                            .addClass("w-60 trClass_tBody_title b-box")
                                                                                            .html("單元2")
                                                                                    )
                                                                                    .append(
                                                                                        $("<td/>")
                                                                                            .addClass("w-40 rAlign b-box")
                                                                                            .html(data[i].unitNum.unit2)
                                                                                    )
                                                                            )
                                                                            .append(
                                                                                $("<tr/>")
                                                                                    .addClass("background-white2 trClass_table_high")
                                                                                    .append(
                                                                                        $("<td/>")
                                                                                            .addClass("w-60 trClass_tBody_title b-box")
                                                                                            .html("單元3")
                                                                                    )
                                                                                    .append(
                                                                                        $("<td/>")
                                                                                            .addClass("w-40 rAlign b-box")
                                                                                            .html(data[i].unitNum.unit3)
                                                                                    )
                                                                            )
                                                                            .append(
                                                                                $("<tr/>")
                                                                                    .addClass("trClass_table_high")
                                                                                    .append(
                                                                                        $("<td/>")
                                                                                            .addClass("w-60 trClass_tBody_title b-box")
                                                                                            .html("單元4")
                                                                                    )
                                                                                    .append(
                                                                                        $("<td/>")
                                                                                            .addClass("w-40 rAlign b-box")
                                                                                            .html(data[i].unitNum.unit4)
                                                                                    )
                                                                            )
                                                                    )
                                                            )
                                                    )

                                            )
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