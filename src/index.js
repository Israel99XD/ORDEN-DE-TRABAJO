import app from "./app.js";
import { createAdminUser } from "./libs/createUser.js";
import { createAlmacenUser } from "./libs/createAlmacenUser.js";

import "./database.js";

async function main() {
  await createAdminUser();
  await createAlmacenUser();
  app.listen(app.get("port"));

  console.log("servidor en puerto", app.get("port"));
  console.log("Environment:", process.env.NODE_ENV);
}

main();
