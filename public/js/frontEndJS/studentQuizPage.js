window.addEventListener("load", () => {
    let quizAllButton = document.getElementById("quizUnitAll");
    let quizUnit1Button = document.getElementById("quizUnit1");
    let quizUnit2Button = document.getElementById("quizUnit2");
    let quizUnit3Button = document.getElementById("quizUnit3");
    let quizUnit4Button = document.getElementById("quizUnit4");

    quizAllButton.addEventListener("click", () => {
        window.location.href = "/student/quiz/unit/all";
    });

    quizUnit1Button.addEventListener("click", () => {
        window.location.href = "/student/quiz/unit/1";
    });

    quizUnit2Button.addEventListener("click", () => {
        window.location.href = "/student/quiz/unit/2";
    });

    quizUnit3Button.addEventListener("click", () => {
        window.location.href = "/student/quiz/unit/3";
    });

    quizUnit4Button.addEventListener("click", () => {
        window.location.href = "/student/quiz/unit/4";
    });
});