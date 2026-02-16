import express from 'express';
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send({ success: true, title: 'Taran' });
});

export default router;
