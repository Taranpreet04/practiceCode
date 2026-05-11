import express from 'express';
import ecommerceRoutes from "./ecomerce/index.js";
import { getProperty } from '../controllers/common.js';
import UserController from '../controllers/userController.js';
const router = express.Router();

/* GET home page. */
router.post('/login', UserController.login);
router.post('/register', UserController.addUser);
router.post('/send-notification', UserController.sendNotification);
// Redundant route removed as it's handled by /api/ecommerce

router.use("/ecommerce", ecommerceRoutes);

export default router;
