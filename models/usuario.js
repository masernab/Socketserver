const { model, Schema } = require("mongoose");

const UsuarioSchema = Schema({
  nombre: {
    type: String,
    requiered: [true, "El nombre es obligatorio"],
  },

  correo: {
    type: String,
    requiered: [true, "El correo es obligatorio"],
  },

  password: {
    type: String,
    requiered: [true, "La contraseña es obligatoria"],
  },

  img: {
    type: String,
  },

  rol: {
    type: String,
    requiered: true,
    default: "USER_ROLE",
    emun: ["ADMIN_ROLE", "USER_ROLE"],
  },

  estado: {
    type: Boolean,
    default: true,
  },

  google: {
    type: Boolean,
    default: false,
  },
});

UsuarioSchema.methods.toJSON = function () {
  const { __v, password, _id, ...usuario } = this.toObject();
  usuario.uid = _id;
  return usuario;
};

module.exports = model("Usuario", UsuarioSchema);
