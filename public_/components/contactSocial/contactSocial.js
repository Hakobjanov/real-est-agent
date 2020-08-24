fetch("/components/contactSocial/contactSocial.html")
  .then((response) => response.text())
  .then((contactSocialHtml) => {
    const div = document.createElement("div");
    div.innerHTML = contactSocialHtml;
    document.body.append(div);
  });
