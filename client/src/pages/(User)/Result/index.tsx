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

const today = new Date();

const Result: React.FC = () => {
  const { matchData, replayData, fetchData, loading } = useData();
  const [localMatchData, setLocalMatchData] = React.useState<Match[]>([]);
  const [replaySuggestions, setReplaySuggestions] = React.useState<Replay[]>(
    []
  );
  const { slug } = useParams();

  React.useEffect(() => {
    const loadMatchData = async () => {
      if ((!matchData.length && !loading) || (!replayData.length && !loading)) {
        await fetchData(); // Chỉ gọi nếu chưa có dữ liệu
      }
      const match = matchData?.filter((m) => m.sport?.slug === slug) || [];
      const replay = replayData?.filter((r) => r.sport?.slug === slug) || [];
      const filteredMatches = match?.filter((match) => {
        const matchDate = new Date(match.startTime);
        return (
          !isNaN(matchDate.getTime()) &&
          (match.status === MatchStatusType.FINISHED ||
            match.status === MatchStatusType.LIVE)
        );
      });
      setLocalMatchData(filteredMatches);
      setReplaySuggestions(replay);
    };
    loadMatchData();
  }, [slug, matchData, replayData, fetchData, loading]);

  const { dateTabs, scheduleData } = useScheduleDataForResults(localMatchData);

  const initialDateId =
    dateTabs.find((tab) => tab.isToday)?.id ||
    dateTabs.find((tab) => tab.id !== "live")?.id ||
    formatDate(today);

  if (loading) return <div>Loading...</div>;

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
