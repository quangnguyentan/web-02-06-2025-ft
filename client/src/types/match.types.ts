import { League } from "./league.types";
import { Sport } from "./sport.types";
import { Team } from "./team.types";
interface IStreamLink {
  label?: string;
  url?: string;
  image?: string; // Hình ảnh đại diện cho link stream
  commentator?: string;
  commentatorImage?: string;
  priority?: number;
}
export type Match = {
  _id?: string;
  title?: string;
  slug?: string;
  homeTeam?: Team;
  awayTeam?: Team;
  league?: League;
  sport?: Sport;
  startTime?: Date;
  status?: MatchStatusType; // Sử dụng enum đã định nghĩa
  scores?: {
    homeScore?: number;
    awayScore?: number;
  };
  streamLinks?: IStreamLink[];
  isHot?: boolean;
  mainCommentator?: string; // BLV chính của trận đấu
  mainCommentatorImage?: string; // Hình ảnh BLV chính
  secondaryCommentator?: string; // BLV phụ của trận đấu
  secondaryCommentatorImage?: string; // Hình ảnh BLV phụ
};
export enum MatchStatusType {
  UPCOMING = "UPCOMING",
  LIVE = "LIVE",
  FINISHED = "FINISHED",
  POSTPONED = "POSTPONED",
  CANCELLED = "CANCELLED",
}
export interface DateTabInfo {
  id: string; // YYYY-MM-DD
  label: string; // "Hôm Nay", "T4", "T5"
  dateSuffix: string; // "03/06"
  isToday?: boolean;
  hasLive?: boolean; // To show a live indicator on the tab
}

export interface LeagueSchedule {
  id: string;
  name: string;
  icon: React.ReactNode; // Specific icon for the league header
  matches: Match[]; // Ensure matches are of type Match
}
