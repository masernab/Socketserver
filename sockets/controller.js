const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers/generar-jwt");
const ChatMensajes = require("../models/chat-mensajes");

const chatMensajes = new ChatMensajes();
const socketController = async (socket = new Socket(), io) => {
  const usuario = await comprobarJWT(socket.handshake.headers["x-token"]);
  if (!usuario) {
    return socket.disconnect();
  }
  //Agregar usuario conectado
  chatMensajes.conectarUsuario(usuario);
  io.emit("usuarios-activos", chatMensajes.usuariosArr);
  io.emit("recibir-mensaje", chatMensajes.ultimos10);

  //
  socket.join(usuario.id);

  //Limpiar cuando alguien se desconecte
  socket.on("disconnect", () => {
    chatMensajes.desconectarUsuario(usuario.id);
    io.emit("usuarios-activos", chatMensajes.usuariosArr);
  });

  socket.on("enviar-mensaje", ({ uid, mensaje }) => {
    if (uid) {
      socket.to(uid).emit("mensaje-privado", { de: usuario.nombre, mensaje });
    } else {
      chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje); //id del usuario conectado
      io.emit("recibir-mensaje", chatMensajes.ultimos10);
    }
  });
};

module.exports = {
  socketController,
};
