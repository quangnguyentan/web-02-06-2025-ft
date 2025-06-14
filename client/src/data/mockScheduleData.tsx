import { DateTabInfo, LeagueSchedule, Replay, Team } from "@/types/index.types";
import {
  GlobeAltIcon,
  ShieldCheckIcon,
  TrophyIcon,
  FootballIcon,
} from "@/components/layout/Icon";
import * as React from "react";

const today = new Date();
const formatDate = (date: Date, offsetDays: number = 0): string => {
  const d = new Date(date);
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatSuffix = (date: Date, offsetDays: number = 0): string => {
  const d = new Date(date);
  d.setDate(d.getDate() + offsetDays);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${day}/${month}`;
};

const dayOfWeekLabel = (date: Date, offsetDays: number = 0): string => {
  const d = new Date(date);
  d.setDate(d.getDate() + offsetDays);
  const dayIndex = d.getDay();
  if (offsetDays === 0) return "Hôm Nay";
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  return days[dayIndex];
};

export const mockDateTabs: DateTabInfo[] = [
  {
    id: formatDate(today, 0),
    label: dayOfWeekLabel(today, 0),
    dateSuffix: formatSuffix(today, 0),
    isToday: true,
    hasLive: true,
  },
  {
    id: formatDate(today, 1),
    label: dayOfWeekLabel(today, 1),
    dateSuffix: formatSuffix(today, 1),
  },
  {
    id: formatDate(today, 2),
    label: dayOfWeekLabel(today, 2),
    dateSuffix: formatSuffix(today, 2),
  },
  {
    id: formatDate(today, 3),
    label: dayOfWeekLabel(today, 3),
    dateSuffix: formatSuffix(today, 3),
  },
  {
    id: formatDate(today, 4),
    label: dayOfWeekLabel(today, 4),
    dateSuffix: formatSuffix(today, 4),
  },
  {
    id: formatDate(today, 5),
    label: dayOfWeekLabel(today, 5),
    dateSuffix: formatSuffix(today, 5),
  },
];

const defaultStreamerAvatar =
  "https://via.placeholder.com/24/4A5568/E2E8F0?text=U";

const createTeam = (
  name: string,
  shortCode: string,
  color: string = "CCCCCC",
  textColor: string = "000000"
): Team => ({
  name,
  logoUrl: `https://via.placeholder.com/32/${color}/${textColor}?text=${shortCode}`,
});

const mockMatchesToday: LeagueSchedule[] = [
  {
    id: "giao_huu",
    name: "Giao hữu",
    icon: React.createElement(GlobeAltIcon, {
      className: "w-5 h-5 text-teal-300",
    }),
    matches: [
      {
        id: "gh1",
        sportName: "Bóng đá",
        leagueName: "Giao hữu",
        teamA: createTeam("Germany (w) U19", "GER", "000000", "FFFFFF"),
        teamB: createTeam("France (w) U19", "FRA", "0055A4", "FFFFFF"),
        time: "17:00",
        date: formatSuffix(today, 0),
        isLive: false,
        streamerName: "Người Dùng",
        streamerAvatarUrl: defaultStreamerAvatar,
      },
      {
        id: "gh2",
        sportName: "Bóng đá",
        leagueName: "Giao hữu",
        teamA: createTeam("Malaysia", "MAS", "FFD700", "000000"),
        teamB: createTeam("Cape Verde", "CPV", "003893", "FFFFFF"),
        time: "20:00",
        date: formatSuffix(today, 0),
        isLive: false,
        streamerName: "Người Dùng",
        streamerAvatarUrl: defaultStreamerAvatar,
      },
    ],
  },
  {
    id: "v_league",
    name: "V League",
    icon: React.createElement(ShieldCheckIcon, {
      className: "w-5 h-5 text-green-400",
    }),
    matches: [
      {
        id: "vl1",
        sportName: "Bóng đá",
        leagueName: "V League",
        teamA: createTeam("Bình Định", "BD", "FF0000", "FFFFFF"),
        teamB: createTeam("Công An Hà Nội", "CAHN", "B3262F", "FFFFFF"),
        time: "18:00",
        date: formatSuffix(today, 0),
        isLive: true,
        liveStatus: "Live",
        streamerName: "Người Đá",
        streamerAvatarUrl: defaultStreamerAvatar,
      },
    ],
  },
  {
    id: "toulon",
    name: "Toulon Tournament",
    icon: React.createElement(TrophyIcon, {
      className: "w-5 h-5 text-yellow-400",
    }),
    matches: [
      {
        id: "tt1",
        sportName: "Bóng đá",
        leagueName: "Toulon Tournament",
        teamA: createTeam("Mali U20", "MLI", "008751", "FFFFFF"),
        teamB: createTeam("Panama U20", "PAN", "DA121A", "FFFFFF"),
        time: "19:00",
        date: formatSuffix(today, 0),
        isLive: false,
        streamerName: "Người Cast",
        streamerAvatarUrl: defaultStreamerAvatar,
      },
      {
        id: "tt2",
        sportName: "Bóng đá",
        leagueName: "Toulon Tournament",
        teamA: createTeam("France U20", "FRA", "0055A4", "FFFFFF"),
        teamB: createTeam("Saudi Arabia U23", "KSA", "006C35", "FFFFFF"),
        time: "22:30",
        date: formatSuffix(today, 0),
        isLive: false,
        streamerName: "Người Kiên",
        streamerAvatarUrl: defaultStreamerAvatar,
      },
    ],
  },
];

