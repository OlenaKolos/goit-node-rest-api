import mongoose from "mongoose";
import app from "./app.js";

const { DB_HOST, PORT = 9000 } = process.env;

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log("Server is running. Use our API on port: 9000");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

// YM7FZRLUJU5PSg9z

// YM7FZRLUJU5PSg9z

//YM7FZRLUJU5PSg9z

// mongodb+srv://Olena:<password>@cluster0.ia81glc.mongodb.net/

// mongodb+srv://Olena:<password>@cluster0.ia81glc.mongodb.net/

// mongodb+srv://Olena:<password>@cluster0.ia81glc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

// mongodb+srv://Olena:YM7FZRLUJU5PSg9z@cluster0.ia81glc.mongodb.net/db-contacts?retryWrites=true&w=majority&appName=Cluster0
