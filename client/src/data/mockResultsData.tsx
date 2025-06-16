// src/data/mockResultsData.ts
import {
  DateTabInfo,
  LeagueSchedule,
  Match,
  MatchStatusType,
} from "@/types/match.types";
import {
  GlobeAltIcon,
  ShieldCheckIcon,
  FootballIcon,
} from "@/components/layout/Icon";
import * as React from "react";

// Set today to current system time (assuming UTC+07:00 Vietnam time)
const today = new Date("2025-06-16T11:05:00+07:00"); // Set to June 16, 2025, 11:05 AM +07

export const formatDate = (date: Date, offsetDays: number = 0): string => {
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

const dayOfWeekLabel = (date: Date): string => {
  const dayIndex = date.getDay();
  if (date.toDateString() === today.toDateString()) return "Hôm Nay";
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  return days[dayIndex];
};

// Mock matches for past results
export const mockPastMatches: Match[] = [
  {
    _id: "m1",
    title: "Việt Nam vs Thái Lan",
    slug: "vietnam-vs-thailand",
    homeTeam: {
      _id: "t1",
      name: "Việt Nam",
      logo: "https://via.placeholder.com/32/FF0000/FFFFFF?text=VN",
    },
    awayTeam: {
      _id: "t2",
      name: "Thái Lan",
      logo: "https://via.placeholder.com/32/0000FF/FFFFFF?text=TH",
    },
    league: {
      _id: "l1",
      name: "Giao hữu",
    },
    sport: {
      _id: "s1",
      name: "Football",
      slug: "football",
    },
    startTime: new Date(formatDate(today, 0)), // Today: June 16, 2025
    status: MatchStatusType.FINISHED,
    scores: {
      homeScore: 2,
      awayScore: 1,
    },
    streamLinks: [
      {
        url: "https://example.com/stream1",
        label: "HD Stream",
        commentator: "BLV Anh Ngọc",
        commentatorImage:
          "https://via.placeholder.com/24/4A5568/E2E8F0?text=AN",
        priority: 1,
      },
    ],
    isHot: true,
    mainCommentator: "BLV Anh Ngọc",
    mainCommentatorImage:
      "https://via.placeholder.com/24/4A5568/E2E8F0?text=AN",
  },
  {
    _id: "m2",
    title: "Hà Nội FC vs TP.HCM FC",
    slug: "hanoi-fc-vs-tphcm-fc",
    homeTeam: {
      _id: "t3",
      name: "Hà Nội FC",
      logo: "https://via.placeholder.com/32/FFD700/000000?text=HN",
    },
    awayTeam: {
      _id: "t4",
      name: "TP.HCM FC",
      logo: "https://via.placeholder.com/32/FF4500/FFFFFF?text=HCM",
    },
    league: {
      _id: "l2",
      name: "VLeague2",
    },
    sport: {
      _id: "s1",
      name: "Football",
      slug: "football",
    },
    startTime: new Date(formatDate(today, -1)), // Yesterday: June 15, 2025
    status: MatchStatusType.FINISHED,
    scores: {
      homeScore: 3,
      awayScore: 0,
    },
    streamLinks: [],
    isHot: false,
  },
  {
    _id: "m3",
    title: "Man United vs Arsenal",
    slug: "man-united-vs-arsenal",
    homeTeam: {
      _id: "t5",
      name: "Man United",
      logo: "https://via.placeholder.com/32/FF0000/FFFFFF?text=MU",
    },
    awayTeam: {
      _id: "t6",
      name: "Arsenal",
      logo: "https://via.placeholder.com/32/FFFFFF/FF0000?text=ARS",
    },
    league: {
      _id: "l3",
      name: "Premier League",
    },
    sport: {
      _id: "s1",
      name: "Football",
      slug: "football",
    },
    startTime: new Date(formatDate(today, -2)), // Two days ago: June 14, 2025
    status: MatchStatusType.FINISHED,
    scores: {
      homeScore: 1,
      awayScore: 1,
    },
    streamLinks: [],
    isHot: true,
  },
];

// ... (rest of the file remains the same, including generateDateTabsForResults, transformMatchesToResults, useScheduleDataForResults, etc.)
// Generate date tabs for past results
export const generateDateTabsForResults = (matches: Match[]): DateTabInfo[] => {
  // Ensure matches is an array
  const validMatches = Array.isArray(matches) ? matches : [];
  const uniqueDates = new Set(
    validMatches
      .filter((match) => {
        const matchDate = new Date(match.startTime || today);
        return !isNaN(matchDate.getTime()) && matchDate <= today;
      })
      .map((match) => formatDate(new Date(match.startTime || today)))
  );
  return Array.from(uniqueDates)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) // Sort in descending order (newest first)
    .map((dateId) => {
      const date = new Date(dateId);
      return {
        id: dateId,
        label: dayOfWeekLabel(date),
        dateSuffix: formatSuffix(date),
        isToday: date.toDateString() === today.toDateString(),
        hasLive: false, // No live matches in results
      };
    });
};

