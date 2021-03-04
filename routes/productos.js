const { Router } = require("express");
const { check } = require("express-validator");

const {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
} = require("../controllers/productos");
const { existeCategoria } = require("../helpers/existe-categoria");

const { existeProducto } = require("../helpers/existe-producto");

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { esAdminRole } = require("../middlewares/validar-roles");

const router = Router();

//obtener producto, paginar- publico
router.get("/", obtenerProductos);

// obtener un producto por id - publico
router.get(
  "/:id",
  [
    check("id", "id no valido").isMongoId(),
    check("id").custom(existeProducto),
    validarCampos,
  ],
  obtenerProducto
);

//crear categoria - privado (cualquier persona con un token valido)
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es requerido").notEmpty(),
    check("categoria", "No es un id de mongo").isMongoId(),
    check("categoria").custom(existeCategoria),
    validarCampos,
  ],
  crearProducto
);

//actualizar producto - privado (cualquiera con token valido)
router.put(
  "/:id",
  [
    validarJWT,
    check("id", "id no valido").isMongoId(),
    check("id").custom(existeProducto),
    validarCampos,
  ],
  actualizarProducto
);

//borrar una categoria - Solo si es admin (estado:false)
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "id no valido").isMongoId(),
    check("id").custom(existeProducto),
    validarCampos,
  ],
  borrarProducto
);

module.exports = router;
