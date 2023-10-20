import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import CoverageController from "../controllers/CoverageController";

const router: Router = Router();

router.get("/", authMiddleware, CoverageController.get);
router.post("/add", authMiddleware, CoverageController.add);
router.post("/subscribe", authMiddleware, CoverageController.subscribe);

export default router;
