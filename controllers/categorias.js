const { response } = require("express");
const Categoria = require("../models/categoria");

//obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req, res = response) => {
  const { desde = 0, limite = 5 } = req.query;

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments({ estado: true }),
    Categoria.find({ estado: true })
      .populate("usuario", "nombre")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);

  res.json({
    total,
    categorias,
  });
};

//obtenerCategoria - populate
const obtenerCategoria = async (req, res = response) => {
  const { id } = req.params;
  const categoria = await Categoria.findById(id).populate("usuario", "nombre");
  res.json({
    categoria,
  });
};

//crearCategoria
const crearCategoria = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();
  const categoriaDB = await Categoria.findOne({ nombre });
  if (categoriaDB) {
    return res.status(400).json({
      msg: `la categoria ${categoriaDB}ya existe`,
    });
  }

  //Datos de la nueva categoria
  const data = {
    nombre,
    usuario: req.usuarioAutenticado._id,
  };

  //Crear categoria
  const categoria = await new Categoria(data);

  //guardar en DB
  categoria.save();

  res.status(201).json({
    categoria,
  });
};

//actualizarCategoria
const actualizarCategoria = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuarioAutenticado, ...data } = req.body;
  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuarioAutenticado._id;
  const categoria = await Categoria.findByIdAndUpdate(id, data, {
    new: true,
  }).populate("usuario", "nombre");

  categoria.save();

  res.json({
    categoria,
  });
};

//borrarCategoria - estado: false
const borrarCategoria = async (req, res = response) => {
  const { id } = req.params;

  const categoriaBorrada = await Categoria.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );
  res.json({
    id,
    categoriaBorrada,
  });
};

module.exports = {
  obtenerCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  borrarCategoria,
};
