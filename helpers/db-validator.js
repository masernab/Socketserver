const Role = require("../models/role");
const Usuario = require("../models/usuario");

const esRolValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no existe`);
  }
};

//validar correo
const existeEmail = async (correo = "") => {
  const emailExiste = await Usuario.findOne({ correo });
  if (emailExiste) {
    throw new Error(`El Email ${correo} ya existe`);
  }
};

const existeUsuarioPorId = async (id) => {
  const existeUsuario = await Usuario.findById({ _id: id });
  if (!existeUsuario) {
    throw new Error(`El id no existe`);
  }
};

const coleccionesPermitidas = (coleccion = "", colecciones = []) => {
  if (!colecciones.includes(coleccion)) {
    throw new Error("Coleccion no permitida");
  }
  return true;
};

module.exports = {
  esRolValido,
  existeEmail,
  existeUsuarioPorId,
  coleccionesPermitidas,
};
