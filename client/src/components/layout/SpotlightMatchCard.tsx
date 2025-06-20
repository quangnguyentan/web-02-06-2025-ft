import { UserIcon, LiveIcon } from "./Icon";
import * as React from "react";
import { Match } from "@/types/match.types";
import { FootballIcon, TennisIcon, BasketballIcon } from "./Icon"; // Add sport-specific icons
import basketball from "@/assets/user/basketball-min.jpg";
import tennis from "@/assets/user/tennis-min.jpg";
import football from "@/assets/user/football-min1.jpg";
import volleyball from "@/assets/user/volleyball-min.jpg";
import boxing from "@/assets/user/boxing-min.jpg";
import race from "@/assets/user/race-min.jpg";
import esport from "@/assets/user/esport-min.jpg";
import badminton from "@/assets/user/badminton-min.png";

import { useNavigate } from "react-router-dom";
import { useSelectedPageContext } from "@/hooks/use-context";
const getSportIcon = (sportId: string | undefined) => {
  if (!sportId) return <FootballIcon className="w-6 h-6 text-yellow-400" />;
  switch (sportId) {
    case "basketball":
      return <BasketballIcon className="w-6 h-6 text-orange-400" />;
    case "tennis":
      return <TennisIcon className="w-6 h-6 text-green-400" />;
    default:
      return <FootballIcon className="w-6 h-6 text-yellow-400" />;
  }
};

const SpotlightMatchCard: React.FC<{ match: Match }> = ({ match }) => {
  const navigate = useNavigate();
  const { setSelectedSportsNavbarPage } = useSelectedPageContext();
  const isLive = match.status === "LIVE";
  const startTime = new Date(match.startTime || "").toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour12: false,
  });
  const targetUrl = `/truc-tiep/${match.slug}/${match?.sport?.slug}`;

  const imageSlug =
    match?.sport?.name === "Bóng đá"
      ? football
      : match?.sport?.name === "Bóng rổ"
      ? basketball
      : match?.sport?.name === "Tennis"
      ? tennis
      : match?.sport?.name === "Bóng chuyền"
      ? volleyball
      : match?.sport?.name === "Đua xe"
      ? race
      : match?.sport?.name === "Boxing"
      ? boxing
      : match?.sport?.name === "eSports"
      ? esport
      : match?.sport?.name === "Cầu lông"
      ? badminton
      : "";
  return (
    <div
      onClick={() => {
        navigate(targetUrl);
        setSelectedSportsNavbarPage(match?.sport?.name);
        localStorage.setItem("selectedSportsNavbarPage", match?.sport?.name);
      }}
      className="bg-slate-800 shadow-lg overflow-hidden flex flex-col rounded-xl h-full relative cursor-pointer"
      style={{
        backgroundImage: `url(${imageSlug})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "0 0 0 2px rgba(255, 164, 92, 0.6)",
      }}
    >
      {/* Overlay to ensure readability */}
      {/* <div className="absolute inset-0 bg-black/50"></div> */}
      {!["Bóng rổ", "Tennis", "Bóng chuyền"].includes(match?.sport?.name) && (
        <div
          className="absolute inset-0 bg-black bg-opacity-90"
          style={{ zIndex: 1 }} // Đảm bảo overlay nằm dưới nội dung
        ></div>
      )}

      {/* Header: League Name & Live Status */}
      {/* <div
        className={`p-2 flex justify-between items-center relative z-10 ${
          isLive ? "bg-red-700/80" : "bg-slate-700/50"
        }`}
      > */}
      <div
        className={`p-2 flex justify-between items-center relative z-10 ${
          isLive ? "bg-red-700/80" : ""
        }`}
      >
        <div className="flex items-center space-x-1.5 justify-center">
          {match.league?.logo ? (
            <img
              src={match.league.logo}
              alt={match.league.name}
              className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
            />
          ) : (
            getSportIcon(match?.sport?.slug)
          )}
          <span className="text-xs font-semibold text-white truncate">
            {match.league?.name || match.title}
          </span>
        </div>
        {isLive && (
          <div className="flex items-center space-x-1">
            <LiveIcon className="w-2 h-2 text-white" />
            <span className="text-xs text-white font-bold uppercase">LIVE</span>
          </div>
        )}
      </div>

      {/* Main Content: Teams & Score/Time */}
      <div className="p-2 sm:p-3 flex-grow flex flex-col items-center relative z-10">
        <div className="flex items-center justify-around w-full mb-2">
          {/* Team A */}
          <div className="flex flex-col items-center text-center">
            <img
              src={match.homeTeam?.logo || ""}
              alt={match.homeTeam?.name}
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain mb-1"
            />
            <span className="text-xs sm:text-sm text-white font-medium truncate">
              {match.homeTeam?.name}
            </span>
          </div>

          {/* Score or VS */}
          <div className="text-center">
            {match.status && match.scores ? (
              <div className="text-lg sm:text-xl font-bold text-white">
                {match.scores.homeScore} - {match.scores.awayScore}
              </div>
            ) : (
              <span className="text-gray-400 text-base sm:text-lg font-semibold">
                VS
              </span>
            )}
            <div className="text-xs sm:text-sm text-gray-400 mt-1">
              {startTime}
            </div>
          </div>

          {/* Team B */}
          <div className="flex flex-col items-center text-center">
            <img
              src={match.awayTeam?.logo || ""}
              alt={match.awayTeam?.name}
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain mb-1"
            />
            <span className="text-xs sm:text-sm text-white font-medium truncate">
              {match.awayTeam?.name}
            </span>
          </div>
        </div>
      </div>

      {/* Footer: Commentator & Buttons */}
      <div
        className="p-2 border-t border-slate-700/50 relative z-10"
        style={{
          boxShadow: "0 0 0 2px rgba(255, 164, 92, 0.6)",
        }}
      >
        {/* <div className="p-2 brelative z-10"> */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5 overflow-hidden">
            {match.streamLinks?.[0]?.commentatorImage ? (
              <img
                src={match.streamLinks[0].commentatorImage}
                alt={match.streamLinks[0].commentator}
                className="w-5 h-5 rounded-full flex-shrink-0"
              />
            ) : (
              <UserIcon className="w-5 h-5 text-slate-500 flex-shrink-0" />
            )}
            <span className="text-xs sm:text-sm text-sky-400 truncate">
              {match.streamLinks?.[0]?.commentator || "N/A"}
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <a className="flex-1 bg-slate-600 hover:bg-slate-500 text-white text-xs sm:text-sm font-semibold py-1.5 px-2 rounded transition-colors text-center">
            Xem Ngay
          </a>
          <a
            href="#"
            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm font-semibold py-1.5 px-2 rounded transition-colors text-center"
          >
            Đặt Cược
          </a>
        </div>
      </div>
    </div>
  );
};

export default SpotlightMatchCard;
