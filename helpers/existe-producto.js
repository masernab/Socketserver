const Producto = require("../models/producto");

const existeProducto = async (id = "") => {
  const productoDB = await Producto.findById({ _id: id });
  console.log("producto: ", productoDB);
  if (!productoDB) {
    throw new Error(`Producto ${id} no existe en la base de datos`);
  }
};

module.exports = {
  existeProducto,
};
