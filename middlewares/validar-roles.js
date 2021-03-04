const { response } = require("express");

const esAdminRole = (req, res = response, next) => {
  if (!req.usuarioAutenticado) {
    return res.status(500).json({
      msg: "Se quiere verificar el rol sin validar el token",
    });
  }
  const { rol, nombre } = req.usuarioAutenticado;

  if (rol !== "ADMIN_ROL") {
    return res.status(401).json({
      msg: `${nombre} no es administrador - No puede hacer esto`,
    });
  }
  next();
};

const tieneRol = (...roles) => {
  return (req, res = response, next) => {
    if (!req.usuarioAutenticado) {
      return res.status(500).json({
        msg: "Se quiere verificar el rol sin validar el token",
      });
    }
    if (!roles.includes(req.usuarioAutenticado.rol)) {
      return res.status(401).json({
        msg: `El servicio requiere uno de estos roles: ${roles}`,
      });
    }

    next();
  };
};

module.exports = {
  esAdminRole,
  tieneRol,
};
