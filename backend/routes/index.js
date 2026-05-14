import express from 'express';
import ecommerceRoutes from "./ecomerce/index.js";
import { getProperty } from '../controllers/common.js';
import UserController from '../controllers/userController.js';
import { fetchPermisionsByRoleId } from '../controllers/permissions.js';
const router = express.Router();

/* GET home page. */
router.post('/login', UserController.login);
router.post('/register', UserController.addUser);
router.get('/permisions/:roleId', fetchPermisionsByRoleId);
router.post('/send-notification', UserController.sendNotification);

router.use("/ecommerce", ecommerceRoutes);

export default router;
