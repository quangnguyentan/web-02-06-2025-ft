import { DateTabInfo, LeagueSchedule, Replay, Team } from "@/types/index.types";
import {
  GlobeAltIcon,
  ShieldCheckIcon,
  TrophyIcon,
  FootballIcon,
} from "@/components/layout/Icon"; // Assuming UserIcon for streamer avatar
import * as React from "react";

const today = new Date();

// Helper to format date as YYYY-MM-DD
const formatDateId = (date: Date, offsetDays: number = 0): string => {
  const d = new Date(date);
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper to format date as DD/MM
const formatSuffix = (date: Date, offsetDays: number = 0): string => {
  const d = new Date(date);
  d.setDate(d.getDate() + offsetDays);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${day}/${month}`;
};

// Helper for day of week label, adjusted for past dates primarily
const dayOfWeekLabel = (date: Date, offsetDays: number = 0): string => {
  const d = new Date(date);
  d.setDate(d.getDate() + offsetDays);
  const currentDay = new Date();
  currentDay.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);

  if (d.getTime() === currentDay.getTime()) return "Hôm Nay";

  const dayIndex = d.getDay();
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  return days[dayIndex];
};

// Dates for results page - typically today and past dates
export const mockDateTabsForResults: DateTabInfo[] = [
  {
    id: formatDateId(today, -6),
    label: dayOfWeekLabel(today, -6),
    dateSuffix: formatSuffix(today, -6),
  },
  {
    id: formatDateId(today, -5),
    label: dayOfWeekLabel(today, -5),
    dateSuffix: formatSuffix(today, -5),
  },
  {
    id: formatDateId(today, -4),
    label: dayOfWeekLabel(today, -4),
    dateSuffix: formatSuffix(today, -4),
  },
  {
    id: formatDateId(today, -3),
    label: dayOfWeekLabel(today, -3),
    dateSuffix: formatSuffix(today, -3),
  },
  {
    id: formatDateId(today, -2),
    label: dayOfWeekLabel(today, -2),
    dateSuffix: formatSuffix(today, -2),
  },
  {
    id: formatDateId(today, -1),
    label: dayOfWeekLabel(today, -1),
    dateSuffix: formatSuffix(today, -1),
  }, // Yesterday
  {
    id: formatDateId(today, 0),
    label: "Hôm Nay",
    dateSuffix: formatSuffix(today, 0),
    isToday: true,
  },
];

const defaultStreamerAvatar =
  "https://via.placeholder.com/24/CBD5E0/4A5568?text=S";

const createTeam = (
  name: string,
  shortCode: string,
  color: string = "CCCCCC",
  textColor: string = "000000"
): Team => ({
  name,
  logoUrl: `https://via.placeholder.com/32/${color}/${textColor}?text=${shortCode}`,
});

const yesterdaySuffix = formatSuffix(today, -1);
const twoDaysAgoSuffix = formatSuffix(today, -2);

