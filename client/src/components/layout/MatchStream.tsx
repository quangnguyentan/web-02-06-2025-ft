import VideoPlayer from "@/components/layout/VideoPlayer";
import MatchInfoBar from "@/components/layout/MatchInfoBar";
import ChatPanel from "@/components/layout/ChatPanel";
import ReplaySuggestionsPanel from "@/components/layout/ReplaySuggestionsPanel";
import SportSection from "@/components/layout/SportSection";
import belt_bottom_top from "@/assets/user/1330t190.gif";
import { HomeIconSolid, ChevronRightIcon } from "@/components/layout/Icon";
import * as React from "react";
import { Match } from "@/types/match.types";
import { Replay } from "@/types/replay.types";

interface MatchStreamPageProps {
  match: Match;
  relatedMatches: Match[];
  replaySuggestions: Replay[];
}

const Breadcrumbs: React.FC<{ match: Match }> = ({ match }) => (
  <nav
    className="text-xs text-gray-400 mb-2 px-1 flex items-center space-x-1.5"
    aria-label="Breadcrumb"
  >
    <a href="#" className="hover:text-yellow-400 flex items-center">
      <HomeIconSolid className="w-3.5 h-3.5 mr-1" /> Trang chủ
    </a>
    <ChevronRightIcon className="w-3 h-3 text-gray-500" />
    <a href="#" className="hover:text-yellow-400">
      {match?.sport?.name || "Thể thao"}
    </a>
    <ChevronRightIcon className="w-3 h-3 text-gray-500" />
    <span className="truncate max-w-[200px] sm:max-w-xs text-orange-500">
      {match?.title}
    </span>
  </nav>
);

const MatchStreamPage: React.FC<MatchStreamPageProps> = ({
  match,
  relatedMatches,
  replaySuggestions,
}) => {
  return (
    <div className="flex flex-col min-h-screen  ">
      <main
        className="lg:max-w-[1024px]
    xl:max-w-[1200px]
    2xl:max-w-[1440px]
    lg:translate-x-0
    xl:translate-x-[calc((100vw-1200px)/2)]
    2xl:translate-x-[calc((100vw-1440px)/12)]
    3xl:translate-x-[calc((100vw-1440px)/2)]
    "
      >
        {/* Margin to avoid overlap with side ads */}
        <Breadcrumbs match={match} />
        <div className="md:hidden">
          <MatchInfoBar match={match} />
        </div>
        <div className="flex flex-col lg:flex-row">
          {/* Left Column: Video + Match Info + Related */}
          <div className="lg:w-2/3 flex-shrink-0 pr-2">
            <VideoPlayer
              videoUrl={`${match?.streamLinks?.[0]?.url}`}
              videoTitle={`${match?.homeTeam?.name} vs ${match?.awayTeam?.name}`}
              posterUrl="https://picsum.photos/seed/baseballgame/1280/720" // Placeholder poster
            />
            <div className="hidden md:block">
              <MatchInfoBar match={match} />
            </div>
            <div className="mt-1 hidden md:block">
              <SportSection
                title="CÁC TRẬN ĐẤU KHÁC"
                matches={relatedMatches}
              />
            </div>
          </div>

          {/* Right Column: Chat + Replays */}
          <div className="lg:w-1/3 flex-shrink-0">
            <ChatPanel />
            <div className="mt-1 md:hidden">
              <SportSection
                title="CÁC TRẬN ĐẤU KHÁC"
                matches={relatedMatches}
              />
            </div>
            <div className="my-3">
              <img
                src={belt_bottom_top}
                alt="Small Ad Banner"
                className="w-full rounded-md shadow"
              />
            </div>
            <ReplaySuggestionsPanel replays={replaySuggestions} />
          </div>
        </div>
        <div className="my-3">
          <img
            src={belt_bottom_top}
            alt="Horizontal Ad Banner"
            className="w-full rounded-md shadow"
          />
        </div>
      </main>
    </div>
  );
};

export default MatchStreamPage;
