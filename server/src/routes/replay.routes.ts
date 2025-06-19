import { Router } from "express";
import {
  createReplay,
  deleteReplay,
  getAllReplays,
  getReplayById,
  getReplayBySlug,
  updateReplay,
  uploadFiles,
} from "../controllers/replay.controller";

const router = Router();

router.route("/").post(uploadFiles, createReplay).get(getAllReplays);
router.route("/getReplay/:slug").get(getReplayBySlug);
router
  .route("/:id")
  .get(getReplayById)
  .put(uploadFiles, updateReplay)
  .delete(deleteReplay);

export default router;
