//Hbo4F87n1M4oAir7
//Olena
//Hbo4F87n1M4oAir7
// mongodb+srv://Olena:<Hbo4F87n1M4oAir7>@cluster0.iievwqx.mongodb.net/db-contacts?retryWrites=true&w=majority&appName=Cluster0

//mongodb+srv://Olena:<password>@cluster0.iievwqx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

import mongoose from "mongoose";
import app from "./app.js";

const { DB_HOST, PORT = 3000 } = process.env;

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Database connection successful");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
