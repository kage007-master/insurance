import authRoutes from "./auth";
import coverageRoutes from "./coverage";
import clientRoutes from "./client";
import claimRoutes from "./claim";
import express, { Express } from "express";
import path from "path";

export default (app: Express) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/coverage", coverageRoutes);
  app.use("/api/client", clientRoutes);
  app.use("/api/claim", claimRoutes);
  app.use(express.static(path.join(__dirname, "../../public")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../public", "index.html"));
  });
};
