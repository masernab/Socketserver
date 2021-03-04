const miFormulario = document.querySelector("form");

const url = "http://localhost:8080/api/auth/";
miFormulario.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = {};
  for (let elemento of miFormulario.elements) {
    if (elemento.name.length > 0) formData[elemento.name] = elemento.value;
  }
  fetch(url + "login", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then(({ msg, token }) => {
      if (msg) {
        return console.error(msg);
      }
      localStorage.setItem("token", token);
      window.location = "chat.html";
    })
    .catch((err) => console.log(err));
});

function onSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token;
  data = { id_token };
  fetch(url + "google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((resp) => resp.json())
    .then(({ token }) => {
      localStorage.setItem("token", token);
      window.location = "chat.html";
    })
    .catch(console.log);
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    localStorage.clear();
  });
}
