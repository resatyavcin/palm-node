import "dotenv/config";
import express, { type Request, type Response } from "express";
//routes
import { healthRoutes } from "./routes";
const app = express();

app.use(express.json());

app.use("/api/health", healthRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
