import express from "express";
import connectMongo from "./config/mongoDBConfig.js";
import dotenv from "dotenv";
import cors from "cors";
import {specs} from "./swagger.js";
import swaggerUi from "swagger-ui-express";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";


dotenv.config({ path: ".env" });

const app = express();
const port = process.env.port;
const corsOrigin = process.env.corsOrigin;

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(cors({ origin: `${corsOrigin}` }));

connectMongo();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/users", userRoutes);
app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
