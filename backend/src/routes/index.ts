import authRoutes from "./auth";
import { Express } from "express";

export default (app: Express) => {
  app.use("/api/auth", authRoutes);
};
