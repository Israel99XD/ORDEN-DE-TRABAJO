import express from "express";
import exphbs from "express-handlebars";
import session from "express-session";
import methodOverride from "method-override";
import flash from "connect-flash";
import passport from "passport";
import morgan from "morgan";
import MongoStore from "connect-mongo";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import Note from "./models/Note.js";
import handlebars from "handlebars";
import nodemailer from "nodemailer"
import bodyParser from "body-parser";

import { MONGODB_URI, PORT } from "./config.js";

import indexRoutes from "./routes/index.routes.js";
import notesRoutes from "./routes/notes.routes.js";
import piezasRoutes from "./routes/piezas.routes.js"
import userRoutes from "./routes/auth.routes.js";
import usuariosRoutes from "./routes/user.routes.js"

import "./config/passport.js";
import User from "./models/User.js";



// Initializations
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const __dirname = dirname(fileURLToPath(import.meta.url));



// settings
app.set("port", PORT);
app.set("views", join(__dirname, "views"));

// config view engine

const hbs = exphbs.create({


  
  defaultLayout: "main",
  layoutsDir: join(app.get("views"), "layouts"),
  partialsDir: join(app.get("views"), "partials"),
  extname: ".hbs",
  helpers: {
    eq: function (a, b) {
      return a === b;
    }
  }
});
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

app.get('/notes/add', (req, res) => {
  const folio = generarNumeroFolio();
  res.render('notes/new-note', { folio });
});




//Numero de folio
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
//Fin numero de folio

//Generar PDF
app.get('/generate-pdf/:id', async (req, res) => {
  const templatePath = path.join(__dirname, 'views', 'template.hbs');
  const templateContent = fs.readFileSync(templatePath, 'utf8');
  const template = handlebars.compile(templateContent);
  const { id } = req.params;
  const notes = await Note.findById(id);
  const data = {
    nombre: notes.nombre, 
    nServicio: notes.nServicio, 
    nTelefono: notes.nTelefono, 
    date: notes.date, 
    receptor:notes.receptor, 
    presupuesto: notes.presupuesto,
    piezas: notes.piezas,
    descripcion: notes.descripcion
  };

  const html = template(data);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);

  const pdf = await page.pdf();
  await browser.close();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=archivo.pdf');
  res.send(pdf);
});
//Fin generar PDF

/* PDF WHATSAPP
app.post('/generate-pdf-what', async (req, res) => {
  const templatePath = path.join(__dirname, 'views', 'plantilla.hbs');
  const templateContent = fs.readFileSync(templatePath, 'utf8');
  const plantilla = handlebars.compile(templateContent);

  const data = {
    nombre: 'Nombre de prueba',
    nServicio: 'Número de servicio de prueba'
  };

  const html = plantilla(data);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);

  const pdfPath = path.join(__dirname, 'temp', 'archivo.pdf');
  await page.pdf({ path: pdfPath, format: 'A4' }); // Generate the PDF

  await browser.close();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=archivo.pdf');
  const pdf = fs.readFileSync(pdfPath);
  res.send(pdf);
});
*/

// Envio correos puppeteer
app.get('/generate-pdf-correo/:id', async (req, res) => {
  try {
    const templatePath = path.join(__dirname, 'views', 'template.hbs');
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateContent);
    const { id } = req.params;
    // Supongamos que tienes un modelo llamado Note que contiene los datos que deseas en el PDF
    const notes = await Note.findById(id);
    const user = await User.findById(notes.user);
    const data = {
      nombre: notes.nombre, 
      nServicio: notes.nServicio, 
      nTelefono: notes.nTelefono, 
      date: notes.date, 
      receptor:notes.receptor, 
      presupuesto: notes.presupuesto,
      piezas: notes.piezas,
      descripcion: notes.descripcion
    };

    const html = template(data);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);

    const pdf = await page.pdf();
    await browser.close();

    // Guarda el archivo PDF temporalmente en el sistema de archivos
    const pdfPath = path.join(__dirname, 'temp', 'archivo.pdf');
    fs.writeFileSync(pdfPath, pdf);

    // Envío de correo
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'israelsldn@gmail.com',
        pass: 'ymcy lhdf bdwc cliz'
      }
    });

    const source = fs.readFileSync(path.join(__dirname, 'views/plantilla.hbs'), 'utf8');
    const plantilla = handlebars.compile(source);

    async function enviarCorreo(destinatario, asunto, datos) {
      const html = plantilla(datos);
      let mailOptions = {
        from: 'israelsldn@gmail.com',
        to: destinatario,
        subject: asunto,
        html: html,
        attachments: [
          {
            filename: 'archivo.pdf',
            path: pdfPath
          }
        ]
      };
      try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado: %s', info.messageId);
      } catch (error) {
        console.error('Error al enviar el correo:', error);
      }
    }
    enviarCorreo(
      notes.email,
      notes.nombre +' Tu Orden de Trabajo con numero de  servicio ' + notes.nServicio +' esta terminada ',
      { nombre: notes.nombre, mensaje: 'Su quipo esta listo, le envio su nota de remisión para que pueda pasar a recoger su equipo' }
    );

    // Establece los encabezados para indicar que se está enviando un archivo PDF como respuesta
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=archivo.pdf');

    // Envía el archivo PDF como respuesta al usuario
    res.sendFile(pdfPath);
  } catch (error) {
    console.error('Error al generar el PDF y enviar el correo:', error);
    res.status(500).send('Error interno del servidor');
  }
});
//fin pupperteer


/*
app.post('/upload-pdf', (req, res) => {
  const pdfFile = req.files.pdf; // Suponiendo que estás utilizando un middleware como Multer para manejar la subida de archivos

  const uploadPath = path.join(__dirname, 'uploads', pdfFile.name);

  fs.writeFileSync(uploadPath, pdfFile.data); // Guardar el archivo en el servidor

  const pdfUrl = `/uploads/${pdfFile.name}`; // Obtener la URL del archivo subido

  res.send(pdfUrl); // Devolver la URL al cliente
});
*/


// middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: MONGODB_URI }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// routes
app.use(indexRoutes);
app.use(userRoutes);
app.use(notesRoutes);
app.use(piezasRoutes);
app.use(usuariosRoutes);


// static files
app.use(express.static(join(__dirname, "public")));

app.use((req, res, next) => {
  return res.status(404).render("404");
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.render("error", {
    error,
  });
});



export default app;
