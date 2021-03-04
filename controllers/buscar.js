const { response } = require("express");
const { ObjectId } = require("mongoose").Types;

const Usuario = require("../models/usuario");
const Categoria = require("../models/categoria");
const Producto = require("../models/producto");

const coleccionesPermitidas = ["usuarios", "categorias", "productos", "roles"];

const buscarUsuarios = async (termino = "", res = response) => {
  const esMongoId = ObjectId.isValid(termino);

  if (esMongoId) {
    try {
      const usuario = await Usuario.findById(termino);
      return res.json({
        results: usuario ? [usuario] : [],
      });
    } catch (error) {
      return res.json(error);
    }
  }
  try {
    const regex = new RegExp(termino, "i");
    const usuarios = await Usuario.find({
      $or: [{ nombre: regex }, { correo: regex }],
      $and: [{ estado: true }],
    });
    return res.json({
      results: usuarios,
    });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const buscarCategoria = async (termino, res = response) => {
  const esMongoId = ObjectId.isValid(termino);

  if (esMongoId) {
    try {
      const categoria = await Categoria.findById(termino);
      return res.json({
        results: categoria ? [categoria] : [],
      });
    } catch (error) {
      return res.json(error);
    }
  }
  try {
    const regex = new RegExp(termino, "i");
    const categorias = await Categoria.find({
      $and: [{ nombre: regex }, { estado: true }],
    });

    return res.json({
      results: categorias,
    });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const buscarProductos = async (termino, res = response) => {
  const esMongoId = ObjectId.isValid(termino);

  if (esMongoId) {
    try {
      const producto = await Usuario.findById(termino).populate(
        "categoria",
        "nombre"
      );
      return res.json({
        results: producto ? [producto] : [],
      });
    } catch (error) {
      return res.json(error);
    }
  }
  try {
    const regex = new RegExp(termino, "i");
    const productos = await Producto.find({
      $and: [{ nombre: regex }, { estado: true }],
    }).populate("categoria", "nombre");

    return res.json({
      results: productos,
    });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const buscar = (req, res = response) => {
  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case "usuarios":
      buscarUsuarios(termino, res);
      break;
    case "categorias":
      buscarCategoria(termino, res);
      break;
    case "productos":
      buscarProductos(termino, res);
      break;
    default:
      res.status(500).json({
        msg: "Falta realizar esta busqueda - coleccion",
      });
      break;
  }

  //   res.json({
  //     coleccion,
  //     termino,
  //   });
};

module.exports = {
  buscar,
};
