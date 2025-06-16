import { DateTabInfo, LeagueSchedule } from "@/types/match.types";
import {
  GlobeAltIcon,
  ShieldCheckIcon,
  TrophyIcon,
  FootballIcon,
} from "@/components/layout/Icon";
import * as React from "react";
import { Match, MatchStatusType } from "@/types/match.types";
import { Replay } from "@/types/replay.types";
import { Team } from "@/types/team.types";

// Set today to current system time (assuming UTC+07:00 Vietnam time)
const today = new Date(); // System time, adjusted to local

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

// Generate date tabs based on real data, starting from today
export const generateDateTabs = (matches: Match[]): DateTabInfo[] => {
  const uniqueDates = new Set(
    matches
      ?.filter((match) => {
        const matchDate = new Date(match.startTime || today);
        return !isNaN(matchDate.getTime()) && matchDate >= today;
      })
      .map((match) => formatDate(new Date(match.startTime || today)))
  );
  return Array.from(uniqueDates).map((dateId) => {
    const date = new Date(dateId);
    console.log(
      "Date ID:",
      dateId,
      "Parsed Date:",
      date,
      "Label:",
      dayOfWeekLabel(date)
    ); // Debug
    return {
      id: dateId,
      label: dayOfWeekLabel(date),
      dateSuffix: formatSuffix(date),
      isToday: date.toDateString() === today.toDateString(),
      hasLive: matches.some(
        (match) =>
          formatDate(new Date(match.startTime || today)) === dateId &&
          match.status === MatchStatusType.LIVE
      ),
    };
  });
};

const createTeam = (team?: Team): Team => ({
  name: team?.name || "Unknown",
  logo: team?.logo || `https://via.placeholder.com/32/CCCCCC/000000?text=UK`,
});

const transformMatchesToSchedule = (
  matches: Match[]
): {
  [dateId: string]: LeagueSchedule[];
} => {
  const scheduleByDate: { [dateId: string]: LeagueSchedule[] } = {};

  matches.forEach((match) => {
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
      "Toulon Tournament": React.createElement(TrophyIcon, {
        className: "w-5 h-5 text-yellow-400",
      }),
      "Premier League": React.createElement(FootballIcon, {
        className: "w-5 h-5 text-purple-400",
      }),
    };
    const icon = iconMap[leagueName] || null;

    if (!scheduleByDate[dateId]) {
      scheduleByDate[dateId] = [];
    }

    const leagueSchedule = scheduleByDate[dateId].find(
      (ls) => ls.id === leagueId
    );
    const matchData: Match = {
      _id: match._id || `m_${Date.now()}`,
      title: match.title || `${match.homeTeam.name} vs ${match.awayTeam.name}`,
      slug: match.slug || `${match._id || Date.now()}`,
      homeTeam: createTeam(match.homeTeam),
      awayTeam: createTeam(match.awayTeam),
      league: match.league,
      sport: match.sport,
      startTime: match.startTime,
      status: match.status,
      scores: match.scores,
      streamLinks: match.streamLinks,
      isHot: match.isHot,
      mainCommentator:
        match.mainCommentator ||
        match.streamLinks[0]?.commentator ||
        "Người Dùng",
      mainCommentatorImage:
        match.mainCommentatorImage ||
        match.streamLinks[0]?.commentatorImage ||
        "https://via.placeholder.com/24/4A5568/E2E8F0?text=U",
      secondaryCommentator: match.secondaryCommentator,
      secondaryCommentatorImage: match.secondaryCommentatorImage,
    };

    if (leagueSchedule) {
      leagueSchedule.matches.push(matchData);
    } else {
      scheduleByDate[dateId].push({
        id: leagueId,
        name: leagueName,
        icon,
        matches: [matchData],
      });
    }
  });

  return scheduleByDate;
};

export const useScheduleData = (
  matches: Match[] = []
): {
  dateTabs: DateTabInfo[];
  scheduleData: { [dateId: string]: LeagueSchedule[] };
} => {
  const dateTabs = generateDateTabs(matches);
  const scheduleData = transformMatchesToSchedule(matches);
  return { dateTabs, scheduleData };
};

export const mockReplayDataForSchedule: Replay[] = []; // Will be replaced by API data
