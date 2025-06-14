import * as React from "react";
import { FootballIcon } from "./Icon"; // Using FootballIcon as a generic sport icon
import { useNavigate } from "react-router-dom";
import team_1 from "@/assets/user/team-1.png";
import team_2 from "@/assets/user/team-2.png";
import { Match } from "@/types/match.types";
const MatchCard: React.FC<{ match: Match; small?: boolean }> = ({
  match,
  small = false,
}) => {
  const navigate = useNavigate();
  return (
    <div
      className={`bg-slate-800 rounded-lg shadow-md overflow-hidden ${
        small
          ? "w-[260px] sm:w-[320px] md:w-[400px]"
          : "w-72 sm:w-80 md:w-[420px] xl:w-[450px]"
      } flex-shrink-0 cursor-pointer`}
      onClick={() => navigate("/truc-tiep")}
    >
      <div className="p-2 sm:p-3 bg-slate-700/50">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-1 text-xs text-gray-400">
            <FootballIcon className="w-4 h-4 text-yellow-400" />
            <span className="truncate max-w-[90px] sm:max-w-[140px]">
              {match.title}
            </span>
          </div>
          {/* <div className="text-xs text-gray-400 whitespace-nowrap">
            <span>{match.startTime}</span>
            <span className="mx-1">|</span>
            <span>{match.date}</span>
          </div> */}
          {match.status && (
            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded font-semibold">
              {match.status || "LIVE"}
            </span>
          )}
        </div>

        <div className="flex items-center justify-around my-2 sm:my-3">
          <div className="flex flex-col items-center text-center w-2/5">
            <img
              src={team_1}
              alt={match?.homeTeam?.logo}
              className="w-10 h-10 sm:w-12 sm:h-12 xl:w-16 xl:h-16 object-contain mb-1"
            />
            <span className="text-white text-xs sm:text-sm font-medium truncate w-full">
              {match?.homeTeam?.name}
            </span>
          </div>

          {match.status && typeof match.scores === "object" ? (
            <div className="text-center px-1">
              <span className="text-xs md:text-xl font-bold text-white">
                {match.scores?.homeScore} - {match.scores.awayScore}
              </span>
              <div className="text-xs text-yellow-400 mt-1">
                {match.status === "LIVE" ? "LIVE" : match.status}
              </div>
            </div>
          ) : (
            <span className="text-gray-400 text-base sm:text-lg font-semibold px-2">
              VS
            </span>
          )}

          <div className="flex flex-col items-center text-center w-2/5">
            <img
              src={team_2}
              alt={match?.awayTeam?.logo}
              className="w-10 h-10 sm:w-12 sm:h-12 xl:w-16 xl:h-16 object-contain mb-1"
            />
            <span className="text-white text-xs sm:text-sm font-medium truncate w-full">
              {match?.awayTeam?.name}
            </span>
          </div>
        </div>
      </div>

      <div className="p-2 sm:p-3 bg-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {match?.streamLinks[0]?.commentatorImage && (
            <img
              src={match.streamLinks[0]?.commentatorImage}
              alt={match.streamLinks[0]?.commentator}
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
            />
          )}
          {match.streamLinks[0].commentator && (
            <span className="text-xs sm:text-sm text-gray-400 truncate max-w-[90px] sm:max-w-[120px]">
              {match.streamLinks[0].commentator}
            </span>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <a
            // href={match.matchUrl || "#"}
            className="bg-slate-600 hover:bg-slate-500 text-white text-xs sm:text-sm font-semibold py-1.5 px-2 sm:px-3 rounded transition-colors text-center"
          >
            Xem Ngay
          </a>
          {/* {match.showBetButton && (
            <a
              href={match.betUrl || "#"}
              className="bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm font-semibold py-1.5 px-2 sm:px-3 rounded transition-colors text-center"
            >
              Đặt Cược
            </a>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
