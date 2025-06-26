import SportSection from "@/components/layout/SportSection";
import belt_bottom_top from "@/assets/user/1330t190.gif";
import { FootballIcon } from "@/components/layout/Icon";
import * as React from "react";
import SchedulePage from "@/components/layout/SchedulePage";
import { useScheduleData, formatDate } from "@/data/mockScheduleData";
import { DataProvider, useData } from "@/context/DataContext";
import { useParams } from "react-router-dom";
import { Match, MatchStatusType } from "@/types/match.types";
import { adjustToVietnamTime } from "@/lib/helper";
import { Loader } from "@/components/layout/Loader";

const AppContent: React.FC = () => {
  const { matchData, replayData, loading, error } = useData();
  const { slug } = useParams();
  const today = React.useMemo(() => new Date(), []);
  const vietnamToday = React.useMemo(() => adjustToVietnamTime(today), [today]);

  const currentMatch = React.useMemo(() => {
    return (matchData || []).filter((m) => {
      if (!m?.startTime) return false;
      const matchDate = adjustToVietnamTime(new Date(m.startTime));
      const matchDay = formatDate(matchDate);
      const todayDay = formatDate(vietnamToday);
      return (
        m.sport?.slug === slug &&
        m?.status !== MatchStatusType.FINISHED &&
        m?.status !== MatchStatusType.CANCELLED &&
        matchDay === todayDay
      );
    });
  }, [matchData, slug, vietnamToday]);

  const replaySuggestions = React.useMemo(
    () => (replayData || []).filter((r) => r.sport?.slug === slug),
    [replayData, slug]
  );

  const { dateTabs, scheduleData } = useScheduleData(currentMatch);
  const initialDateId = formatDate(today);

  if (loading && !matchData?.length && !replayData?.length) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <main className="w-full mx-auto max-w-[640px] sm:max-w-[768px] md:max-w-[960px] lg:max-w-[1024px] xl:max-w-[1200px] 2xl:max-w-[1440px] 3xl:max-w-[1440px]">
      <div>
        <SportSection
          title={`TÂM ĐIỂM ${
            currentMatch[0]?.sport?.name?.toUpperCase() || "THỂ THAO"
          }`}
          icon={<FootballIcon className="w-6 h-6" />}
          matches={currentMatch}
          isSpotlight
        />
        <div className="px-1 sm:px-4 md:px-6 pt-2 pb-4">
          <img
            src={belt_bottom_top}
            alt="Ad Banner"
            className="object-cover md:w-full"
          />
        </div>
      </div>
      <SchedulePage
        isHideBreadcrumbs
        availableDates={dateTabs}
        initialSelectedDateId={initialDateId}
        scheduleData={scheduleData}
        replayItems={replaySuggestions}
      />
    </main>
  );
};

const SportProvider: React.FC = () => {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
};

export default SportProvider;
