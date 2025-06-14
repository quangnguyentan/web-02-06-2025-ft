import { Router } from "express";
import {
  createSport,
  getAllSports,
  getSportById,
  updateSport,
  deleteSport,
} from "../controllers/sport.controller";

const router = Router();

router.route("/").post(createSport).get(getAllSports);

router.route("/:id").get(getSportById).put(updateSport).delete(deleteSport);

export default router;
