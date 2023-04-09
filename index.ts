import express from "express";
import cors from "cors";
import compression from "compression";
import dotenv from "dotenv";

import { connectDB } from "./src/config";

import { accessLogger, errorLogger } from "./src/utils";

const app = express();
dotenv.config();
connectDB();

app.use(express.json());
app.use(cors());
app.use(compression());
app.use(accessLogger);

// Error handling middleware
// app.use((err, req, res, next) => {
//   // Handle the error here, or pass it to the next middleware
//   next(err);
// });

app.use((req, res, next) => {
  try {
    const a = 1;
    //@ts-ignore
    a = 2;
    res.json({ a: a });
  } catch (error) {
    next(error);
  }
  // res.status(404).json({
  //   message: "Not Found",
  // });
});

app.use(errorLogger);

const PORT = process.env.PORT || 8888;

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
