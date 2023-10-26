import { Router } from "express";

import {
    renderNoteForm,
    createNewNote,
    renderNotes
  } from "../controllers/user.controllers.js";
  import { isAuthenticated } from "../helpers/auth.js";
  
  const router = Router();
  
  // New Pieza
  router.get("/user/notes/add", isAuthenticated, renderNoteForm);
  
  router.post("/user/notes/new-note", isAuthenticated, createNewNote);
  
  // Get All Piezas
  router.get("/user/notes", isAuthenticated, renderNotes);

  
  export default router;