import { Match, MatchStatusType } from "@/types/match.types";
import { UserIcon } from "./Icon"; // For streamer avatar fallback or details icon
import * as React from "react";

const ResultsListItem: React.FC<{ match: Match }> = ({ match }) => {
  const getStatusText = (status: MatchStatusType) => {
    switch (status) {
      case MatchStatusType.LIVE:
        return "Live";
      case MatchStatusType.FINISHED:
        return "Kết thúc";
      default:
        return "";
    }
  };

  return (
    <div className="flex items-center p-3 bg-slate-800 hover:bg-slate-700/50 transition-colors duration-150 border-b border-slate-700 last:border-b-0 relative">
      <div className="w-[15%] sm:w-[12%] text-xs text-gray-400 pr-2">
        <div>
          {new Date(match?.startTime).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })}
        </div>
      </div>

      <div className="w-[28%] sm:w-[30%] flex items-center justify-end space-x-2 pr-2 sm:pr-3 text-right font-semibold">
        <span className="text-sm text-white truncate">
          {match?.homeTeam?.name}
        </span>
        <img
          src={match?.homeTeam?.logo}
          alt={match?.homeTeam?.name}
          className="w-5 h-5 sm:w-10 sm:h-10 object-contain flex-shrink-0"
        />
      </div>

      <div className="w-[14%] sm:w-[16%] text-center">
        <div className="text-base sm:text-lg font-bold text-white">
          <span>{match?.scores?.homeScore ?? "-"}</span>
          <span className="mx-1 sm:mx-1.5">-</span>
          <span>{match?.scores?.awayScore ?? "-"}</span>
        </div>
        <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-tight">
          <span
            className={
              match?.status === MatchStatusType.LIVE
                ? "text-red-500"
                : "text-gray-500"
            }
          >
            {getStatusText(match?.status)}
          </span>
        </div>
      </div>

      <div className="w-[28%] sm:w-[30%] flex items-center space-x-2 pl-2 sm:pl-3 text-left font-semibold">
        <img
          src={match?.awayTeam?.logo}
          alt={match?.awayTeam?.name}
          className="w-5 h-5 sm:w-10 sm:h-10 object-contain flex-shrink-0"
        />
        <span className="text-sm text-white truncate">
          {match?.awayTeam?.name}
        </span>
      </div>

      <div className="w-[15%] sm:w-[12%] flex items-center justify-end space-x-1 pl-1 text-xs">
        {match?.streamLinks?.[0]?.commentatorImage ? (
          <img
            src={match?.streamLinks?.[0]?.commentatorImage}
            alt={match?.streamLinks?.[0]?.commentator}
            className="w-5 h-5 rounded-full hidden sm:block"
          />
        ) : (
          match?.streamLinks?.[0]?.commentator && (
            <UserIcon className="w-5 h-5 text-slate-500 hidden sm:block" />
          )
        )}
        {match?.streamLinks?.[0]?.commentator && (
          <span className="text-sky-400 truncate hover:text-sky-300 cursor-pointer">
            {match?.streamLinks?.[0]?.commentator}
          </span>
        )}

        {!match?.streamLinks?.[0]?.commentator && (
          <span className="text-gray-500 italic">N/A</span>
        )}
      </div>
      {match.status === "LIVE" && (
        <div className="w-full sm:w-1/12 flex justify-end mt-1 sm:mt-0 absolute top-0 right-0">
          <span className="text-[11px] sm:text-xs bg-red-500 text-white px-1.5 py-0.5 rounded font-semibold animate-pulse">
            LIVE
          </span>
        </div>
      )}
    </div>
  );
};

export default ResultsListItem;
