import express from "express";
export const router = express.Router();

import { router as noaaRouter } from "./noaa";

router.use("/noaa", noaaRouter);
