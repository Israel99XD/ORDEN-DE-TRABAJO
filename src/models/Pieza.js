import mongoose from "mongoose";

const piezaSchema = new mongoose.Schema({
  nombre: String,
  cantidad: Number,
  precio: Number
},
{
  timestamps: true,
});

export default mongoose.model("Pieza", piezaSchema);
