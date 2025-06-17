import SchedulePage from "@/components/layout/SchedulePage";
import { useScheduleData, formatDate } from "@/data/mockScheduleData";
import { useData } from "@/context/DataContext";
import * as React from "react";
import { useParams } from "react-router-dom";
import { Replay } from "@/types/replay.types";
import { Match } from "@/types/match.types";

const today = new Date();

const Schedule: React.FC = () => {
  const { matchData, replayData, fetchData, loading } = useData();
  const [currentMatch, setCurrentMatch] = React.useState<Match[]>([]);
  const [replaySuggestions, setReplaySuggestions] = React.useState<Replay[]>(
    []
  );
  const { slug } = useParams();
  React.useEffect(() => {
    const loadMatchData = async () => {
      if (!matchData.length || !replayData.length) {
        await fetchData(); // Chỉ gọi nếu chưa có dữ liệu
      }
      const match = matchData?.filter((m) => m.sport?.slug === slug) || [];
      const replay = replayData?.filter((r) => r.sport?.slug === slug) || [];
      setCurrentMatch(match);
      setReplaySuggestions(replay);
    };
    loadMatchData();
  }, [slug, matchData, replayData, fetchData]);
  React.useEffect(() => {
    if (!matchData.length && !loading) {
      fetchData();
    }
  }, [matchData, fetchData, loading]);

  const { dateTabs, scheduleData } = useScheduleData(currentMatch);
  console.log("Schedule Data:", scheduleData); // Log dữ liệu schedule

  const initialDateId = formatDate(today);

  if (loading) return <div>Loading...</div>;

  return (
    <SchedulePage
      availableDates={dateTabs}
      initialSelectedDateId={initialDateId}
      scheduleData={scheduleData}
      replayItems={replaySuggestions}
    />
  );
};

export default Schedule;
