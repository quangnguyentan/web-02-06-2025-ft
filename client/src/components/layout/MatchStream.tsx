import VerticalAdBanner from "@/components/layout/VerticalAdBanner";
import VideoPlayer from "@/components/layout/VideoPlayer";
import MatchInfoBar from "@/components/layout/MatchInfoBar";
import ChatPanel from "@/components/layout/ChatPanel";
import ReplaySuggestionsPanel from "@/components/layout/ReplaySuggestionsPanel";
import SportSection from "@/components/layout/SportSection";
import belt_bottom_top from "@/assets/user/1330t190.gif";
import { Match, Replay } from "@/types/index.types";
import { HomeIconSolid, ChevronRightIcon } from "@/components/layout/Icon"; // Assuming Match type is defined
import * as React from "react";

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
      {match.category || "Thể thao"}
    </a>
    <ChevronRightIcon className="w-3 h-3 text-gray-500" />
    <span className="text-gray-200 truncate max-w-[200px] sm:max-w-xs">
      {`${match.teamA.name} vs ${match.teamB.name}`}
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
      <div className="container mx-auto max-w-screen-2xl px-2 sm:px-4 py-3 relative">
        {/* Side Ads */}
        <VerticalAdBanner
          position="left"
          imageUrl="https://via.placeholder.com/160x600/0A4A8F/FFFFFF?text=LEFT+AD+-+MAN+CITY"
        />
        <VerticalAdBanner
          position="right"
          imageUrl="https://via.placeholder.com/160x600/0A4A8F/FFFFFF?text=RIGHT+AD+-+PARTNER"
        />

        {/* Main Content Area (centered between potential side ads) */}
        <main className="lg:mx-44 xl:mx-32">
          {/* Margin to avoid overlap with side ads */}
          <Breadcrumbs match={match} />
          <div className="md:hidden">
            <MatchInfoBar match={match} />
          </div>
          <div className="flex flex-col lg:flex-row md:gap-4 sm:gap-0">
            {/* Left Column: Video + Match Info + Related */}
            <div className="lg:w-2/3 flex-shrink-0">
              <VideoPlayer
                videoUrl="https://stream-akamai.castr.com/5b9352dbda7b8c769937e459/live_2361c920455111ea85db6911fe397b9e/index.fmp4.m3u8"
                videoTitle={`${match.teamA.name} vs ${match.teamB.name}`}
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
    </div>
  );
};

export default MatchStreamPage;
