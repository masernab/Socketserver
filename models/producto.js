const { model, Schema } = require("mongoose");

const ProductoSchema = Schema({
  nombre: {
    type: String,
    requiered: [true, "El nombre es obligatorio"],
    unique: true,
  },
  estado: {
    type: Boolean,
    default: true,
    requiered: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    requiered: true,
  },
  precio: {
    type: Number,
    default: 0,
  },
  categoria: {
    type: Schema.Types.ObjectId,
    ref: "Categoria",
    requiered: true,
  },
  descripcion: { type: String },
  disponible: { type: Boolean },
  img: { type: String },
});

ProductoSchema.methods.toJSON = function () {
  const { __v, estado, ...data } = this.toObject();
  return data;
};

module.exports = model("Producto", ProductoSchema);
