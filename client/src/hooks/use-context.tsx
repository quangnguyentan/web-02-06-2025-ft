import { League } from "@/types/league.types";
import { Match } from "@/types/match.types";
import { Replay } from "@/types/replay.types";
import { Sport } from "@/types/sport.types";
import { Team } from "@/types/team.types";
import { User } from "@/types/user.types";
import { createContext, useContext } from "react";

export type SelectedPageProps = {
  selectedPage: string;
  setSelectedPage: (c: string) => void;
  selectedSportsNavbarPage: string;
  setSelectedSportsNavbarPage: (c: string) => void;
  user: User[];
  setUser: (list: User[]) => void;
  addUser: (s: User) => void;
  sports: Sport[];
  setSports: (list: Sport[]) => void;
  addSport: (s: Sport) => void;
  league: League[];
  setLeague: (list: League[]) => void;
  addLeague: (s: League) => void;
  match: Match[];
  setMatch: (list: Match[]) => void;
  addMatch: (s: Match) => void;
  replay: Replay[];
  setReplay: (list: Replay[]) => void;
  addReplay: (s: Replay) => void;
  team: Team[];
  setTeam: (list: Team[]) => void;
  addTeam: (s: Team) => void;
};
export const SelectedPageContext = createContext<SelectedPageProps | undefined>(
  undefined
);

export const useSelectedPageContext = () => {
  const context = useContext(SelectedPageContext);
  if (!context) {
    throw new Error(
      "useSelectedPageContext must be used within a SelectedPageProvider"
    );
  }
  return context;
};
