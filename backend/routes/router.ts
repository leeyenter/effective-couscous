import express from "express";
import path from "path";
import { buildApiRouter } from "./api";

export const buildRouter = () => {
  const app = express();
  app.use(express.json());
  app.use("/", express.static(path.join(__dirname, "public")));
  app.use("/api", buildApiRouter());
  return app;
};