const mockMatchesTomorrow: LeagueSchedule[] = [
  {
    id: "premier_league",
    name: "Premier League",
    icon: React.createElement(FootballIcon, {
      className: "w-5 h-5 text-purple-400",
    }),
    matches: [
      {
        id: "pl1",
        sportName: "Bóng đá",
        leagueName: "Premier League",
        teamA: createTeam("Man City", "MCI", "6CABDD", "FFFFFF"),
        teamB: createTeam("Liverpool", "LIV", "C8102E", "FFFFFF"),
        time: "19:30",
        date: formatSuffix(today, 1),
        isLive: false,
        streamerName: "BLV Anh Quân",
        streamerAvatarUrl: defaultStreamerAvatar,
      },
      {
        id: "pl2",
        sportName: "Bóng đá",
        leagueName: "Premier League",
        teamA: createTeam("Arsenal", "ARS", "EF0107", "FFFFFF"),
        teamB: createTeam("Chelsea", "CHE", "034694", "FFFFFF"),
        time: "22:00",
        date: formatSuffix(today, 1),
        isLive: false,
        streamerName: "BLV Tạ Biên Cương",
        streamerAvatarUrl: defaultStreamerAvatar,
      },
    ],
  },
];

export const mockScheduleData: { [dateId: string]: LeagueSchedule[] } = {
  [formatDate(today, 0)]: mockMatchesToday,
  [formatDate(today, 1)]: mockMatchesTomorrow,
  // Add more dates and their schedules as needed
  [formatDate(today, 2)]: [], // Example of a day with no matches
  [formatDate(today, 3)]: mockMatchesToday.slice(0, 1).map((league) => ({
    ...league,
    matches: league.matches.map((m) => ({
      ...m,
      id: m.id + "_d3",
      date: formatSuffix(today, 3),
    })),
  })), // Sample data for T6
  [formatDate(today, 4)]: mockMatchesTomorrow.slice(0, 1).map((league) => ({
    ...league,
    matches: league.matches.map((m) => ({
      ...m,
      id: m.id + "_d4",
      date: formatSuffix(today, 4),
    })),
  })), // Sample data for T7
  [formatDate(today, 5)]: [],
};

export const mockReplayDataForSchedule: Replay[] = [
  {
    id: "replay1",
    title: "Fullmatch Asia Championships 2025 | BLV Thit Xiên | 11.4.25",
    sportType: "BÓNG ĐÁ",
    date: "12/04/2025",
    thumbnailUrl:
      "https://via.placeholder.com/120x70/1A202C/FFFFFF?text=Replay1",
    duration: "2:05:30",
  },
  {
    id: "replay2",
    title: "Fullmatch Everton vs Man United | BLV Bún Chả | 22.2.25",
    sportType: "BÓNG ĐÁ",
    date: "23/02/2025",
    thumbnailUrl:
      "https://via.placeholder.com/120x70/2D3748/FFFFFF?text=Replay2",
    duration: "1:58:10",
  },
  {
    id: "replay3",
    title: "Full match Las Palmas vs Barcelona | BLV Người Cũn | 23.2.25",
    sportType: "BÓNG ĐÁ",
    date: "23/02/2025",
    thumbnailUrl:
      "https://via.placeholder.com/120x70/4A5568/FFFFFF?text=Replay3",
    duration: "2:10:00",
  },
  {
    id: "replay4",
    title: "Full match Arsenal vs West Ham | BLV Người Cũn | 23.2.25",
    sportType: "BÓNG ĐÁ",
    date: "23/02/2025",
    thumbnailUrl:
      "https://via.placeholder.com/120x70/2C5282/FFFFFF?text=Replay4",
    duration: "2:02:45",
  },
  {
    id: "replay5",
    title: "Full match Man City vs Real Madrid | BLV Người Thỏ | 12.2.25",
    sportType: "BÓNG ĐÁ",
    date: "12/02/2025",
    thumbnailUrl:
      "https://via.placeholder.com/120x70/3182CE/FFFFFF?text=Replay5",
    duration: "2:15:20",
  },
];
