const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la petición",
    });
  }
  try {
    const { uid } = jwt.verify(token, process.env.SECRETKEY);
    req.uid = uid;

    //Leer el usuario correspondiente al uid
    const usuarioAutenticado = await Usuario.findById(uid);

    if (!usuarioAutenticado) {
      return res.status(401).json({
        msg: "Token no valid - usuario no encontrado",
      });
    }

    //
    if (!usuarioAutenticado.estado) {
      return res.status(401).json({
        msg: "Token no valid - usuario con estado: false",
      });
    }
    req.usuarioAutenticado = usuarioAutenticado;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "token no válido",
    });
  }
};

module.exports = {
  validarJWT,
};
