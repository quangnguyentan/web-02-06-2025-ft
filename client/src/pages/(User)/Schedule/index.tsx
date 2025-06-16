import SchedulePage from "@/components/layout/SchedulePage";
import { useScheduleData, formatDate } from "@/data/mockScheduleData";
import { apiGetAllMatches } from "@/services/match.services";
import { apiGetAllReplays } from "@/services/replay.services";
import { Match, MatchStatusType } from "@/types/match.types";
import { Replay } from "@/types/replay.types";
import * as React from "react";

// Set today to current system time (assuming UTC+07:00 Vietnam time)
const today = new Date(); // System time, adjusted to local

const Schedule: React.FC = () => {
  const [matchData, setMatchData] = React.useState<Match[]>([]);
  const [replayItems, setReplayItems] = React.useState<Replay[]>([]);

  // Set initialDateId to today if no valid match, otherwise first on or after today
  const initialDateId = matchData.length
    ? formatDate(
        new Date(
          matchData.find((m) => {
            const matchDate = new Date(m.startTime);
            return !isNaN(matchDate.getTime()) && matchDate >= today;
          })?.startTime || today
        )
      )
    : formatDate(today);

  const fetchMatchRelatedData = async () => {
    const [matchesRes, replayRes] = await Promise.all([
      apiGetAllMatches(),
      apiGetAllReplays(),
    ]);

    const allMatch = matchesRes.data || [];
    const allReplay = replayRes.data || [];

    // Transform API data to match the Match type
    const transformedMatches: Match[] = allMatch.map((item: any) => {
      const startTime = new Date(item.startTime);
      return {
        _id: item._id || `m_${Date.now()}`,
        title: `${item.homeTeam.name} vs ${item.awayTeam.name}`,
        slug: item.slug || `${item._id || Date.now()}`,
        homeTeam: {
          _id: item.homeTeam._id,
          name: item.homeTeam.name,
          logo: item.homeTeam.logo,
        },
        awayTeam: {
          _id: item.awayTeam._id,
          name: item.awayTeam.name,
          logo: item.awayTeam.logo,
        },
        league: {
          _id: item.league._id,
          name: item.league.name,
          logo: item.league.logo,
        },
        sport: {
          _id: item.sport._id,
          name: item.sport.name,
          slug: item.sport.slug,
          icon: item.sport.icon,
        },
        startTime: startTime,
        status: item.status as MatchStatusType,
        scores: {
          homeScore: item.scores.homeScore,
          awayScore: item.scores.awayScore,
        },
        streamLinks: item.streamLinks || [],
        isHot: item.isHot || false,
        mainCommentator:
          item.mainCommentator ||
          item.streamLinks[0]?.commentator ||
          "Người Dùng",
        mainCommentatorImage:
          item.mainCommentatorImage ||
          item.streamLinks[0]?.commentatorImage ||
          "https://via.placeholder.com/24/4A5568/E2E8F0?text=U",
        secondaryCommentator: item.secondaryCommentator,
        secondaryCommentatorImage: item.secondaryCommentatorImage,
      };
    });

    // Filter out finished matches and past dates with validation
    const filteredMatches = transformedMatches.filter((match) => {
      const matchDate = new Date(match.startTime);
      return (
        !isNaN(matchDate.getTime()) &&
        match.status !== MatchStatusType.FINISHED &&
        matchDate >= today
      );
    });

    setMatchData(filteredMatches);
    setReplayItems(allReplay);
  };

  React.useEffect(() => {
    fetchMatchRelatedData();
  }, []);

  const { dateTabs, scheduleData } = useScheduleData(matchData);

  return (
    <SchedulePage
      availableDates={dateTabs}
      initialSelectedDateId={initialDateId}
      scheduleData={scheduleData}
      replayItems={replayItems}
    />
  );
};

export default Schedule;
