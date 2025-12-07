import express from "express";

const router = express.Router();

//controllers
import { checkHealth } from "../controllers/healthController";

router.get("/", checkHealth);

export default router;
