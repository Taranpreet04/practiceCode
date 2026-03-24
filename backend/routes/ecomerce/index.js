import express from "express";
import customerRoutes from "./customers.js";
import orderRoutes from "./orders.js";
const router = express.Router();

router.use("/orders", orderRoutes);
router.use("/customers", customerRoutes);

export default router;