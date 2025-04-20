import express from "express";
import cors from "cors";
import authRoutes  from "./routes/authRoutes.js";
import menuRoutes  from "./routes/menuRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);

export default app;
