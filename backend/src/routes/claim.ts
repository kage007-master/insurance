import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import ClaimController from "../controllers/ClaimController";

const router: Router = Router();

router.post("/add", ClaimController.add);
router.post("/feedback", authMiddleware, ClaimController.feedback);
router.post("/validate", authMiddleware, ClaimController.validate);
router.get("/", ClaimController.getAll);
router.get("/active", authMiddleware, ClaimController.getActive);
router.get("/past", authMiddleware, ClaimController.getPast);
router.get("/assessed", authMiddleware, ClaimController.getAssessed);
router.get("/assigned", authMiddleware, ClaimController.getAssigned);

export default router;
