window.addEventListener("load", () => {
    let reviewAllButton = document.getElementById("reviewUnitAll");
    let reviewUnit1Button = document.getElementById("reviewUnit1");
    let reviewUnit2Button = document.getElementById("reviewUnit2");
    let reviewUnit3Button = document.getElementById("reviewUnit3");
    let reviewUnit4Button = document.getElementById("reviewUnit4");

    reviewAllButton.addEventListener("click", () => {
        window.location.href = "/student/review/unit/all";
    });

    reviewUnit1Button.addEventListener("click", () => {
        window.location.href = "/student/review/unit/1";
    });

    reviewUnit2Button.addEventListener("click", () => {
        window.location.href = "/student/review/unit/2";
    });

    reviewUnit3Button.addEventListener("click", () => {
        window.location.href = "/student/review/unit/3";
    });

    reviewUnit4Button.addEventListener("click", () => {
        window.location.href = "/student/review/unit/4";
    });
});