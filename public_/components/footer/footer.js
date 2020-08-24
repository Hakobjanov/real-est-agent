fetch("/components/footer/footer.html")
  .then((response) => response.text())
  .then((footerHtml) => {
    const div = document.createElement("div");
    div.innerHTML = footerHtml;
    document.body.append(div);
  });
