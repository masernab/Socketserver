const { Router } = require("express");
const { check } = require("express-validator");
const { login, googleSingIn, renovarJWT } = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.post(
  "/login",
  [
    check("correo", "El correo es obligatorio").isEmail(),
    check("password", "Contraseña obligatoria").notEmpty(),
    validarCampos,
  ],
  login
);

router.post(
  "/google",
  [check("id_token", "id_token obligatoria").notEmpty(), validarCampos],
  googleSingIn
);

router.get("/", validarJWT, renovarJWT);

module.exports = router;
