import express from "express";
export const router = express.Router();

import { router as noaaRouter } from "./noaa";
import { router as v2Router } from "./v2";

router.use("/noaa", noaaRouter);
router.use("/v2", v2Router);
