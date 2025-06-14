import { Match } from "./match.types";
import { Sport } from "./sport.types";

export type Replay = {
  _id?: string;
  title?: string;
  slug?: string;
  description?: string;
  videoUrl?: string;
  thumbnail?: string;
  match?: Match;
  duration?: number;
  views?: number;
  commentator?: string;
  sport?: Sport;
  publishDate?: Date;
};
