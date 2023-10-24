import { Router } from "express";
import UserController from "../controllers/UserController";
import authMiddleware from "../middlewares/auth";

const router: Router = Router();

router.get("/", authMiddleware, UserController.getClients);
router.get("/validators", authMiddleware, UserController.getValidators);
router.get("/:id", authMiddleware, UserController.getClient);

export default router;
