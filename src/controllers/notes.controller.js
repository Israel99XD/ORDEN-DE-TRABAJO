import Note from "../models/Note.js";

export const renderNoteForm = (req, res) => res.render("notes/new-note");

export const createNewNote = async (req, res) => {
  const { nombre, descripcion, receptor, contrasenaEquipo, respaldo, passEquipo, malEquipo, descripcionDanio, status, nServicio, presupuesto } = req.body;
  const errors = [];
  if (!nombre) {
    errors.push({ text: "Por favor ingrese un nombre" });
  }
  if (!descripcion) {
    errors.push({ text: "Por favor ingrese una descripción" });
  }
  if (errors.length > 0)
    return res.render("notes/new-note", {
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
      presupuesto
    });

  const newNote = new Note({ nombre, descripcion, receptor, contrasenaEquipo, respaldo, passEquipo, malEquipo, descripcionDanio, status, nServicio, presupuesto });
  newNote.user = req.user.id;
  await newNote.save();
  req.flash("success_msg", "Orden registrada correctamente");
  res.redirect("/notes");
};

export const renderNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user.id })
    .sort({ date: "desc" })
    .lean();
  res.render("notes/all-notes", { notes });
};

export const renderEditForm = async (req, res) => {
  const note = await Note.findById(req.params.id).lean();
  if (note.user != req.user.id) {
    req.flash("error_msg", "No autorizado");
    return res.redirect("/notes");
  }
  res.render("notes/edit-note", { note });
};


export const updateNote = async (req, res) => {
  const { nombre,
    nServicio,
    descripcion,
    receptor,
    contrasenaEquipo,
    respaldo,
    passEquipo,
    malEquipo,
    descripcionDanio,
    status,
    presupuesto } = req.body;
  await Note.findByIdAndUpdate(req.params.id, { nombre, descripcion, receptor, contrasenaEquipo, respaldo, passEquipo, malEquipo, descripcionDanio, status, nServicio, presupuesto });
  req.flash("success_msg", "Actualizado correctamente");
  res.redirect("/notes");
};


export const deleteNote = async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Eliminado correctamente");
  res.redirect("/notes");
};
