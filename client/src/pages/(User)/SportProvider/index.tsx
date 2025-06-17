import SportSection from "@/components/layout/SportSection";
import belt_bottom_top from "@/assets/user/1330t190.gif";
import { FootballIcon } from "@/components/layout/Icon";
import * as React from "react";
import SchedulePage from "@/components/layout/SchedulePage";
import { useScheduleData, formatDate } from "@/data/mockScheduleData";
import { DataProvider, useData } from "@/context/DataContext";
import { useParams } from "react-router-dom";
import { Match } from "@/types/match.types";
import { Replay } from "@/types/replay.types";

const today = new Date();

const AppContent: React.FC = () => {
  const [currentMatch, setCurrentMatch] = React.useState<Match[]>([]);
  const [replaySuggestions, setReplaySuggestions] = React.useState<Replay[]>(
    []
  );
  const { slug } = useParams();
  const { matchData, replayData, fetchData, loading } = useData();
  React.useEffect(() => {
    const loadMatchData = async () => {
      if ((!matchData.length && !loading) || (!replayData.length && !loading)) {
        await fetchData(); // Chỉ gọi nếu chưa có dữ liệu
      }
      const match = matchData?.filter((m) => m.sport?.slug === slug) || [];
      const replay = replayData?.filter((r) => r.sport?.slug === slug) || [];
      setCurrentMatch(match);
      setReplaySuggestions(replay);
    };
    loadMatchData();
  }, [slug, matchData, replayData, fetchData, loading]);

  const { dateTabs, scheduleData } = useScheduleData(currentMatch);

  const initialDateId = formatDate(today);

  if (loading) return <div>Loading...</div>;

  return (
    <main className="lg:max-w-[1024px] xl:max-w-[1200px] 2xl:max-w-[1440px] ">
      <div className="lg:translate-x-0 xl:translate-x-[calc((100vw-1200px)/2)] 2xl:translate-x-[calc((100vw-1440px)/12)] 3xl:translate-x-[calc((100vw-1440px)/2)]">
        <SportSection
          isSportSection
          title="TÂM ĐIỂM BÓNG ĐÁ"
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
