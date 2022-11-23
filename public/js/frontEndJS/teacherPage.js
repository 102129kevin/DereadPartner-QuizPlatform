window.addEventListener("load", () => {
    let examButton = document.getElementById("exam");
    let examListButton = document.getElementById("examList");
    let analysisButton = document.getElementById("analysis");
    let classButton = document.getElementById("class");

    examButton.addEventListener("click", () => {
        window.location.href = "/teacher/exam";
    })

    examListButton.addEventListener("click", () => {
        window.location.href = "/teacher/examList";
    })

    analysisButton.addEventListener("click", () => {
        window.location.href = "/teacher/analyze";
    })

    classButton.addEventListener("click", () => {
        window.location.href = "/teacher/class";
    })
})