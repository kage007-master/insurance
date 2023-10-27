import { Router } from "express";
import UserController from "../controllers/UserController";
import authMiddleware from "../middlewares/auth";

const router: Router = Router();

router.post("/login", UserController.login);
router.post("/signup", UserController.signup);
router.post("/validator", UserController.addValidator);
router.get("/", authMiddleware, UserController.load);
router.get("/notifications", authMiddleware, UserController.loadNotification);

export default router;