const mockResultsYesterday: LeagueSchedule[] = [
  {
    id: "romanian_liga_1",
    name: "Romanian Liga I",
    icon: React.createElement(FootballIcon, {
      className: "w-5 h-5 text-red-400",
    }),
    matches: [
      {
        id: "rl1_y",
        sportName: "Bóng đá",
        leagueName: "Romanian Liga I",
        teamA: createTeam("FC Unirea 2004 Slobozia", "SLO", "FFFF00", "000000"),
        teamB: createTeam("FC Voluntari", "VOL", "800080", "FFFFFF"),
        time: "00:00",
        date: yesterdaySuffix,
        isLive: false,
        scoreA: 0,
        scoreB: 0,
        streamerName: "Người Đá",
        streamerAvatarUrl: defaultStreamerAvatar,
      },
    ],
  },
  {
    id: "iceland_premier",
    name: "Iceland Premier League",
    icon: React.createElement(ShieldCheckIcon, {
      className: "w-5 h-5 text-blue-300",
    }),
    matches: [
      {
        id: "ip1_y",
        sportName: "Bóng đá",
        leagueName: "Iceland Premier League",
        teamA: createTeam("Valur Reykjavik", "VAL", "FF0000", "FFFFFF"),
        teamB: createTeam("Fram Reykjavik", "FRA", "0000FF", "FFFFFF"),
        time: "02:15",
        date: yesterdaySuffix,
        isLive: false,
        scoreA: 2,
        scoreB: 1,
        streamerName: "Bình Luận",
        streamerAvatarUrl: defaultStreamerAvatar,
      },
    ],
  },
  {
    id: "argentine_div2",
    name: "Argentine Division 2",
    icon: React.createElement(GlobeAltIcon, {
      className: "w-5 h-5 text-sky-400",
    }),
    matches: [
      {
        id: "ad1_y",
        sportName: "Bóng đá",
        leagueName: "Argentine Division 2",
        teamA: createTeam("Nueva Chicago", "NUC", "006400", "FFFFFF"),
        teamB: createTeam("Temperley", "TEM", "ADD8E6", "000000"),
        time: "05:00",
        date: yesterdaySuffix,
        isLive: false,
        scoreA: 0,
        scoreB: 1,
        streamerName: "Triệu Kắc Bíp",
        streamerAvatarUrl: defaultStreamerAvatar,
      },
    ],
  },
  {
    id: "concacaf_w_u20",
    name: "CONCACAF U20 Women's Championship",
    icon: React.createElement(TrophyIcon, {
      className: "w-5 h-5 text-yellow-300",
    }),
    matches: [
      {
        id: "cwU20_y",
        sportName: "Bóng đá",
        leagueName: "CONCACAF U20 Women's Championship",
        teamA: createTeam("Mexico (w) U20", "MEX", "006847", "FFFFFF"),
        teamB: createTeam("Canada (w) U20", "CAN", "FF0000", "FFFFFF"),
        time: "05:30",
        date: yesterdaySuffix,
        isLive: false,
        scoreA: 4,
        scoreB: 2,
        streamerName: "Mỹ Tôm",
        streamerAvatarUrl: defaultStreamerAvatar,
      },
    ],
  },
  {
    id: "giao_huu_results",
    name: "Giao hữu",
    icon: React.createElement(GlobeAltIcon, {
      className: "w-5 h-5 text-teal-300",
    }),
    matches: [
      {
        id: "gh_res1_y",
        sportName: "Bóng đá",
        leagueName: "Giao hữu",
        teamA: createTeam("Brazil (w)", "BRA", "FFDB00", "008000"),
        teamB: createTeam("Japan (w)", "JPN", "FFFFFF", "BC002D"),
        time: "06:00",
        date: yesterdaySuffix,
        isLive: false,
        scoreA: 2,
        scoreB: 1,
        streamerName: "Người Cũn",
        streamerAvatarUrl: defaultStreamerAvatar,
      },
    ],
  },
];

const mockResultsTwoDaysAgo: LeagueSchedule[] = [
  {
    id: "la_liga",
    name: "La Liga",
    icon: React.createElement(FootballIcon, {
      className: "w-5 h-5 text-orange-400",
    }),
    matches: [
      {
        id: "ll1_2da",
        sportName: "Bóng đá",
        leagueName: "La Liga",
        teamA: createTeam("Real Madrid", "RMA", "FEBE10", "00529F"),
        teamB: createTeam("Barcelona", "BAR", "A50044", "004D98"),
        time: "20:00",
        date: twoDaysAgoSuffix,
        isLive: false,
        scoreA: 3,
        scoreB: 2,
        streamerName: "BLV Anh Tú",
        streamerAvatarUrl: defaultStreamerAvatar,
      },
    ],
  },
  {
    id: "serie_a",
    name: "Serie A",
    icon: React.createElement(ShieldCheckIcon, {
      className: "w-5 h-5 text-indigo-400",
    }),
    matches: [
      {
        id: "sa1_2da",
        sportName: "Bóng đá",
        leagueName: "Serie A",
        teamA: createTeam("Inter Milan", "INT", "0068C8", "FFFFFF"),
        teamB: createTeam("AC Milan", "ACM", "FB090B", "FFFFFF"),
        time: "18:30",
        date: twoDaysAgoSuffix,
        isLive: false,
        scoreA: 1,
        scoreB: 1,
        streamerName: "BLV Bá Hổ",
        streamerAvatarUrl: defaultStreamerAvatar,
      },
    ],
  },
];

