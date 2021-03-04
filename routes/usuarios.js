const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { esAdminRole, tieneRol } = require("../middlewares/validar-roles");

const {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosPatch,
} = require("../controllers/usuarios");

const {
  esRolValido,
  existeEmail,
  existeUsuarioPorId,
} = require("../helpers/db-validator");

const router = Router();

router.get("/", usuariosGet);

router.put(
  "/:id",
  [
    check("id", "Id no valido").isMongoId(),
    check("id", "No existe").custom(existeUsuarioPorId),
    check("rol", "No es un rol valido ").custom(esRolValido),
    validarCampos,
  ],
  usuariosPut
);

router.post(
  "/",
  [
    check("nombre", "Nombre obligatorio").notEmpty(),
    check("correo", "Email no valido").isEmail(),
    check("correo", "Email ya existe en la db").custom(existeEmail),
    check("password", "contraseña con cumple los requisitos").isLength({
      min: 6,
    }),
    // check("rol", "No es un rol valido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    check("rol", "No es un rol valido ").custom(esRolValido),
    validarCampos,
  ],
  usuariosPost
);

router.delete(
  "/:id",
  [
    validarJWT,
    // esAdminRole,
    tieneRol("ADMIN_ROL", "VENTAS_ROL"),
    check("id", "Id no valido").isMongoId(),
    check("id", "No existe").custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuariosDelete
);

router.patch("/", usuariosPatch);

module.exports = router;
