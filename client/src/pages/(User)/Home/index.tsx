import belt_bottom_top from "@/assets/user/1330t190.gif";
import * as React from "react";
import { DataProvider, useData } from "@/context/DataContext";
import { MatchStatusType } from "@/types/match.types";
import { Suspense } from "react";
import { adjustToVietnamTime, formatDateFull } from "@/lib/helper";
import { apiGetAllSports } from "@/services/sport.services";
import { Sport } from "@/types/sport.types";
import { EventsIcon } from "@/components/layout/Icon";

const HeroSection = React.lazy(() => import("@/components/layout/HeroSection"));
const SportSection = React.lazy(
  () => import("@/components/layout/SportSection")
);
const ReplaySection = React.lazy(
  () => import("@/components/layout/ReplaySection")
);

// Icon mapping for each sport slug
const sportIconMap: Record<string, React.ReactNode> = {
  esports: "🎮",
  pool: "🎱",
  volleyball: "🏐",
  tennis: "🎾",
  basketball: "🏀",
  race: "🏎️",
  wwe: "🤼",
  football: "⚽",
  badminton: "🏸",
};

const AppContent: React.FC = () => {
  const { matchData, replayData, loading } = useData();
  const [sports, setSports] = React.useState<Sport[]>([]);
  const today = new Date();
  const vietnamToday = adjustToVietnamTime(today);

  // Fetch sports data
  React.useEffect(() => {
    const fetchSports = async () => {
      try {
        const res = await apiGetAllSports();
        setSports(res.data);
      } catch (error) {
        console.error("Error fetching sports:", error);
      }
    };
    fetchSports();
  }, []);

  // Filter matches by sport slug
  const filterMatchesBySport = React.useCallback(
    (slug: string) => {
      return matchData.filter((match) => {
        if (!match?.startTime) return false;
        const matchDate = new Date(match.startTime);
        const matchDay = formatDateFull(matchDate);
        const todayDay = formatDateFull(vietnamToday);
        return (
          match.sport.slug === slug &&
          match?.status !== MatchStatusType.FINISHED &&
          match?.status !== MatchStatusType.CANCELLED &&
          matchDay === todayDay
        );
      });
    },
    [matchData, vietnamToday]
  );

  // Compute matches for each sport
  const sportMatches = React.useMemo(() => {
    return sports.reduce(
      (acc, sport) => ({
        ...acc,
        [sport.slug]: filterMatchesBySport(sport.slug),
      }),
      {} as Record<string, typeof matchData>
    );
  }, [sports, filterMatchesBySport]);

  // Spotlight matches (unchanged)
  const spotlightMatches = React.useMemo(() => {
    return matchData.filter((match) => {
      if (!match?.startTime) return false;
      const matchDate = new Date(match.startTime);
      const matchDay = formatDateFull(matchDate);
      const todayDay = formatDateFull(vietnamToday);
      return (
        match?.isHot &&
        match?.status !== MatchStatusType.FINISHED &&
        match?.status !== MatchStatusType.CANCELLED &&
        matchDay === todayDay
      );
    });
  }, [matchData, vietnamToday]);

  // Replay filter (unchanged)
  const replayFilter = React.useMemo(() => {
    return replayData?.filter((match) => match?.isShown);
  }, [replayData]);

  if (loading || !sports.length) return <div>Loading...</div>;

  return (
    <Suspense fallback={<div>Đang tải các thành phần...</div>}>
      <HeroSection />
      <main className="lg:max-w-[1024px] xl:max-w-[1200px] 2xl:max-w-[1440px] lg:translate-x-0 xl:translate-x-[calc((100vw-1200px)/2)] 2xl:translate-x-[calc((100vw-1440px)/12)] 3xl:translate-x-[calc((100vw-1440px)/2)]">
        <SportSection
          title="TÂM ĐIỂM THỂ THAO"
          icon={sportIconMap["events"] || <EventsIcon className="w-6 h-6" />}
          matches={spotlightMatches}
          isSpotlight
        />
        <div className="px-1 sm:px-4 md:px-6">
          <img
            src={belt_bottom_top}
            alt="Ad Banner"
            className="object-cover md:w-full"
          />
        </div>
        {sports.map((sport) => (
          <SportSection
            key={sport._id}
            title={sport.name}
            icon={sportIconMap[sport.slug] || sport.icon || null}
            matches={sportMatches[sport.slug] || []}
            viewAllUrl="#"
          />
        ))}
        <ReplaySection
          title="XEM LẠI CÁC TRẬN ĐẤU"
          replays={replayFilter}
          viewAllUrl="#"
        />
      </main>
    </Suspense>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
};

export default App;
