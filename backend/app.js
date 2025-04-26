import express from "express";
import cors from "cors";
import authRoutes  from "./routes/authRoutes.js";
import menuRoutes  from "./routes/menuRoutes.js";
import tableRoutes from "./routes/tableRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/table', tableRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/bill', billRoutes);
app.use('/api/dashboard', dashboardRoutes);

export default app;
