import express from "express";
import customerRoutes from "./customers.js";
import orderRoutes from "./orders.js";
const router = express.Router();
/**
 * @swagger
 * /api/ecommerce: {
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

/**
 * @swagger
 * /api/ecommerce: {
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
router.get("/", (req, res) => {
    res.send("Hello World!");
});

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
router.use("/orders", orderRoutes);

/**
 * @swagger
 * /api/ecommerce/customers: {
 *   get: {
 *     summary: Get all customers
 *     tags: [Customers]
 *     responses: {
 *       200: {
 *         description: A list of customers
 *       }
 *     }
 *   }
 * }
 */
router.use("/customers", customerRoutes);

export default router;