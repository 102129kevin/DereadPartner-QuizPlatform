function dayStart(month, year) {
    var tmpDate = new Date(year, month, 1);
    return (tmpDate.getDay());
}

function daysMonth(month, year, month_olympic, month_normal) {
    var tmp = year % 4;
    if (tmp == 0) {
        return (month_olympic[month]);
    } else {
        return (month_normal[month]);
    }
}

function refreshDate(learnHint, ctitle, cyear, my_year, my_month, month_name, month_olympic, month_normal, exData) {

    // 清空內容
    $(".calendarBody_days").remove();

    let totalDay = daysMonth(my_month, my_year, month_olympic, month_normal);
    let firstDay = dayStart(my_month, my_year);

    // 迴圈計數器
    let liCounter = 0;
    let dayCounter = 0;
    let allDay = firstDay + totalDay;
    let dayRound = Math.ceil(allDay / 7);


    for (let i = 1; i <= dayRound; i++) {
        $("#calendarBody").append($("<div/>").addClass("calendarBody_item calendarBody_days").append($("<ul/>").addClass("d-flex flexDirectionRow")));

        for (let j = 1; j <= 7; j++) {
            liCounter++;

            let divTarget = "#calendarBody div.calendarBody_item:eq(" + i + ") ul";

            if (liCounter < allDay) {
                if (liCounter < firstDay) {
                    $(divTarget).append($("<li/>"));

                }
                else {
                    dayCounter++;

                    if (exData[month_name[my_month]]) {

                        if (exData[month_name[my_month]].includes(dayCounter.toString())) {
                            $(divTarget).append($("<li/>").append($("<div/>").addClass("margin-0-auto calendar_mark").text(dayCounter)));
                        }
                        else {
                            $(divTarget).append($("<li/>").text(dayCounter));
                        }
                    }
                }


            }
        }

    }

    // 設置標頭
    ctitle.innerHTML = month_name[my_month];
    cyear.innerHTML = my_year;

    // 設置提示文字
    if (exData[month_name[my_month]].length) {
        learnHint.innerHTML = (my_month + 1) + "月總共" + exData[month_name[my_month]].length + "天有做測驗喔~繼續保持";
    }
    else {
        learnHint.innerHTML = (my_month + 1) + "月尚未有作答紀錄，趕快來測驗學習吧!";
    }

}

window.addEventListener("load", () => {
    let month_olympic = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let month_normal = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let month_name = [
        "January", "Febrary", "March", "April",
        "May", "June", "July", "Auguest",
        "September", "October", "November", "December"
    ];

    let prev = document.getElementById("prev");
    let next = document.getElementById("next");
    let ctitle = document.querySelector(".monthText");
    let cyear = document.querySelector(".yearText");

    let my_date = new Date();
    let my_year = my_date.getFullYear();
    let my_month = my_date.getMonth();
    let my_day = my_date.getDate();

    let learnHint = document.getElementById("learnHint");
    let waiting = document.querySelector(".waiting");

    let exData;

    let logo = document.querySelector(".logo");
    let logout = document.querySelector(".icon");

    logo.addEventListener("click", () => {
        window.location.href = "/student";
    })

    logout.addEventListener("click", () => {
        window.location.href = "/login/logout";
    })

    fetch("/student/learnMap/data", {
        method: "GET"
    }).then((res) => {
        return res.json();
    }).then((data) => {

        // 移除等待畫面
        waiting.classList.remove("d-flex");
        waiting.classList.add("d-none");

        // 接收到資料
        exData = data

        // 渲染
        refreshDate(learnHint, ctitle, cyear, my_year, my_month, month_name, month_olympic, month_normal, exData);

    }).catch(err => {
        console.log(err);
        alert("查看錯誤");
    });



    prev.addEventListener("click", (event) => {
        event.preventDefault();

        my_month--;
        if (my_month < 0) {
            my_year--;
            my_month = 11;
        }

        refreshDate(learnHint, ctitle, cyear, my_year, my_month, month_name, month_olympic, month_normal, exData);

    })

    next.addEventListener("click", (event) => {
        event.preventDefault();

        my_month++;
        if (my_month > 11) {
            my_year++;
            my_month = 0;
        }

        refreshDate(learnHint, ctitle, cyear, my_year, my_month, month_name, month_olympic, month_normal, exData);
    })

})