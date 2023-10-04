import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: false
    },
    descripcion: {
      type: String,
      required: false
    },
    receptor: {
      type: String,
      required: false
    },
    date: {
      type:
        Date,
      default: Date.now
    },
    contrasenaEquipo: {
      type: String,
      required: false
    },
    respaldo: {
      type: String,
      required: false
    },
    passEquipo: {
      type: String,
      required: false
    },
    malEquipo: {
      type: String,
      required: false
    },
    descripcionDanio: {
      type: String,
      required: false
    },
    status: {
      type: String,
      required: false
    },
    nServicio: {
      type: Number,
      require: false
    },
    presupuesto: {
      type: Number,
      require: false
    },
    user: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Note", NoteSchema);
