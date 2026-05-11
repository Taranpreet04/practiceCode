import express from "express";
const router = express.Router();
import { addCustomer } from "../../controllers/Ecommerce/customers.js";

/*
    #swagger.tags = ['Customers']
    #swagger.summary = 'Add customer'
*/
router.post("/add", addCustomer);

export default router;
