import express from 'express';
import ecommerceRoutes from "./ecomerce/index.js";
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send({ success: true, title: 'Taran' });
});

// Redundant route removed as it's handled by /api/ecommerce
router.use("/ecommerce", ecommerceRoutes);

export default router;
