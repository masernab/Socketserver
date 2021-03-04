const { response } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    //Verificar si el correo existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "usuario o contraseña erronea - correo",
      });
    }

    //Verrificar si está activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "usuario o contraseña erronea - estado: false",
      });
    }

    //Verificar contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "usuario o contraseña erronea - password",
      });
    }

    //Generar el JWT
    const token = await generarJWT(usuario._id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Hable con el administrador- catch",
    });
  }
};

const googleSingIn = async (req, res = response) => {
  const { id_token } = req.body;
  try {
    const { correo, nombre, img } = await googleVerify(id_token);
    let usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      //Crear usuario
      const data = {
        nombre,
        correo,
        password: ":P",
        img,
        google: true,
      };
      usuario = await new Usuario(data);
      await usuario.save();
    }
    //Comprobar si el usuario está eliminado
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Usuario bloqueado",
      });
    }
    //Generar JWT
    const token = await generarJWT(usuario._id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Token no valido",
    });
  }
};

const renovarJWT = async (req, res = response) => {
  const { usuarioAutenticado } = req;

  //Generar el JWT
  const token = await generarJWT(usuarioAutenticado._id);

  res.json({
    usuarioAutenticado,
    token,
  });
};

module.exports = {
  login,
  googleSingIn,
  renovarJWT,
};
