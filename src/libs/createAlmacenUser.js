import User from "../models/User.js";

export const createAlmacenUser = async () => {
    const userFound = await User.findOne({ email: "almacen@localhost" });
  
    if (userFound) return;
  
    const newUser = new User({
      username: "almacen",
      email: "almacen@localhost",
      rol: "almacen"
    });
  
    newUser.password = await newUser.encryptPassword("almacenpassword");
  
    const almacenUser = await newUser.save();
    
  
    console.log("Almacen user created", almacenUser);
  };
  