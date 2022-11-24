window.addEventListener("load", () => {
    let logo = document.querySelector(".logo");
    let logout = document.querySelector(".icon");
    let quizButton = document.getElementById("quiz");
    let scanButton = document.getElementById("scan");
    let stateButton = document.getElementById("state");
    let reviewButton = document.getElementById("review");
    let today = document.getElementById("today");

    logo.addEventListener("click",()=>{
        window.location.href = "/student";
    })

    logout.addEventListener("click",()=>{
        window.location.href = "/login/logout";
    })

    quizButton.addEventListener("click", () => {
        window.location.href = "/student/quiz";
    });

    scanButton.addEventListener("click", () => {
        window.location.href = "/student/scan";
    });

    stateButton.addEventListener("click", () => {
        window.location.href = "/student/state";
    });

    reviewButton.addEventListener("click", () => {
        window.location.href = "/student/review";
    });
    
    today.innerHTML = getToday();
});

function getToday(){
    let day = new Date();
    let today = "統計至" + day.getFullYear() + "/" + (day.getMonth() + 1) + "/" + day.getDate();
    return today;
}