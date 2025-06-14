import { Match } from "@/types/index.types";
import { UserIcon } from "./Icon"; // For streamer avatar fallback
import * as React from "react";
import team_1 from "@/assets/user/team-1.png";
import team_2 from "@/assets/user/team-2.png";
const MatchListItem: React.FC<{ match: Match }> = ({ match }) => {
  return (
    <div className="relative flex flex-wrap sm:flex-nowrap items-center justify-between p-2 sm:p-3 bg-slate-800 hover:bg-slate-700/50 transition-colors duration-150 border-b border-slate-700 last:border-b-0">
      {/* Time */}
      <div className="w-1/3 sm:w-1/6 text-xs sm:text-sm text-gray-300 font-medium mb-1 sm:mb-0">
        {match.time}
      </div>

      {/* Team A */}
      <div className="w-1/2 sm:w-2/5 flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-0">
        <img
          src={team_1 || match.teamA.logoUrl}
          alt={match.teamA.name}
          className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
        />
        <span className="text-xs sm:text-sm text-white truncate">
          {match.teamA.name}
        </span>
      </div>

      {/* VS */}
      <div className="hidden sm:block w-1/12 text-center text-xs text-gray-400">
        vs
      </div>
      <div className="block sm:hidden w-full text-center text-xs text-gray-400 mb-1">
        vs
      </div>

      {/* Team B */}
      <div className="w-1/2 sm:w-2/5 flex items-center space-x-1 sm:space-x-2 justify-end mb-1 sm:mb-0">
        <span className="text-xs sm:text-sm text-white text-right line-clamp-1 overflow-hidden break-words">
          {match.teamB.name}
        </span>
        <img
          src={team_2 || match.teamB.logoUrl}
          alt={match.teamB.name}
          className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
        />
      </div>

      {/* Streamer */}
      <div className="w-full sm:w-1/5 flex items-center justify-end space-x-1.5 pl-0 sm:pl-2 mt-1 sm:mt-0 ">
        {match.streamerAvatarUrl ? (
          <img
            src={match.streamerAvatarUrl}
            alt={match.streamerName}
            className="w-4 h-4 sm:w-5 sm:h-5 rounded-full"
          />
        ) : (
          <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
        )}
        <span className="text-[11px] sm:text-xs text-sky-400 truncate hover:text-sky-300 cursor-pointer">
          {match.streamerName || "N/A"}
        </span>
      </div>

      {/* Live badge */}
      {match.isLive && (
        <div className="w-full sm:w-1/12 flex justify-end mt-1 sm:mt-0 absolute top-0 right-0">
          <span className="text-[11px] sm:text-xs bg-red-500 text-white px-1.5 py-0.5 rounded font-semibold animate-pulse">
            LIVE
          </span>
        </div>
      )}
    </div>
  );
};

export default MatchListItem;
