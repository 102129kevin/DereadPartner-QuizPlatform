import { setBarChartData, drawBarChart, setRadarChartData, drawRadarChart, splitTimeInfo } from "./stateChart.js"

window.addEventListener("load", () => {
    let logo = document.querySelector(".logo");
    let logout = document.querySelector(".icon");

    let initData;
    let titleToggle;
    let barChart;
    let radarChart;
    let waiting = document.querySelector(".waiting");

    logo.addEventListener("click",()=>{
        window.location.href = "/teacher";
    })

    logout.addEventListener("click",()=>{
        window.location.href = "/login/logout";
    })

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

    $.ajax({
        url: "/teacher/class/getInitData",
        method: "post",
        success: (res) => {
            // 隱藏等待畫面
            waiting.classList.remove("d-flex");
            waiting.classList.add("d-none");

            // 溫馨提示訊息
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
            toastr["success"]("您可以查看每位學生的作答狀況、能力分析圖表", "班級管理");

            // 初始化資料
            initData = res;

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
                                        .addClass("w-80 trClass-m-10-0")
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
                                                            .attr("colspan","2")
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
                                        .addClass("w-80 trClass-m-10-0")
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
                                                            .attr("colspan","2")
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