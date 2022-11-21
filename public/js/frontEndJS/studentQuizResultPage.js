window.addEventListener("load", () => {
    let changeUnit = document.getElementById("changeUnit");
    let testAgain = document.getElementById("testAgain");
    let goIndex = document.getElementById("goIndex");
    let qUnit = document.getElementById("qUnit");

    changeUnit.addEventListener("click", () => {
        window.location.href = "/student/quiz";
    })

    testAgain.addEventListener("click", () => {
        let reqUnit = qUnit.innerHTML.trim();
        window.location.href = "/student/quiz/unit/" + reqUnit;
    })

    goIndex.addEventListener("click",() => {
        window.location.href="/student"
    })
})