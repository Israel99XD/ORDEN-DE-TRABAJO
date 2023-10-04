import mongoose from "mongoose";
import { MONGODB_URI } from "./config.js";

try {
  const db = await mongoose.connect(MONGODB_URI);
  console.log("Conectado a ", db.connection.name);
} catch (error) {
  console.error(error);
}

mongoose.connection.on("connected", () => {
  console.log("Mongoose esta conectado");
});

mongoose.connection.on("desconectado", () => {
  console.log("Mongoose esta desconectado");
});

