import { Match } from "@/types/index.types";
import { InformationCircleIconSolid } from "./Icon";
import * as React from "react";

interface MatchInfoBarProps {
  match: Match;
}

const MatchInfoBar: React.FC<MatchInfoBarProps> = ({ match }) => {
  return (
    <div className="bg-slate-800 p-3 my-1 rounded-lg shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="mb-2 sm:mb-0">
          <div className="flex items-center text-xs text-gray-400 mb-1">
            <InformationCircleIconSolid className="w-4 h-4 mr-1 text-sky-400" />
            <span>
              {match.description ||
                `Trực tiếp ${match.leagueName}: ${match.teamA.name} vs ${match.teamB.name}`}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            <span>
              Thời gian:{" "}
              <span className="text-gray-300">
                {match.time} Ngày {match.date}
              </span>
            </span>
            <span className="mx-2 text-gray-600">|</span>
            <span>
              Giải đấu:{" "}
              <span className="text-gray-300">{match.leagueName}</span>
            </span>
          </div>
        </div>
        <a
          href={match.betUrl || "#"}
          className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-2 px-4 rounded text-sm shadow-md whitespace-nowrap transition-colors self-start sm:self-center"
        >
          CƯỢC UY TÍN 100%
        </a>
      </div>
      {match.streamerName && (
        <div className="mt-2 pt-2 border-t border-slate-700 flex items-center text-xs text-gray-400">
          {match.streamerAvatarUrl && (
            <img
              src={match.streamerAvatarUrl}
              alt={match.streamerName}
              className="w-5 h-5 rounded-full mr-1.5"
            />
          )}
          <span>
            Bình luận viên:{" "}
            <span className="text-sky-400 font-medium">
              {match.streamerName}
            </span>
          </span>
        </div>
      )}
    </div>
  );
};

export default MatchInfoBar;
