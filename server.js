import mongoose from "mongoose";
import app from "./app.js";

const { DB_HOST, PORT = 3000 } = process.env;

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log("Server is running. Use our API on port: 3000");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

// import mongoose from "mongoose";
// import app from "./app.js";
// import findFreePort from "find-free-port";

// const { DB_HOST, PORT = 9000 } = process.env;

// mongoose.set("strictQuery", true);

// findFreePort(PORT, (err, freePort) => {
//   if (err) {
//     console.error(err);
//     process.exit(1);
//   }

//   mongoose
//     .connect(DB_HOST)
//     .then(() => {
//       console.log("Database connection successful");
//       app.listen(freePort, () => {
//         console.log(`Server is running. Use our API on port: ${freePort}`);
//       });
//     })
//     .catch((error) => {
//       console.log(error.message);
//       process.exit(1);
//     });
// });
