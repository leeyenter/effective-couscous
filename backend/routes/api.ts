import express from "express";
import { v1Router } from "./apiV1";
import { v2Router } from "./apiV2";

export const buildApiRouter = () => {
  const apiRouter = express.Router();
  apiRouter.use("/v1", v1Router);
  apiRouter.use("/v2", v2Router);
  return apiRouter;
};
