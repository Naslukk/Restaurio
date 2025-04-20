import express from "express";
import cors from "cors";
import authRoutes  from "./routes/authRoutes.js";
import menuRoutes  from "./routes/menuRoutes.js";
import tableRoutes from "./routes/tableRoutes.js"

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/table', tableRoutes);

export default app;
