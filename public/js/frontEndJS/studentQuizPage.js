window.addEventListener("load", () => {
    let quizAllButton = document.getElementById("quizUnitAll");
    let quizUnit1Button = document.getElementById("quizUnit1");
    let quizUnit2Button = document.getElementById("quizUnit2");

    quizAllButton.addEventListener("click", () => {
        window.location.href = "/student/quiz/unit/all";
    });

    quizUnit1Button.addEventListener("click", () => {
        window.location.href = "/student/quiz/unit/1";
    });

    quizUnit2Button.addEventListener("click", () => {
        window.location.href = "/student/quiz/unit/2";
    });
});