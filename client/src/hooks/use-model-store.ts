import { create } from "zustand";
import { User } from "../types/user.types";
import { Sport } from "@/types/sport.types";
import { Match } from "@/types/match.types";
import { Team } from "@/types/team.types";
import { Replay } from "@/types/replay.types";
import { League } from "@/types/league.types";

export type ModalType =
  | "createUser"
  | "editUser"
  | "deleteUser"
  | "createSport"
  | "editSport"
  | "deleteSport"
  | "createMatch"
  | "editMatch"
  | "deleteMatch"
  | "createTeam"
  | "deleteTeam"
  | "editTeam"
  | "createReplay"
  | "editReplay"
  | "deleteReplay"
  | "createLeague"
  | "deleteLeague"
  | "editLeague";

export interface ModalData {
  user?: User;
  sport?: Sport;
  match?: Match;
  team?: Team;
  replay?: Replay;
  league?: League;
}
interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}
export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null }),
}));
