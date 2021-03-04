const path = require("path");
const fs = require("fs");
const { response } = require("express");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { subirArchivo } = require("../helpers/subir-archivo");
const Usuario = require("../models/usuario");
const Producto = require("../models/producto");

const cargarArchivo = async (req, res = response) => {
  try {
    const nombreArchivo = await subirArchivo(
      req.files,
      ["jpg", "png", "gif", "jfif"],
      "/prueba/"
    );
    res.json({
      nombreArchivo,
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};

const actualizarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;
    default:
      return res.status(500).json({ msg: "Se me olvidó validar esto" });
  }
  try {
    if (modelo.img) {
      const pathImagen = path.join(
        __dirname,
        "../uploads/",
        coleccion,
        modelo.img
      );

      if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
      }
    }

    const nombreArchivo = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombreArchivo;
    await modelo.save();
  } catch (error) {
    console.log("error: ", error);
    res.status(400).json({ error });
  }

  res.json(modelo);
};

const actualizarImagenCloudinary = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;
    default:
      return res.status(500).json({ msg: "Se me olvidó validar esto" });
  }
  try {
    if (modelo.img) {
      const nombreArr = modelo.img.split("/");
      const nombre = nombreArr[nombreArr.length - 1];
      const [public_id] = nombre.split(".");
      cloudinary.uploader.destroy(public_id);
    }
    const { secure_url } = await cloudinary.uploader.upload(
      req.files.archivo.tempFilePath
    );

    modelo.img = secure_url;
    await modelo.save();
  } catch (error) {
    console.log("error: ", error);
    res.status(400).json({ error });
  }

  res.json(modelo);
};

const mostrarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params;
  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;
    default:
      return res.status(500).json({ msg: "Se me olvidó validar esto" });
  }
  try {
    if (modelo.img) {
      const pathImagen = path.join(
        __dirname,
        "../uploads/",
        coleccion,
        modelo.img
      );

      if (fs.existsSync(pathImagen)) {
        return res.sendFile(pathImagen);
      }
    }
    const pathNoImg = path.join(__dirname, "../assets/noimg.jpg");
    console.log(pathNoImg);
    return res.sendFile(pathNoImg);
  } catch (error) {
    res.status(400).json({ error });
  }

  //   res.json(modelo);
};

module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary,
};
