const url = "http://localhost:8080/api/auth/";

let usuarioAutenticado = null;
let socket = null;

const txtUid = document.querySelector("#txtUid");
const txtMensaje = document.querySelector("#txtMensaje");
const ulUsuarios = document.querySelector("#ulUsuarios");
const ulMensajes = document.querySelector("#ulMensajes");
const btnSalir = document.querySelector("#btnSalir");

const validarJWT = async () => {
  const token = localStorage.getItem("token") || "";
  if (token.length <= 10) {
    window.location = "index.html";
    throw new Error("No hay token");
  }
  const resp = await fetch(url, {
    headers: { "x-token": token },
  });
  const { usuarioAutenticado: userDB, token: tokenDB } = await resp.json();
  localStorage.setItem("token", tokenDB);
  usuarioAutenticado = userDB;
  document.title = usuarioAutenticado.nombre;

  await conectarSocket();
};

txtMensaje.addEventListener("keyup", ({ keyCode }) => {
  const mensaje = txtMensaje.value.trim();
  const uid = txtUid.value.trim();
  //Si no se presiona Enter
  if (keyCode !== 13) {
    return;
  }
  //Si el mensaje es vacio
  if (mensaje === "") {
    return;
  }
  socket.emit("enviar-mensaje", { mensaje, uid });
  txtMensaje.value = "";
});

const main = () => {
  validarJWT();
};

const conectarSocket = async () => {
  socket = io({
    extraHeaders: { "x-token": localStorage.getItem("token") },
  });

  socket.on("connect", () => {
    console.log("socket online");
  });

  socket.on("disconnect", () => {
    console.log("socket offline");
  });

  socket.on("recibir-mensaje", dibujarMensajes);
  socket.on("usuarios-activos", dibujarUsuarios);
  socket.on("mensaje-privado", (payload) => {
    console.log("privado ", payload);
  });
};

const dibujarUsuarios = (usuarios = []) => {
  let userHTML = "";
  usuarios.forEach(({ nombre, uid }) => {
    userHTML += `<li>
        <p>
          <h5 class="text-success">${nombre}</h5>
          <span class="fs-6 text-muted">${uid}</span>
        </p>
      </li>`;
  });
  ulUsuarios.innerHTML = userHTML;
};

const dibujarMensajes = (mensajes = []) => {
  let mensajesHTML = "";
  mensajes.reverse().forEach(({ nombre, mensaje }) => {
    mensajesHTML += `<li>
        <p>
          <span class="text-success">${nombre}</span>
          <span>${mensaje}</span>
        </p>
      </li>`;
  });
  ulMensajes.innerHTML = mensajesHTML;
};

main();
