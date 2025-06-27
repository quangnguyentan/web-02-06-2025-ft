import SchedulePage from "@/components/layout/SchedulePage";
import { useScheduleData, formatDate } from "@/data/mockScheduleData";
import { useData } from "@/context/DataContext";
import * as React from "react";
import { useParams } from "react-router-dom";
import { Loader } from "@/components/layout/Loader";

const today = new Date();

const Schedule: React.FC = () => {
  const { matchData, replayData, loading, error, initialLoadComplete } =
    useData();
  const { slug } = useParams();

  const { scheduleData: mockScheduleData } = useScheduleData([]);
  const allMockMatches = React.useMemo(
    () =>
      Object.values(mockScheduleData)
        .flat()
        .flatMap((league: any) => league.matches),
    [mockScheduleData]
  );

  const currentMatch = React.useMemo(
    () =>
      (error || !matchData?.length ? allMockMatches : matchData).filter(
        (m) => m.sport?.slug === slug
      ),
    [matchData, error, allMockMatches, slug]
  );

  const replaySuggestions = React.useMemo(
    () =>
      error || !replayData?.length
        ? []
        : replayData?.filter((r) => r.sport?.slug === slug),
    [replayData, error, slug]
  );

  const { dateTabs, scheduleData } = useScheduleData(currentMatch);
  const initialDateId = formatDate(today);

  if (
    loading &&
    !initialLoadComplete &&
    !matchData?.length &&
    !replayData?.length
  )
    return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

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
