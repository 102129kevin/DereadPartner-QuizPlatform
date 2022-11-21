window.addEventListener("load", () => {
    let quizButton = document.getElementById("quiz");
    let scanButton = document.getElementById("scan");
    let stateButton = document.getElementById("state");
    let reviewButton = document.getElementById("review");

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
});