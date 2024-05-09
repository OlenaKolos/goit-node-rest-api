import mongoose from "mongoose";
import app from "./app.js";

//Hbo4F87n1M4oAir7
//Olena

//Hbo4F87n1M4oAir7

// mongodb+srv://Olena:<Hbo4F87n1M4oAir7>@cluster0.iievwqx.mongodb.net/db-contact?retryWrites=true&w=majority&appName=Cluster0

// mongodb+srv://Olena:<Hbo4F87n1M4oAir7>@cluster0.iievwqx.mongodb.net/db-contact?retryWrites=true&w=majority&appName=Cluster0

const { DB_HOST, PORT = 8000 } = process.env;

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log("Server is running. Use our API on port: 8000");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