export const mockResultsData: { [dateId: string]: LeagueSchedule[] } = {
  [formatDateId(today, -1)]: mockResultsYesterday,
  [formatDateId(today, -2)]: mockResultsTwoDaysAgo,
  // Results for "Hôm Nay" (today) would typically be empty or very few very early games.
  [formatDateId(today, 0)]: mockResultsYesterday.slice(0, 1).map((league) => ({
    ...league,
    matches: league.matches.map((m) => ({
      ...m,
      id: m.id + "_today",
      date: formatSuffix(today, 0),
      time: "00:05", // Assuming it just finished
      scoreA: Math.floor(Math.random() * 3),
      scoreB: Math.floor(Math.random() * 3),
    })),
  })),
  [formatDateId(today, -3)]: mockResultsTwoDaysAgo
    .slice(0, 1)
    .map((league) => ({
      ...league,
      matches: league.matches.map((m) => ({
        ...m,
        id: m.id + "_3da",
        date: formatSuffix(today, -3),
        scoreA: Math.floor(Math.random() * 4),
        scoreB: Math.floor(Math.random() * 2),
      })),
    })),
  [formatDateId(today, -4)]: [], // No results for this day
  [formatDateId(today, -5)]: mockResultsYesterday.slice(1, 2).map((league) => ({
    ...league,
    matches: league.matches.map((m) => ({
      ...m,
      id: m.id + "_5da",
      date: formatSuffix(today, -5),
      scoreA: Math.floor(Math.random() * 1),
      scoreB: Math.floor(Math.random() * 5),
    })),
  })),
  [formatDateId(today, -6)]: [],
};

// Using the same replay data as schedule page for simplicity, can be different
export const mockReplayDataForResultsPage: Replay[] = [
  {
    id: "replay1_res",
    title: "Fullmatch Asia Championships 2025 | BLV Thit Xiên | 11.4.25",
    sportType: "BÓNG ĐÁ",
    date: "12/04/2025",
    thumbnailUrl:
      "https://via.placeholder.com/120x70/1A202C/FFFFFF?text=ReplayA",
    duration: "2:05:30",
  },
  {
    id: "replay2_res",
    title: "Fullmatch Everton vs Man United | BLV Bún Chả | 22.2.25",
    sportType: "BÓNG ĐÁ",
    date: "23/02/2025",
    thumbnailUrl:
      "https://via.placeholder.com/120x70/2D3748/FFFFFF?text=ReplayB",
    duration: "1:58:10",
  },
  {
    id: "replay3_res",
    title: "Full match Las Palmas vs Barcelona | BLV Người Cũn | 23.2.25",
    sportType: "BÓNG ĐÁ",
    date: "23/02/2025",
    thumbnailUrl:
      "https://via.placeholder.com/120x70/4A5568/FFFFFF?text=ReplayC",
    duration: "2:10:00",
  },
  {
    id: "replay4_res",
    title: "Full match Arsenal vs West Ham | BLV Người Cũn | 23.2.25",
    sportType: "BÓNG ĐÁ",
    date: "23/02/2025",
    thumbnailUrl:
      "https://via.placeholder.com/120x70/2C5282/FFFFFF?text=ReplayD",
    duration: "2:02:45",
  },
  {
    id: "replay5_res",
    title: "Full match Man City vs Real Madrid | BLV Người Thỏ | 12.2.25",
    sportType: "BÓNG ĐÁ",
    date: "12/02/2025",
    thumbnailUrl:
      "https://via.placeholder.com/120x70/3182CE/FFFFFF?text=ReplayE",
    duration: "2:15:20",
  },
];
