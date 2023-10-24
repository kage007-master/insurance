import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import WeatherController from "../controllers/WeatherController";

const router: Router = Router();

router.get("/", authMiddleware, WeatherController.getAll);

export default router;
