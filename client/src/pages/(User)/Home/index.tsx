import belt_bottom_top from "@/assets/user/1330t190.gif";
import * as React from "react";
import { DataProvider, useData } from "@/context/DataContext";
import { MatchStatusType } from "@/types/match.types";
import { Suspense } from "react";
import { adjustToVietnamTime, formatDate } from "@/lib/helper";
import { EventsIcon } from "@/components/layout/Icon";
import { Loader } from "@/components/layout/Loader";

const HeroSection = React.lazy(() => import("@/components/layout/HeroSection"));
const SportSection = React.lazy(
  () => import("@/components/layout/SportSection")
);
const ReplaySection = React.lazy(
  () => import("@/components/layout/ReplaySection")
);

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
  const { matchData, replayData, sportData, loading, error } = useData();
  const today = React.useMemo(() => new Date(), []);
  const vietnamToday = React.useMemo(() => adjustToVietnamTime(today), [today]);

  const filterMatchesBySport = React.useCallback(
    (slug: string) => {
      return (matchData || []).filter((match) => {
        if (!match?.startTime) return false;
        const matchDate = adjustToVietnamTime(new Date(match.startTime));
        const matchDay = formatDate(matchDate);
        const todayDay = formatDate(vietnamToday);
        return (
          match?.sport?.slug === slug &&
          match?.status !== MatchStatusType.FINISHED &&
          match?.status !== MatchStatusType.CANCELLED &&
          matchDay === todayDay
        );
      });
    },
    [matchData, vietnamToday]
  );

  const sportMatches = React.useMemo(() => {
    return (sportData || []).reduce(
      (acc, sport) => ({
        ...acc,
        [sport.slug ?? ""]: filterMatchesBySport(sport.slug ?? ""),
      }),
      {} as Record<string, typeof matchData>
    );
  }, [sportData, filterMatchesBySport]);

  const spotlightMatches = React.useMemo(() => {
    return (matchData || []).filter((match) => {
      if (!match?.startTime) return false;
      const matchDate = adjustToVietnamTime(new Date(match.startTime));
      const matchDay = formatDate(matchDate);
      const todayDay = formatDate(vietnamToday);
      return (
        match?.isHot &&
        match?.status !== MatchStatusType.FINISHED &&
        match?.status !== MatchStatusType.CANCELLED &&
        matchDay === todayDay
      );
    });
  }, [matchData, vietnamToday]);

  const replayFilter = React.useMemo(() => {
    return (replayData || []).filter((match) => match?.isShown);
  }, [replayData]);

  if (loading || !sportData?.length) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Suspense fallback={<Loader />}>
      <HeroSection />
      <div className="hidden md:flex flex-col items-center justify-center gap-2 py-4 overflow-x-auto">
        <span className="text-center text-white text-sm md:text-lg md:font-semibold">
          HOIQUANTV xem trực tiếp eSports, bóng đá, bóng rổ, bóng chuyền, tennis
          online nhanh nhất - Hội Quán TV
        </span>
        <span className="text-center text-white text-sm md:text-sm">
          HoiQuanTV là kênh cập nhật link xem trực tiếp eSports, bóng đá, bóng
          chuyền, bóng rổ và các môn thể thao khác cho Fan hâm mộ Việt Nam và
          Quốc tế qua kết nối Internet. Xem thể thao trực tuyến với trên
          HoiQuanTV
        </span>
      </div>
      <div className="flex md:hidden items-center gap-2 py-4 overflow-x-auto scrollable-x w-full">
        <span className="text-center text-white text-sm font-semibold flex-shrink-0">
          HOIQUANTV xem trực tiếp eSports, bóng đá, bóng rổ, bóng chuyền, tennis
          online nhanh nhất - Hội Quán TV. HoiQuanTV là kênh cập nhật link xem
          trực tiếp bóng đá, bóng chuyền, bóng rổ và các môn thể thao khác cho
          Fan hâm mộ Việt Nam và Quốc tế qua kết nối Internet. Xem thể thao trực
          tuyến với trên HoiQuanTV
        </span>
      </div>
      <main className="w-full mx-auto max-w-[640px] sm:max-w-[768px] md:max-w-[960px] lg:max-w-[1024px] xl:max-w-[1200px] 2xl:max-w-[1440px] 3xl:max-w-[1440px]">
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
        {sportData.map((sport) => (
          <SportSection
            key={sport._id}
            title={sport.name ?? ""}
            icon={sportIconMap[sport.slug ?? ""] || sport.icon || null}
            matches={sportMatches[sport.slug ?? ""] || []}
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
