const sideBar = document.querySelector(".bars-btn");
const navbarMenu = document.querySelector(".navbar-menu");
const navbarLinks = document.getElementsByClassName("navbar-menu-links")[0];
const navbarLogo = document.getElementsByClassName("navbar-logo");

sideBar.addEventListener("click", () => {
  navbarMenu.classList.toggle("show");
});
