import { Router } from "express";
import {
  createTeam,
  deleteTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
} from "../controllers/team.controller";

const router = Router();

router.route("/").post(createTeam).get(getAllTeams);

router.route("/:id").get(getTeamById).put(updateTeam).delete(deleteTeam);

export default router;
