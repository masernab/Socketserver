const Categoria = require("../models/categoria");

const existeCategoria = async (id = "") => {
  const categoria = await Categoria.findById({ _id: id });
  if (!categoria) {
    throw new Error(`La categoria ${id} no existe`);
  }
};

module.exports = {
  existeCategoria,
};
