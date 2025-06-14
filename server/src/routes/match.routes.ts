import { Router } from "express";
import {
  createMatch,
  deleteMatch,
  getAllMatches,
  getMatchById,
  updateMatch,
} from "../controllers/match.controller";

const router = Router();

router.route("/").post(createMatch).get(getAllMatches);

router.route("/:id").get(getMatchById).put(updateMatch).delete(deleteMatch);

export default router;
