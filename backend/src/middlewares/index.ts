import cors from "cors";
import express, { Express } from "express";
import path from "path";

export default (app: Express) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
};
