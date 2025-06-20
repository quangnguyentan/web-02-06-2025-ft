import * as React from "react";
import { FootballIcon } from "./Icon";
import { Match } from "@/types/match.types";
import { useNavigate } from "react-router-dom";
import basketball from "@/assets/user/basketball-min.jpg";
import tennis from "@/assets/user/tennis-min.jpg";
import football from "@/assets/user/football-min1.jpg";
import volleyball from "@/assets/user/volleyball-min.jpg";
import boxing from "@/assets/user/boxing-min.jpg";
import race from "@/assets/user/race-min.jpg";
import esport from "@/assets/user/esport-min.jpg";
import { useSelectedPageContext } from "@/hooks/use-context";
import badminton from "@/assets/user/badminton-min.png";

const MatchCard: React.FC<{ match: Match; small?: boolean }> = ({
  match,
  small = false,
}) => {
  const navigate = useNavigate();
  const { setSelectedSportsNavbarPage } = useSelectedPageContext();
  const startTime = new Date(match.startTime || "").toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour12: false,
  });
  const isLive = match?.status === "LIVE";
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
      className={`bg-slate-800 rounded-xl shadow-md overflow-hidden my-1 ml-1 ${
        small
          ? "w-[260px] sm:w-[320px] md:w-[390px]"
          : "w-72 sm:w-80 md:w-[420px] xl:w-[450px]"
      } flex-shrink-0 cursor-pointer relative`}
      style={{
        backgroundImage: `url(${imageSlug})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "0 0 0 2px rgba(255, 164, 92, 0.6)",
      }}
    >
      {/* Overlay to ensure readability */}
      {!["Bóng rổ", "Tennis", "Bóng chuyền"].includes(match?.sport?.name) && (
        <div
          className="absolute inset-0 bg-black bg-opacity-90"
          style={{ zIndex: 1 }} // Đảm bảo overlay nằm dưới nội dung
        ></div>
      )}

      <div className="p-2 sm:p-3  relative z-10">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-1 text-xs text-gray-400">
            <FootballIcon className="w-4 h-4 text-yellow-400" />
            <span className="truncate max-w-[90px] sm:max-w-[140px]">
              {match.league?.name || match.title}
            </span>
          </div>
          <div className="text-xs text-gray-400 whitespace-nowrap">
            {startTime}
          </div>
          {isLive && (
            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded font-semibold">
              LIVE
            </span>
          )}
        </div>

        <div className="flex items-center justify-around my-2 sm:my-3">
          <div className="flex flex-col items-center text-center w-2/5">
            <img
              src={match.homeTeam?.logo || ""}
              alt={match.homeTeam?.name}
              className="w-10 h-10 sm:w-12 sm:h-12 xl:w-16 xl:h-16 object-contain mb-1"
            />
            <span className="text-white text-xs sm:text-sm font-medium truncate w-full">
              {match.homeTeam?.name}
            </span>
          </div>

          {match?.status && match?.scores ? (
            <div className="text-center px-1">
              <span className="text-xs md:text-xl font-bold text-white">
                {match.scores.homeScore} - {match.scores.awayScore}
              </span>
              <div className="text-xs text-yellow-400 mt-1 font-medium">
                {/* {isLive ? "LIVE" : match?.status} */}
                {isLive && "LIVE"}
              </div>
            </div>
          ) : (
            <span className="text-gray-400 text-base sm:text-lg font-semibold px-2">
              VS
            </span>
          )}

          <div className="flex flex-col items-center text-center w-2/5">
            <img
              src={match.awayTeam?.logo || ""}
              alt={match.awayTeam?.name}
              className="w-10 h-10 sm:w-12 sm:h-12 xl:w-16 xl:h-16 object-contain mb-1"
            />
            <span className="text-white text-xs sm:text-sm font-medium truncate w-full">
              {match.awayTeam?.name}
            </span>
          </div>
        </div>
      </div>

      <div
        className="p-2 sm:p-3 flex flex-col sm:flex-row items-center justify-between gap-2 relative z-10"
        style={{
          boxShadow: "0 0 0 2px rgba(255, 164, 92, 0.6)",
        }}
      >
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {match.streamLinks?.[0]?.commentatorImage && (
            <img
              src={match.streamLinks[0].commentatorImage}
              alt={match.streamLinks[0].commentator}
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
            />
          )}
          {match.streamLinks?.[0].commentator && (
            <span className="text-xs sm:text-sm text-gray-400 truncate max-w-[90px] sm:max-w-[120px]">
              {match.streamLinks[0].commentator}
            </span>
          )}
        </div>
        <a className="bg-slate-600 hover:bg-slate-500 text-white text-xs sm:text-sm font-semibold py-1.5 px-2 sm:px-3 rounded transition-colors text-center w-full sm:w-auto">
          Xem Ngay
        </a>
      </div>
    </div>
  );
};

export default MatchCard;
