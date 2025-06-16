// src/pages/Result.tsx
import * as React from "react";
import ResultsPage from "@/components/layout/ResultPage";
import { useScheduleDataForResults, formatDate } from "@/data/mockResultsData";
import { apiGetAllMatches } from "@/services/match.services";
import { apiGetAllReplays } from "@/services/replay.services";
import { Match, MatchStatusType } from "@/types/match.types";
import { Replay } from "@/types/replay.types";
import {
  mockDateTabsForResults,
  mockResultsData,
  mockPastMatches,
} from "@/data/mockResultsData";

const today = new Date("2025-06-16T11:09:00+07:00"); // Updated to current time: June 16, 2025, 11:09 AM +07

const Result: React.FC = () => {
  const [matchData, setMatchData] = React.useState<Match[]>([]);
  const [replayItems, setReplayItems] = React.useState<Replay[]>([]);

  const fetchResultRelatedData = async () => {
    try {
      const [matchesRes, replayRes] = await Promise.all([
        apiGetAllMatches(),
        apiGetAllReplays(),
      ]);

      const allMatch = matchesRes.data || [];
      const allReplay = replayRes.data || [];

      // Log API response for debugging
      console.log("API Matches Response:", allMatch);

      // Transform API data to match the Match type
      const transformedMatches: Match[] = allMatch.map((item: any) => {
        const startTime = new Date(item.startTime);
        return {
          _id: item._id || `m_${Date.now()}`,
          title: `${item.homeTeam?.name} vs ${item.awayTeam?.name}`,
          slug: item.slug || `${item._id || Date.now()}`,
          homeTeam: {
            _id: item.homeTeam?._id,
            name: item.homeTeam?.name || "Unknown",
            logo:
              item.homeTeam?.logo ||
              "https://via.placeholder.com/32/CCCCCC/000000?text=UK",
          },
          awayTeam: {
            _id: item.awayTeam?._id,
            name: item.awayTeam?.name || "Unknown",
            logo:
              item.awayTeam?.logo ||
              "https://via.placeholder.com/32/CCCCCC/000000?text=UK",
          },
          league: {
            _id: item.league?._id,
            name: item.league?.name || "Unknown League",
            logo: item.league?.logo,
          },
          sport: {
            _id: item.sport?._id,
            name: item.sport?.name || "Football",
            slug: item.sport?.slug || "football",
            icon: item.sport?.icon,
          },
          startTime: startTime,
          status: item.status as MatchStatusType,
          scores: {
            homeScore: item.scores?.homeScore,
            awayScore: item.scores?.awayScore,
          },
          streamLinks: item.streamLinks || [],
          isHot: item.isHot || false,
          mainCommentator:
            item.mainCommentator ||
            item.streamLinks?.[0]?.commentator ||
            "Người Dùng",
          mainCommentatorImage:
            item.mainCommentatorImage ||
            item.streamLinks?.[0]?.commentatorImage ||
            "https://via.placeholder.com/24/4A5568/E2E8F0?text=U",
          secondaryCommentator: item.secondaryCommentator,
          secondaryCommentatorImage: item.secondaryCommentatorImage,
        };
      });

      // Filter for finished matches only
      const filteredMatches = transformedMatches.filter((match) => {
        const matchDate = new Date(match.startTime);
        return (
          !isNaN(matchDate.getTime()) &&
          match.status === MatchStatusType.FINISHED &&
          matchDate <= today
        );
      });

      // If no matches for today, include mock data with today's match
      const hasTodayMatch = filteredMatches.some(
        (match) =>
          new Date(match.startTime).toDateString() === today.toDateString()
      );
      setMatchData(hasTodayMatch && filteredMatches);
      setReplayItems(allReplay);
    } catch (error) {
      console.error("Error fetching result data:", error);
      setMatchData(mockPastMatches); // Fallback to mock data with today's match
      setReplayItems([]);
    }
  };

  React.useEffect(() => {
    fetchResultRelatedData();
  }, []);

  // Use mock data if no API data is available
  const { dateTabs, scheduleData } = useScheduleDataForResults(
    matchData.length ? matchData : mockPastMatches
  );

  // Set initialDateId to "Hôm Nay" if it exists, otherwise default to today
  const initialDateId =
    dateTabs.find((tab) => tab.isToday)?.id || formatDate(today);

  return (
    <ResultsPage
      availableDates={dateTabs.length ? dateTabs : mockDateTabsForResults}
      initialSelectedDateId={initialDateId}
      resultsData={scheduleData || mockResultsData}
      replayItems={replayItems.length ? replayItems : []}
    />
  );
};

export default Result;
