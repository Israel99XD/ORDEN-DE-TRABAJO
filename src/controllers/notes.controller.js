import Note from "../models/Note.js";
import Pieza from "../models/Pieza.js";

export const renderNoteForm = (req, res) => res.render("notes/new-note");

export const createNewNote = async (req, res) => {
  const {
    nombre,
    receptor,
    contrasenaEquipo,
    respaldo,
    passEquipo,
    malEquipo,
    descripcionDanio,
    status,
    nServicio,
    presupuesto,
    nTelefono,
    email,
    piezas,
    necesitaPiezas
  } = req.body;

  const errors = [];
  if (!nombre) {
    errors.push({ text: "Por favor ingrese un nombre" });
  }
  if (!tareas || tareas.length === 0) {
    errors.push({ text: "Por favor ingrese al menos una tarea" });
  }
  // Resto del código para verificar otros campos...

  if (errors.length > 0) {
    return res.render("notes/new-note", {
      errors,
      nombre,
      nServicio,
      tareas,
      receptor,
      contrasenaEquipo,
      respaldo,
      passEquipo,
      malEquipo,
      descripcionDanio,
      status,
      presupuesto,
      nTelefono,
      email,
      piezas,
      necesitaPiezas // Asegúrate de mantener las piezas seleccionadas en el formulario
    });
  }

  const newNote = new Note({

    nombre,
    descripcion: tareas,
    receptor,
    contrasenaEquipo,
    respaldo,
    passEquipo,
    malEquipo,
    descripcionDanio,
    status,
    nServicio,
    presupuesto,
    nTelefono,
    email,
    piezas,
    necesitaPiezas // Asigna todas las piezas seleccionadas
  });

  newNote.user = req.user.id;
  await newNote.save();
  req.flash("success_msg", "Orden registrada correctamente");
  res.redirect("/notes");
};

export const renderNotes = async (req, res) => {
  const notes = await Note.find({}).sort({ date: "desc" }).lean();
  res.render("notes/all-notes", { notes });
};

export const renderEditForm = async (req, res) => {
  const note = await Note.findById(req.params.id).lean();
  const piezas = await Pieza.find({}).lean(); // Obtener todas las piezas
  const tareas = await Note.find({}, { descripcion: 1 }).lean();
  res.render("notes/edit-note", { note, piezas, tareas });
};


export const updateNote = async (req, res) => {
  const {
    status,
    piezas,// Piezas seleccionadas como un array
  } = req.body;

  const noteId = req.params.id;

 
  const selectedPieza = await Pieza.findById(piezas);


  if (selectedPieza) {
    try {
      if (selectedPieza.cantidad > 0) {
        // Crear un objeto que represente la pieza seleccionada
        const piezaSeleccionada = {
          id: selectedPieza._id,
          nombre: selectedPieza.nombre,
          precio: selectedPieza.precio
        };

        const noteOLD = await Note.findById(noteId);
        noteOLD.piezas.push(piezaSeleccionada);
        noteOLD.status = status;
        await noteOLD.save()

        selectedPieza.cantidad -= 1;
        await selectedPieza.save();
      } else {
        req.flash("error_msg", "No hay suficientes piezas disponibles");
      }
      
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error al actualizar la cantidad de la pieza");
    }
  }
  req.flash("success_msg", "Orden actualizada correctamente");
  res.redirect("/notes");

};




export const deleteNote = async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Eliminado correctamente");
  res.redirect("/notes");
};
