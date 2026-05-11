import express from "express";
const router = express.Router();
import { createOrder, getCustomerOrderDetail } from "../../controllers/Ecommerce/orderController.js";
import { isCustomer } from "../../middlewares/authentication.js";

/**
 * @swagger
 * /api/ecommerce/orders: {
 *   get: {
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses: {
 *       200: {
 *         description: A list of orders
 *       }
 *     }
 *   }
 * }
 */
router.get("/", (req, res, next) => {
    res.send({ success: true, message: "Ecommerce Orders Module Active" })
});

/**
 * @swagger
 * /api/ecommerce/orders/createOrder: {
 *   post: {
 *     summary: Create order
 *     tags: [Orders]
 *     responses: {
 *       200: {
 *         description: Order created
 *       }
 *     }
 *   }
 * }
 */
router.post("/createOrder", isCustomer, createOrder);
/**
 * @swagger
 * /api/ecommerce/orders/getCustomerOrderDetail/:customerId: {
 *   get: {
 *     summary: Get customer order detail
 *     tags: [Orders]
 *     responses: {
 *       200: {
 *         description: Customer order detail
 *       }
 *     }
 *   }
 * }
 */
router.get("/getCustomerOrderDetail/:customerId", isCustomer, getCustomerOrderDetail);

export default router;
