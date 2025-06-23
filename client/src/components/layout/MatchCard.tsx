import * as React from "react";
import { FootballIcon } from "./Icon";
import { Match } from "@/types/match.types";
import { useNavigate } from "react-router-dom";
import basketball from "@/assets/user/basketball-min.jpg";
import tennis from "@/assets/user/tennis-min.jpg";
import football from "@/assets/user/football-min.jpg";
import volleyball from "@/assets/user/volleyball-min.jpg";
import boxing from "@/assets/user/boxing-min.jpg";
import race from "@/assets/user/race-min.jpg";
import esport from "@/assets/user/esport-min.jpg";
import { useSelectedPageContext } from "@/hooks/use-context";
import badminton from "@/assets/user/badminton-min.jpg";
import bida from "@/assets/user/bi-da.jpg";

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
    // year: "numeric",
    hour12: false,
  });
  const isLive = match?.status === "LIVE";
  const targetUrl = `/truc-tiep/${match?.slug}/${match?.sport?.slug}`;
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
      : match?.sport?.name === "Bi-a"
      ? bida
      : "";
  const commentator = match.streamLinks?.[0]?.commentator;
  const commentatorName =
    typeof commentator === "object" && commentator?._id
      ? commentator.username ||
        `${commentator.firstname || ""} ${commentator.lastname || ""}`.trim() ||
        "Unknown Commentator"
      : "Unknown Commentator";
  return (
    <div
      onClick={() => {
        navigate(targetUrl);
        setSelectedSportsNavbarPage(match?.sport?.name ?? "");
        localStorage.setItem(
          "selectedSportsNavbarPage",
          match?.sport?.name ?? ""
        );
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
      {/* {!["Bóng rổ", "Tennis", "Bóng chuyền"].includes(
        match?.sport?.name ?? ""
      ) && (
        <div
          className="absolute inset-0 bg-black bg-opacity-100"
          style={{ zIndex: 1 }} // Đảm bảo overlay nằm dưới nội dung
        ></div>
      )} */}

      <div className="p-2 sm:p-3  relative z-10">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-1 text-xs text-gray-400">
            {/* <FootballIcon className="w-4 h-4 text-yellow-400" /> */}
            <span className="truncate max-w-[60px] sm:max-w-[140px] text-white sm:text-sm font-medium">
              {match.league?.name ?? match?.title}
            </span>
          </div>
          {isLive && (
            <div className="absolute translate-x-1/2 w-full right-4 z-10">
              <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded font-bold uppercase">
                LIVE
              </span>
            </div>
          )}
          <div className="text-xs text-white whitespace-nowrap sm:text-sm font-medium truncate">
            {startTime}
          </div>
        </div>

        <div className="flex items-center justify-around my-2 sm:my-3">
          <div className="flex flex-col items-center text-center w-2/5">
            <img
              src={match?.homeTeam?.logo ?? ""}
              alt={match?.homeTeam?.name}
              className="w-10 h-10 sm:w-12 sm:h-12 xl:w-16 xl:h-16 object-contain mb-1"
            />
            <span className="text-white text-xs sm:text-sm font-medium truncate w-full">
              {match.homeTeam?.name}
            </span>
          </div>

          {match?.status && match?.scores ? (
            <div className="text-center px-1">
              <span className="text-xs md:text-xl font-bold text-white">
                {match?.scores?.homeScore} - {match?.scores?.awayScore}
              </span>
              {/* <div className="text-xs text-yellow-400 mt-1 font-medium">
                {isLive && "LIVE"}
              </div> */}
            </div>
          ) : (
            <span className="text-gray-400 text-base sm:text-lg font-semibold px-2">
              VS
            </span>
          )}

          <div className="flex flex-col items-center text-center w-2/5">
            <img
              src={match?.awayTeam?.logo ?? ""}
              alt={match?.awayTeam?.name}
              className="w-10 h-10 sm:w-12 sm:h-12 xl:w-16 xl:h-16 object-contain mb-1"
            />
            <span className="text-white text-xs sm:text-sm font-medium truncate w-full">
              {match.awayTeam?.name}
            </span>
          </div>
        </div>
      </div>

      <div
        className="p-2 sm:p-2 flex flex-col sm:flex-row items-center justify-between gap-2 relative z-10"
        style={{
          boxShadow: "0 0 0 2px rgba(255, 164, 92, 0.6)",
        }}
      >
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {match?.streamLinks?.[0]?.commentatorImage && (
            <img
              src={match?.streamLinks[0]?.commentatorImage}
              alt={commentatorName}
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
            />
          )}
          {match?.streamLinks?.[0]?.commentator && (
            <span className="text-xs sm:text-sm text-white truncate max-w-[90px] sm:max-w-[120px]">
              {commentatorName}
            </span>
          )}
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <a className="bg-blue-600 hover:bg-blue-500 text-white hover:text-[#333] sm:text-sm font-semibold py-1.5 px-6 sm:px-3 rounded transition-colors text-center w-full sm:w-auto !text-sm">
            Xem Ngay
          </a>
          <a
            className=" bg-green-500 hover:bg-green-600  text-white  sm:text-sm font-semibold py-1.5 px-2 sm:px-3 rounded transition-colors text-center w-full sm:w-auto !text-sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // window.open("https://b.thapcam73.life/", "_blank");
            }}
          >
            Đặt Cược
          </a>
        </div>
        <div className="sm:hidden flex flex-col items-center gap-2 w-full">
          <a className="bg-blue-600 hover:bg-blue-500 text-white hover:text-[#333] font-semibold py-1  rounded transition-colors text-center w-full !text-xs">
            Xem Ngay
          </a>
          <a
            className=" bg-green-500 hover:bg-green-600  text-white  font-semibold py-1  rounded transition-colors text-center w-full !text-xs"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // window.open("https://b.thapcam73.life/", "_blank");
            }}
          >
            Đặt Cược
          </a>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
