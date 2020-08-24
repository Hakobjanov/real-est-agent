fetch("/components/contactPhone/contactPhone.html")
  .then((response) => response.text())
  .then((contactPhoneHtml) => {
    const div = document.createElement("div");
    div.innerHTML = contactPhoneHtml;
    document.body.append(div);
  });
