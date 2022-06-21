import express from "express";
import path from "path";
import { buildApiRouter } from "./api";
import cors from "cors";

export const buildRouter = () => {
  const app = express();
  app.use(
    cors({
      origin: "*",
    })
  );
  app.use(express.json());
  app.use("/", express.static(path.join(__dirname, "public")));
  app.use("/api", buildApiRouter());
  return app;
};
