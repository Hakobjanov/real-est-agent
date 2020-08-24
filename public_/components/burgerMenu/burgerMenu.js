fetch("/components/burgerMenu/index.htm")
  .then((response) => response.text())
  .then((htm) => {
    const div = document.createElement("div");
    div.innerHTML = htm;
    document.body.append(div);

    const menuIcon = div.querySelector(".menu-wrapper");
    const navBar = div.querySelector(".nav");
    const overlay = document.querySelector(".overlay");

    setTimeout(() => (menuIcon.style.opacity = 1));

    menuIcon.addEventListener("click", toggleMenu);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        toggleMenu();
      }
    });

    function toggleMenu() {
      if (overlay.hidden) {
        overlay.hidden = false;
        setTimeout(() => {
          overlay.classList.add("active");
          navBar.classList.add("open");
          menuIcon.classList.add("open");
        });
      } else {
        navBar.classList.remove("open");
        menuIcon.classList.remove("open");
        overlay.classList.remove("active");
        navBar.ontransitionend = () => {
          overlay.hidden = true;
          navBar.ontransitionend = null;
        };
      }
    }
  });
