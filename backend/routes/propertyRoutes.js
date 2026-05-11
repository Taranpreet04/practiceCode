import express from "express";
import { getProperty } from "../controllers/common.js";
const router = express.Router();

router.post("/get-property-details", getProperty);

export default router;