const { Router } = require("express");
const { check } = require("express-validator");
const {
  obtenerCategorias,
  crearCategoria,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
} = require("../controllers/categorias");
const { existeCategoria } = require("../helpers/existe-categoria");

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { esAdminRole } = require("../middlewares/validar-roles");

const router = Router();

//obtener categorias, paginar- publico
router.get("/", obtenerCategorias);

//obtener una caterogoria por id - publico
router.get(
  "/:id",
  [
    check("id", "id no valido").isMongoId(),
    check("id").custom(existeCategoria),
    validarCampos,
  ],
  obtenerCategoria
);

//crear categoria - privado (cualquier persona con un token valido)
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es requerido").notEmpty(),
    validarCampos,
  ],
  crearCategoria
);

//actualizar categoria - privado (cualquiera con token valido)
router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre a actualizar es requerida").notEmpty(),
    check("id", "id no valido").isMongoId(),
    check("id").custom(existeCategoria),
    validarCampos,
  ],
  actualizarCategoria
);

//borrar una categoria - Solo si es admin (estado:false)
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "id no valido").isMongoId(),
    check("id").custom(existeCategoria),
    validarCampos,
  ],
  borrarCategoria
);

module.exports = router;
