import HeroSection from "@/components/layout/HeroSection";
import SportSection from "@/components/layout/SportSection";
import ReplaySection from "@/components/layout/ReplaySection";
import {
  FootballIcon,
  TennisIcon,
  BasketballIcon,
  EventsIcon,
} from "@/components/layout/Icon";
import * as React from "react";
import { apiGetAllMatches } from "@/services/match.services";
import { Match } from "@/types/match.types";
import { apiGetAllReplays } from "@/services/replay.services";
import { Replay } from "@/types/replay.types";
const App: React.FC = () => {
  const [matchData, setMatchData] = React.useState<Match[]>([]);
  const [replayItems, setReplayItems] = React.useState<Replay[]>([]);
  const spotlightMatches = React.useMemo(() => {
    return matchData.filter((match) => match?.isHot);
  }, [matchData]);
  const footballMatches = React.useMemo(() => {
    return matchData.filter((match) => match.sport.slug === "football");
  }, [matchData]);
  const tennisMatches = React.useMemo(() => {
    return matchData.filter((match) => match.sport.slug === "tennis");
  }, [matchData]);
  const basketballMatches = React.useMemo(() => {
    return matchData.filter((match) => match.sport.slug === "basketball");
  }, [matchData]);
  const fetchMatchRelatedData = async () => {
    const [matchesRes, replayRes] = await Promise.all([
      apiGetAllMatches(),
      apiGetAllReplays(),
    ]);

    const allMatch = matchesRes.data || [];
    const allReplay = replayRes.data || [];
    setMatchData(allMatch);
    setReplayItems(allReplay);
  };

  React.useEffect(() => {
    fetchMatchRelatedData();
  }, []);

  return (
    <main
      className=" lg:max-w-[1024px]
    xl:max-w-[1200px]
    2xl:max-w-[1440px]
    lg:translate-x-0
    xl:translate-x-[calc((100vw-1200px)/2)]
    2xl:translate-x-[calc((100vw-1440px)/12)]
    3xl:translate-x-[calc((100vw-1440px)/2)]
    "
    >
      <HeroSection />
      <SportSection
        title="TÂM ĐIỂM THỂ THAO"
        icon={<EventsIcon className="w-6 h-6" />}
        matches={spotlightMatches}
        isSpotlight
      />
      <div className="px-1 sm:px-4 md:px-6">
        <div className="bg-blue-600 text-white p-2 sm:p-3 my-3 sm:my-4 flex flex-col sm:flex-row sm:justify-between sm:items-center rounded-md gap-2 sm:gap-0">
          <img
            src="https://via.placeholder.com/200x50/FFFFFF/000000?text=ĐỐI+TÁC+CHÍNH+THỨC"
            alt="Partner Ad"
            className="h-8 sm:h-10 mx-auto sm:mx-0"
          />
          <span className="text-base sm:text-lg font-bold text-yellow-300 text-center sm:text-left">
            CLB MANCHESTER CITY TẠI CHÂU Á
          </span>
          <a
            href="#"
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1.5 px-3 sm:py-2 sm:px-4 rounded text-xs sm:text-sm mx-auto sm:mx-0"
          >
            ĐĂNG KÝ
          </a>
        </div>
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
        replays={replayItems}
        viewAllUrl="#"
      />
    </main>
  );
};

export default App;
