import express from "express";

const router = express.Router();

//controllers
import { checkHealthController } from "../controllers/healthController";

router.get("/", checkHealthController);

export default router;
