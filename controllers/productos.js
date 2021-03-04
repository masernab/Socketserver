const { response } = require("express");
const Producto = require("../models/producto");
const Categoria = require("../models/categoria");

//obtenerProductos - paginado - total - populate
const obtenerProductos = async (req, res = response) => {
  const { desde = 0, limite = 5 } = req.query;

  const [total, productos] = await Promise.all([
    Producto.countDocuments({ estado: true }),
    Producto.find({ estado: true })
      .populate("usuario", "nombre")
      .populate("categoria", "nombre")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);

  res.json({
    total,
    productos,
  });
};

//obtenerProducto - populate
const obtenerProducto = async (req, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findById(id)
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");
  res.json(producto);
};

//crearProducto
const crearProducto = async (req, res = response) => {
  const { estado, usuarioAutenticado, ...body } = req.body;

  const productoDB = await Producto.findOne({ nombre: body.nombre });

  if (productoDB) {
    return res.status(400).json({
      msg: `El producto ${nombre} ya existe`,
    });
  }

  //Datos del nuevo producto
  const data = {
    ...body,
    nombre: body.nombre.toUpperCase(),
    usuario: req.usuarioAutenticado._id,
  };

  //Crear producto
  const producto = await new Producto(data);

  //guardar en DB
  producto.save();

  res.status(201).json({
    producto,
  });
};

//actualizar producto
const actualizarProducto = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuarioAutenticado, ...data } = req.body;

  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }

  data.usuario = req.usuarioAutenticado._id;

  const producto = await Producto.findByIdAndUpdate(id, data, {
    new: true,
  })
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");

  producto.save();

  res.json({
    producto,
  });
};

//borrar producto - estado: false
const borrarProducto = async (req, res = response) => {
  const { id } = req.params;

  const productoBorrado = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );
  res.json({
    productoBorrado,
  });
};

module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  borrarProducto,
};
