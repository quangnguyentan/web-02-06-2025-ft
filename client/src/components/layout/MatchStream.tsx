import VideoPlayer from "@/components/layout/VideoPlayer";
import MatchInfoBar from "@/components/layout/MatchInfoBar";
import ChatPanel from "@/components/layout/ChatPanel";
import ReplaySuggestionsPanel from "@/components/layout/ReplaySuggestionsPanel";
import SportSection from "@/components/layout/SportSection";
import { HomeIconSolid, ChevronRightIcon } from "@/components/layout/Icon";
import * as React from "react";
import { Match } from "@/types/match.types";
import { Replay } from "@/types/replay.types";
import { useSelectedPageContext } from "@/hooks/use-context";
import { useNavigate } from "react-router-dom";
import wait_football from "@/assets/user/wait_football.webp";
import { useMediaQuery, useTheme } from "@mui/material";
import { useData } from "@/context/DataContext";
import { Banner } from "@/types/banner.types";

interface MatchStreamPageProps {
  match: Match;
  relatedMatches: Match[];
  replaySuggestions: Replay[];
  autoPlay?: boolean;
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
  autoPlay = false,
}) => {
  const { bannerData } = useData();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const filterBanners = (
    position: Banner["position"],
    displayPage: Banner["displayPage"]
  ): Banner | undefined => {
    return bannerData
      ?.filter(
        (banner) =>
          banner.position === position &&
          banner.displayPage === displayPage &&
          banner.isActive
      )
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))[0];
  };
  return (
    <div className="flex flex-col min-h-screen w-full">
      <main
        className="w-full mx-auto 
        max-w-[640px] sm:max-w-[768px] md:max-w-[960px] 
        lg:max-w-[1024px] 
        xl:max-w-[1200px] 
        2xl:max-w-[1440px] 
        3xl:max-w-[1440px]
    "
      >
        <Breadcrumbs match={match} />
        <div className="my-3">
          <img
            src={filterBanners("TOP", "LIVE_PAGE")?.imageUrl}
            alt="Horizontal Ad Banner"
            className="w-full rounded-md shadow"
          />
        </div>
        <div
          style={{
            backgroundImage: `url("https://b.thapcam73.life/images/bg-topz-min.jpg")`,
            backgroundSize: "cover",
          }}
          className="w-full text-white py-2 md:py-6 text-xs md:text-base"
        >
          <div className="flex flex-col justify-center items-center w-full">
            <div className="flex items-center justify-center gap-4 md:gap-8">
              <div className="flex items-center gap-1 md:gap-3 flex-col md:flex-row">
                <span className="font-medium text-[9px] md:text-base line-clamp-1 hidden md:block">
                  {match?.homeTeam?.name}
                </span>
                {match?.homeTeam?.name?.startsWith("Việt Nam") ? (
                  <img
                    className="w-10 md:w-16 h-8 md:h-12"
                    src={match?.homeTeam?.logo}
                    alt={match?.homeTeam?.name}
                  />
                ) : (
                  <img
                    className="w-8 md:w-16 h-8 md:h-16"
                    src={match?.homeTeam?.logo}
                    alt={match?.homeTeam?.name}
                  />
                )}
                <span className="font-medium text-[9px] md:text-base line-clamp-1 md:hidden">
                  {match?.homeTeam?.name}
                </span>
              </div>
              <div className="flex flex-col gap-0 md:gap-2 items-center justify-center">
                <span className="pb-2 md:pb-4 text-[9px] md:text-base line-clamp-1">
                  {match?.title}
                </span>
                <span className="font-bold text-[11px] md:text-sm text-red-500">
                  {match?.status === "LIVE"
                    ? "ĐANG DIỄN RA"
                    : match?.status === "FINISHED"
                    ? "KẾT THÚC"
                    : match?.status === "UPCOMING"
                    ? "SẮP DIỄN RA"
                    : match?.status === "CANCELLED"
                    ? "ĐÃ HỦY"
                    : match?.status === "POSTPONED"
                    ? "DỜI TRẬN"
                    : ""}
                </span>
                <span className="font-bold text-base md:text-xl">
                  {match?.scores?.homeScore} - {match?.scores?.awayScore}
                </span>

                <span className="text-xs md:text-sm font-medium">
                  {new Date(match?.startTime ?? "").toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1 md:gap-3 md:flex-row flex-col">
                {match?.awayTeam?.name?.startsWith("Việt Nam") ? (
                  <img
                    className="w-10 md:w-16 h-8 md:h-12"
                    src={match?.awayTeam?.logo}
                    alt={match?.awayTeam?.name}
                  />
                ) : (
                  <img
                    className="w-8 md:w-16 h-8 md:h-16"
                    src={match?.awayTeam?.logo}
                    alt={match?.awayTeam?.name}
                  />
                )}
                <span className="font-medium text-[9px] md:text-base line-clamp-1">
                  {match?.awayTeam?.name}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="md:hidden">
          <MatchInfoBar match={match} />
        </div> */}
        <div className="flex flex-col lg:flex-row pt-4">
          {/* Left Column: Video + Match Info + Related */}
          <div
            className={
              isMobile
                ? "sticky top-0 z-[1000] w-full"
                : "lg:w-2/3 flex-shrink-0 pr-2 "
            }
          >
            {/* Sticky VideoPlayer wrapper for mobile only */}
            <VideoPlayer
              videoUrl={`${match?.streamLinks?.[0]?.url}`}
              videoTitle={`${match?.homeTeam?.name} vs ${match?.awayTeam?.name}`}
              posterUrl={
                match?.streamLinks?.[0]?.image
                  ? match?.streamLinks?.[0]?.image
                  : wait_football
              }
              autoPlay={autoPlay}
              match={match}
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
            <div className="pb-4">
              <img
                src={filterBanners("FOOTER", "LIVE_PAGE")?.imageUrl}
                alt="Small Ad Banner"
                className="w-full rounded-md shadow"
              />
            </div>
            <ReplaySuggestionsPanel replays={replaySuggestions} />
          </div>
        </div>
        <div className="pb-8 pt-4">
          <img
            src={filterBanners("BOTTOM", "LIVE_PAGE")?.imageUrl}
            alt="Horizontal Ad Banner"
            className="w-full rounded-md shadow "
          />
        </div>
      </main>
    </div>
  );
};

export default MatchStreamPage;
