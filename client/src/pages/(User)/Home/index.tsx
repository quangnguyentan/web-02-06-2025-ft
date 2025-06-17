import belt_bottom_top from "@/assets/user/1330t190.gif";
import {
  FootballIcon,
  TennisIcon,
  BasketballIcon,
  EventsIcon,
} from "@/components/layout/Icon";
import * as React from "react";
import { DataProvider, useData } from "@/context/DataContext";
import { MatchStatusType } from "@/types/match.types";
import { Suspense } from "react";

const HeroSection = React.lazy(() => import("@/components/layout/HeroSection"));
const SportSection = React.lazy(
  () => import("@/components/layout/SportSection")
);
const ReplaySection = React.lazy(
  () => import("@/components/layout/ReplaySection")
);
const AppContent: React.FC = () => {
  const { matchData, replayData, loading } = useData();
  const today = new Date();
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const adjustToVietnamTime = (date: Date): Date => {
    const vietnamDate = new Date(date);
    vietnamDate.setHours(vietnamDate.getHours() + 7); // Điều chỉnh từ UTC sang UTC+07:00
    return vietnamDate;
  };

  const spotlightMatches = React.useMemo(() => {
    return matchData.filter((match) => {
      if (!match?.startTime) return false;
      const matchDate = adjustToVietnamTime(new Date(match.startTime));
      const matchDay = formatDate(matchDate);
      const todayDay = formatDate(today);
      return (
        match?.isHot &&
        match?.status !== MatchStatusType.FINISHED &&
        match?.status !== MatchStatusType.CANCELLED &&
        matchDay === todayDay
      );
    });
  }, [matchData]);

  const footballMatches = React.useMemo(() => {
    return matchData.filter((match) => {
      if (!match?.startTime) return false;
      const matchDate = adjustToVietnamTime(new Date(match.startTime));
      const matchDay = formatDate(matchDate);
      const todayDay = formatDate(today);
      return (
        match.sport.slug === "football" &&
        match?.status !== MatchStatusType.FINISHED &&
        match?.status !== MatchStatusType.CANCELLED &&
        matchDay === todayDay
      );
    });
  }, [matchData]);

  const tennisMatches = React.useMemo(() => {
    return matchData.filter((match) => {
      if (!match?.startTime) return false;
      const matchDate = adjustToVietnamTime(new Date(match.startTime));
      const matchDay = formatDate(matchDate);
      const todayDay = formatDate(today);
      return (
        match.sport.slug === "tennis" &&
        match?.status !== MatchStatusType.FINISHED &&
        match?.status !== MatchStatusType.CANCELLED &&
        matchDay === todayDay
      );
    });
  }, [matchData]);

  const basketballMatches = React.useMemo(() => {
    return matchData.filter((match) => {
      if (!match?.startTime) return false;
      const matchDate = adjustToVietnamTime(new Date(match.startTime));
      const matchDay = formatDate(matchDate);
      const todayDay = formatDate(today);
      return (
        match.sport.slug === "basketball" &&
        match?.status !== MatchStatusType.FINISHED &&
        match?.status !== MatchStatusType.CANCELLED &&
        matchDay === todayDay
      );
    });
  }, [matchData]);

  if (loading) return <div>Loading...</div>;
  return (
    <Suspense fallback={<div>Đang tải các thành phần...</div>}>
      <HeroSection />
      <main className="lg:max-w-[1024px] xl:max-w-[1200px] 2xl:max-w-[1440px] lg:translate-x-0 xl:translate-x-[calc((100vw-1200px)/2)] 2xl:translate-x-[calc((100vw-1440px)/12)] 3xl:translate-x-[calc((100vw-1440px)/2)]">
        <SportSection
          title="TÂM ĐIỂM THỂ THAO"
          icon={<EventsIcon className="w-6 h-6" />}
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
        <SportSection
          title="BÓNG ĐÁ"
          icon={<FootballIcon className="w-6 h-6" />}
          matches={footballMatches}
          viewAllUrl="#"
        />
        <SportSection
          title="TENNIS"
          icon={<TennisIcon className="w-6 h-6" />}
          matches={tennisMatches}
          viewAllUrl="#"
        />
        <SportSection
          title="BÓNG RỔ"
          icon={<BasketballIcon className="w-6 h-6" />}
          matches={basketballMatches}
          viewAllUrl="#"
        />
        <ReplaySection
          title="XEM LẠI CÁC TRẬN ĐẤU"
          replays={replayData}
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
