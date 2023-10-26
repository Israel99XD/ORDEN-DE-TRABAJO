import Note from "../models/Note.js";

function generarNumeroFolio() {
  const fecha = new Date();
  const year = fecha.getFullYear().toString().slice(-2);
  const mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
  const dia = ('0' + fecha.getDate()).slice(-2);
  const horas = ('0' + fecha.getHours()).slice(-2);
  const minutos = ('0' + fecha.getMinutes()).slice(-2);
  const segundos = ('0' + fecha.getSeconds()).slice(-2);
  const milisegundos = ('00' + fecha.getMilliseconds()).slice(-3);

  const folio = year + mes + dia + horas + minutos + segundos + milisegundos;
  return folio;
};

export const renderNoteForm = (req, res) => {
  const folio = generarNumeroFolio();
    res.render('usuario/new-note', { folio });
} 

export const createNewNote = async (req, res) => {
  const { nombre, descripcion, receptor, contrasenaEquipo, respaldo, passEquipo, malEquipo, descripcionDanio, status, nServicio, presupuesto, nTelefono,email} = req.body;
  const errors = [];
  if (!nombre) {
    errors.push({ text: "Por favor ingrese un nombre" });
  }
  if (!descripcion) {
    errors.push({ text: "Por favor ingrese una descripción" });
  }
  if (errors.length > 0)
    return res.render("usuario/new-note", {
      errors,
      nombre,
      nServicio,
      descripcion,
      receptor,
      contrasenaEquipo,
      respaldo,
      passEquipo,
      malEquipo,
      descripcionDanio,
      status,
      presupuesto,
      nTelefono,
      email
    });

  const newNote = new Note({ nombre, descripcion, receptor, contrasenaEquipo, 
    respaldo, passEquipo, malEquipo, descripcionDanio, status, 
    nServicio, presupuesto, nTelefono,email });
  newNote.user = req.user.id;
  await newNote.save();
  req.flash("success_msg", "Orden registrada correctamente");
  res.redirect("/user/notes");
};

export const renderNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user.id })
    .sort({ date: "desc" })
    .lean();
  res.render("usuario/all-notes-usuario", { notes });
};

