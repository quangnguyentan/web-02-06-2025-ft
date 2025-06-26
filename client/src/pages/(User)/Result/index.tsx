import ResultsPage from "@/components/layout/ResultPage";
import { useScheduleDataForResults, formatDate } from "@/data/mockResultsData";
import { useData } from "@/context/DataContext";
import * as React from "react";
import {
  mockDateTabsForResults,
  mockResultsData,
} from "@/data/mockResultsData";
import { Match, MatchStatusType } from "@/types/match.types";
import { useParams } from "react-router-dom";
import { Replay } from "@/types/replay.types";
import { Loader } from "@/components/layout/Loader";

const today = new Date();

const Result: React.FC = () => {
  const { matchData, replayData, fetchMatches, fetchReplays, loading, error } =
    useData();
  const { slug } = useParams();
  React.useEffect(() => {
    const loadData = async () => {
      if ((!matchData.length || !replayData.length) && !loading) {
        try {
          await Promise.all([fetchMatches(), fetchReplays()]);
        } catch (error) {
          console.error("Error loading data:", error);
        }
      }
    };
    loadData();
  }, [matchData, replayData, fetchMatches, fetchReplays, loading]);

  const mockReplayData: Replay[] = React.useMemo(() => [], []);

  const currentMatchResults = React.useMemo(() => {
    let matchesToFilter: Match[] = [];

    if (!matchData.length || error) {
      matchesToFilter = Array.isArray(mockResultsData)
        ? (mockResultsData as Match[])
        : [];
    } else {
      matchesToFilter = matchData;
    }

    return matchesToFilter.filter((m) => {
      const matchDate = new Date(m.startTime ?? "");
      return (
        m.sport?.slug === slug &&
        !isNaN(matchDate.getTime()) &&
        (m.status === MatchStatusType.FINISHED ||
          m.status === MatchStatusType.LIVE)
      );
    });
  }, [matchData, error, slug]);

  const replaySuggestions = React.useMemo(() => {
    if (!replayData.length || error) {
      return mockReplayData;
    } else {
      return replayData.filter((r) => r.sport?.slug === slug) || [];
    }
  }, [replayData, error, mockReplayData, slug]);

  const { dateTabs, scheduleData } =
    useScheduleDataForResults(currentMatchResults);

  const initialDateId = React.useMemo(() => {
    return (
      dateTabs.find((tab) => tab.isToday)?.id ||
      dateTabs.find((tab) => tab.id !== "live")?.id ||
      formatDate(today)
    );
  }, [dateTabs]);

  if (error) {
    return <Loader />;
  }

  if (loading && !matchData.length && !replayData.length) {
    return <Loader />;
  }

  return (
    <ResultsPage
      availableDates={dateTabs.length > 0 ? dateTabs : mockDateTabsForResults}
      initialSelectedDateId={initialDateId}
      resultsData={scheduleData || mockResultsData}
      replayItems={replaySuggestions}
      noMatchesMessage="Không có trận nào"
    />
  );
};

export default Result;