// Transform matches to results data
const transformMatchesToResults = (
  matches: Match[]
): { [dateId: string]: LeagueSchedule[] } => {
  const resultsByDate: { [dateId: string]: LeagueSchedule[] } = {};

  // Ensure matches is an array
  const validMatches = Array.isArray(matches) ? matches : [];

  validMatches.forEach((match) => {
    const dateId = formatDate(new Date(match.startTime || today));
    const leagueId =
      match.league?._id || match.league?.name || "unknown_league";
    const leagueName = match.league?.name || "Unknown League";
    const iconMap: { [key: string]: React.ReactNode } = {
      "Giao hữu": React.createElement(GlobeAltIcon, {
        className: "w-5 h-5 text-teal-300",
      }),
      VLeague2: React.createElement(ShieldCheckIcon, {
        className: "w-5 h-5 text-green-400",
      }),
      "Premier League": React.createElement(FootballIcon, {
        className: "w-5 h-5 text-purple-400",
      }),
    };
    const icon = iconMap[leagueName] || null;

    if (!resultsByDate[dateId]) {
      resultsByDate[dateId] = [];
    }

    const leagueSchedule = resultsByDate[dateId].find(
      (ls) => ls.id === leagueId
    );
    const matchData: Match = {
      _id: match._id || `m_${Date.now()}`,
      title:
        match.title || `${match.homeTeam?.name} vs ${match.awayTeam?.name}`,
      slug: match.slug || `${match._id || Date.now()}`,
      homeTeam: {
        _id: match.homeTeam?._id,
        name: match.homeTeam?.name || "Unknown",
        logo:
          match.homeTeam?.logo ||
          "https://via.placeholder.com/32/CCCCCC/000000?text=UK",
      },
      awayTeam: {
        _id: match.awayTeam?._id,
        name: match.awayTeam?.name || "Unknown",
        logo:
          match.awayTeam?.logo ||
          "https://via.placeholder.com/32/CCCCCC/000000?text=UK",
      },
      league: match.league,
      sport: match.sport,
      startTime: match.startTime,
      status: match.status,
      scores: match.scores,
      streamLinks: match.streamLinks,
      isHot: match.isHot,
      mainCommentator:
        match.mainCommentator ||
        match.streamLinks?.[0]?.commentator ||
        "Người Dùng",
      mainCommentatorImage:
        match.mainCommentatorImage ||
        match.streamLinks?.[0]?.commentatorImage ||
        "https://via.placeholder.com/24/4A5568/E2E8F0?text=U",
      secondaryCommentator: match.secondaryCommentator,
      secondaryCommentatorImage: match.secondaryCommentatorImage,
    };

    if (leagueSchedule) {
      leagueSchedule.matches.push(matchData);
    } else {
      resultsByDate[dateId].push({
        id: leagueId,
        name: leagueName,
        icon,
        matches: [matchData],
      });
    }
  });

  return resultsByDate;
};

// Hook for results data
export const useScheduleDataForResults = (
  matches: Match[] = []
): {
  dateTabs: DateTabInfo[];
  scheduleData: { [dateId: string]: LeagueSchedule[] };
} => {
  const dateTabs = generateDateTabsForResults(matches);
  const scheduleData = transformMatchesToResults(matches);
  return { dateTabs, scheduleData };
};

export const mockDateTabsForResults =
  generateDateTabsForResults(mockPastMatches);
export const mockResultsData = transformMatchesToResults(mockPastMatches);
