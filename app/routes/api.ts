import express from "express";
import { v1Router } from "./apiV1";

export const buildApiRouter = () => {
  const apiRouter = express.Router();
  apiRouter.use("/v1", v1Router);
  return apiRouter;
};
