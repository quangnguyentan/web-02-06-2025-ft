import { Router } from "express";
import {
  createLeague,
  deleteLeague,
  getAllLeagues,
  getLeagueById,
  updateLeague,
} from "../controllers/league.controller";

const router = Router();

router.route("/").post(createLeague).get(getAllLeagues);

router.route("/:id").get(getLeagueById).put(updateLeague).delete(deleteLeague);

export default router;
