fetch("/components/logo/logo.html")
  .then((response) => response.text())
  .then((logoHtml) => {
    const div = document.createElement("div");
    div.innerHTML = logoHtml;
    document.body.append(div);
  });
