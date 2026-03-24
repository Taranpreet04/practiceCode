import express from "express";
const router = express.Router();
import { addCustomer } from "../../controllers/Ecommerce/customers.js";

router.post("/add", addCustomer);

export default router;
    