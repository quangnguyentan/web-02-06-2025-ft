import HeroSection from "@/components/layout/HeroSection";
import SportSection from "@/components/layout/SportSection";
import ReplaySection from "@/components/layout/ReplaySection";
import belt_bottom_top from "@/assets/user/1330t190.gif";

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
        <img
          src={belt_bottom_top}
          alt="Ad Banner"
          className="object-cover md:w-full "
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
        replays={replayItems}
        viewAllUrl="#"
      />
    </main>
  );
};

export default App;
