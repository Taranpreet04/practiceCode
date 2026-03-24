import express from "express";
const router = express.Router();
import { createOrder, getCustomerOrderDetail } from "../../controllers/Ecommerce/orderController.js";
import { isCustomer } from "../../middlewares/authentication.js";

router.get("/", (req, res, next) => {
    res.send({ success: true, message: "Ecommerce Orders Module Active" })
});

router.post("/createOrder", isCustomer, createOrder);
router.get("/getCustomerOrderDetail/:customerId", isCustomer, getCustomerOrderDetail);

export default router;
