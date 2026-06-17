import express from 'express';
// import { isLoggedIn } from "../../middlewares/auth.js";
import { createVlog, getAllVlogs, getVlogById, updateVlog, deleteVlog, likeVlog, unlikeVlog } from "../../controllers/vlogsController/vlogsController.js";

const router = express.Router();


router.post("/create", createVlog);
router.get("/get-all", getAllVlogs);
router.get("/:id", getVlogById);
router.put("/:id", updateVlog);
router.delete("/:id", deleteVlog);
router.post("/:id/like", likeVlog);
router.post("/:id/unlike", unlikeVlog);

export default router;