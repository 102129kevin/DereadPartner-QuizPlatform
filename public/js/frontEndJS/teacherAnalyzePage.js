window.addEventListener("load", () => {
    let initData;
    

    $.ajax({
        url: "/teacher/analyze/getInitData",
        method: "post",
        success: (res) => {
            initData = res;
            console.log(initData);

            // 渲染一堆有的沒的
            renderPage(initData);

            let titleToggle = document.getElementsByClassName("titleToggle");
            Array.prototype.forEach.call(titleToggle, el => {
                el.addEventListener("click", (e) => {
                    // 取得抽屜內容節點
                    let content = e.currentTarget.parentNode.nextElementSibling;
                    // let panel = e.currentTarget.parentNode.nextElementSibling.parentNode.parentNode;

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

        },
        error: (err) => {
            console.log(err);
            alert(err);
        }
    })
})

function renderPage(data) {
    for (let i = 0; i < data.length; i++) {
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
                            .attr("src","/public/assest/tr_exam/extend.png")
                        )
                        // .click(()=>{
                        //     if($(this).parent().next().hasClass("d-none")){
                        //         $(this).parent().next().removeClass("d-none")
                        //         $(this).parent().next().slideDown()
                        //     }
                        //     else{
                        //         $(this).parent().next().addClass("d-none")
                        //         $(this).parent().next().slideUp()
                        //     }
                        // })
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
                            .attr("src","/public/assest/stu_state/correctRate.png")
                        )
                        .append(
                            $("<canvas/>")
                            .addClass("lineChart background-white")
                            .attr("width","250")
                            .attr("height","250")
                        )
                    )
                    .append(
                        $("<div/>")
                        .addClass("chartContainer")
                        .append(
                            $("<img/>")
                            .addClass("lineChart chartTitle")
                            .attr("src","/public/assest/stu_state/radarChart.png")
                        )
                        .append(
                            $("<canvas/>")
                            .attr("width","250")
                            .attr("height","250")
                        )
                    )
                    .append(
                        $("<div/>")
                        .addClass("totalNum")
                        .html("總作答次數:" + data[i].totalNum)
                    )
                    .append(
                        $("<div/>")
                        .addClass("totalQNum")
                        .html("總作答題數:" + data[i].totalQNum)
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

        // <div class="menuPanel background-white">
        //     <div class="menuOuter margin-0-auto">
        //         <div class="menuTitle d-flex flexDirectionRow">
        //             <div>s13110340xx陳楚瑜</div>
        //             <button class="titleToggle cAlign borderNone background-trasparent">
        //                 <img src="/public/assest/tr_exam/extend.png" />
        //             </button>
        //         </div>
        //         <div class="menuContent d-none">
        //             <div class="chartContainer">
        //                 <img src="/public/assest/stu_state/correctRate.png" class="chartTitle" />
        //                 <canvas width="250" height="250" class="lineChart background-white"></canvas>
        //             </div>
        //             <div class="chartContainer">
        //                 <img src="/public/assest/stu_state/radarChart.png" class="lineChart chartTitle" />
        //                 <canvas width="250" height="250"></canvas>
        //             </div>
        //             <div class="totalNum">總作答次數:</div>
        //             <div class="totalQNum">總作答題數:</div>
        //             <div class="totalRate">總答對率:</div>
        //             <div class="lastTestTime">上次測驗時間:</div>
        //             <div>各單元作答次數:</div>
        //             <div class="unitAllNum">總複習作答次數:</div>
        //             <div class="unit1Num">單元1作答次數:</div>
        //             <div class="unit2Num">單元2作答次數:</div>
        //             <div class="unit3Num">單元3作答次數:</div>
        //             <div class="unit4Num">單元4作答次數:</div>
        //         </div>
        //     </div>
        // </div>
    }
}