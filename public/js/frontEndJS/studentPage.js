window.addEventListener("load", () => {
    let quizButton = document.getElementById("quiz");

    quizButton.addEventListener("click", () => {
        window.location.href = "/student/quiz";
    });
});