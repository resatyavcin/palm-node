import "dotenv/config";
import express, { type Request, type Response } from "express";

const app = express();

app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.send("ok");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
