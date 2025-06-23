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
import { useSelectedPageContext } from "@/hooks/use-context";
import { useNavigate } from "react-router-dom";
import wait_football from "@/assets/user/wait_football.webp";
interface MatchStreamPageProps {
  match: Match;
  relatedMatches: Match[];
  replaySuggestions: Replay[];
}

const Breadcrumbs: React.FC<{ match: Match }> = ({ match }) => {
  const navigate = useNavigate();

  const { setSelectedSportsNavbarPage, setSelectedPage } =
    useSelectedPageContext();
  return (
    <nav
      className="text-xs text-gray-400 mb-2 px-1 flex items-center space-x-1.5 pt-4 pb-2"
      aria-label="Breadcrumb"
    >
      <div
        onClick={() => {
          localStorage.removeItem("selectedSportsNavbarPage");
          setSelectedSportsNavbarPage("");
          localStorage.setItem("selectedPage", "TRANG CHỦ");
          setSelectedPage("TRANG CHỦ");
          navigate("/"); // Navigate to homepage
        }}
        className="hover:text-yellow-400 flex items-center text-xs text-white hover:text-xs cursor-pointer"
      >
        <HomeIconSolid className="w-3.5 h-3.5 mr-1" /> Trang chủ
      </div>
      <ChevronRightIcon className="w-3 h-3 text-gray-500 " />
      <div
        onClick={() => {
          navigate(`/${match?.sport?.slug}`);
          localStorage.setItem(
            "selectedSportsNavbarPage",
            match?.sport?.name ?? "eSports"
          );
          setSelectedSportsNavbarPage(match?.sport?.name ?? "eSports");
        }}
        className="hover:text-yellow-400 text-xs text-white hover:text-xs cursor-pointer"
      >
        {match?.sport?.name || "Thể thao"}
      </div>
      <ChevronRightIcon className="w-3 h-3 text-gray-500" />
      <span className="truncate max-w-[200px] sm:max-w-xs text-current-color">
        {match?.title}
      </span>
    </nav>
  );
};
const MatchStreamPage: React.FC<MatchStreamPageProps> = ({
  match,
  relatedMatches,
  replaySuggestions,
}) => {
  console.log("match", match);
  return (
    <div className="flex flex-col min-h-screen w-full">
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
        <div className="flex flex-col lg:flex-row ">
          {/* Left Column: Video + Match Info + Related */}
          <div className="lg:w-2/3 flex-shrink-0 pr-2 ">
            <VideoPlayer
              videoUrl={`${match?.streamLinks?.[0]?.url}`}
              videoTitle={`${match?.homeTeam?.name} vs ${match?.awayTeam?.name}`}
              posterUrl={
                match?.streamLinks?.[0]?.image
                  ? match?.streamLinks?.[0]?.image
                  : wait_football
              } // Placeholder poster
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
