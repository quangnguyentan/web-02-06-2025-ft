import { Match } from "@/types/index.types";
import { UserIcon } from "./Icon"; // For streamer avatar fallback or details icon
import * as React from "react";

const ResultsListItem: React.FC<{ match: Match }> = ({ match }) => {
  return (
    <div className="flex items-center p-3 bg-slate-800 hover:bg-slate-700/50 transition-colors duration-150 border-b border-slate-700 last:border-b-0">
      <div className="w-[15%] sm:w-[12%] text-xs text-gray-400 pr-2">
        <div>{match.time}</div>
        <div className="text-gray-500">{match.date}</div>
      </div>

      <div className="w-[28%] sm:w-[30%] flex items-center justify-end space-x-2 pr-2 sm:pr-3 text-right">
        <span className="text-sm text-white truncate">{match.teamA.name}</span>
        <img
          src={match.teamA.logoUrl}
          alt={match.teamA.name}
          className="w-5 h-5 sm:w-6 sm:h-6 object-contain flex-shrink-0"
        />
      </div>

      <div className="w-[14%] sm:w-[16%] text-center">
        <div className="text-base sm:text-lg font-bold text-white">
          <span>{match.scoreA ?? "-"}</span>
          <span className="mx-1 sm:mx-1.5">-</span>
          <span>{match.scoreB ?? "-"}</span>
        </div>
        <div className="text-[10px] sm:text-xs text-red-500 font-semibold uppercase tracking-tight">
          Kết thúc
        </div>
      </div>

      <div className="w-[28%] sm:w-[30%] flex items-center space-x-2 pl-2 sm:pl-3 text-left">
        <img
          src={match.teamB.logoUrl}
          alt={match.teamB.name}
          className="w-5 h-5 sm:w-6 sm:h-6 object-contain flex-shrink-0"
        />
        <span className="text-sm text-white truncate">{match.teamB.name}</span>
      </div>

      <div className="w-[15%] sm:w-[12%] flex items-center justify-end space-x-1 pl-1 text-xs">
        {match.streamerAvatarUrl ? (
          <img
            src={match.streamerAvatarUrl}
            alt={match.streamerName}
            className="w-5 h-5 rounded-full hidden sm:block"
          />
        ) : (
          match.streamerName && (
            <UserIcon className="w-5 h-5 text-slate-500 hidden sm:block" />
          )
        )}
        {match.streamerName && (
          <span className="text-sky-400 truncate hover:text-sky-300 cursor-pointer">
            {match.streamerName}
          </span>
        )}
        {!match.streamerName && (
          <span className="text-gray-500 italic">N/A</span>
        )}
      </div>
    </div>
  );
};

export default ResultsListItem;
