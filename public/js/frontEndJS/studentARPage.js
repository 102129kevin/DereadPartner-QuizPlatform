window.addEventListener("load",()=>{

    let logo = document.querySelector(".logo");
    let logout = document.querySelector(".icon");

    logo.addEventListener("click",()=>{
        window.location.href = "/student";
    })

    logout.addEventListener("click",()=>{
        window.location.href = "/login/logout";
    })
})