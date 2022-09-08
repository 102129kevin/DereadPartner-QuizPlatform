window.addEventListener("load", function (event) {
  const mobileMenu = document.querySelector(".mobile-menu");
  const navbar = document.querySelector(".navbar");
  mobileMenu.addEventListener("click", function () {
    navbar.classList.toggle("open");
  });
});
