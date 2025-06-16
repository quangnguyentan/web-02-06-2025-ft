import { LeagueSchedule, Match } from "@/types/match.types";
import ResultsListItem from "./ResultsListItem";
import { CalendarDaysIcon } from "./Icon";
import * as React from "react";

interface ResultsListProps {
  leagues: LeagueSchedule[];
  selectedDateLabel: string; // e.g., "Hôm Nay", "03/06"
}

const ResultsList: React.FC<ResultsListProps> = ({
  leagues,
  selectedDateLabel,
}) => {
  if (!leagues || leagues.length === 0) {
    return (
      <div className="bg-slate-800 p-6 rounded-b-md text-center text-gray-400 shadow-inner">
        <CalendarDaysIcon className="w-16 h-16 mx-auto text-slate-700 mb-4" />
        <p className="text-lg font-semibold">Không có kết quả</p>
        <p className="text-sm">
          Không có kết quả trận đấu nào cho {selectedDateLabel}.
        </p>
        <p className="text-sm">Vui lòng chọn ngày khác.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-850 rounded-b-md shadow-lg">
      {leagues.map((league) => (
        <div key={league.id} className="mb-0 last:mb-0">
          <div className="bg-slate-700/70 flex items-center p-2.5 border-b border-slate-600/50 sticky top-0 z-10">
            {" "}
            {/* Sticky header for league */}
            {league.icon && <span className="mr-2">{league.icon}</span>}
            <h3 className="text-sm font-semibold text-white tracking-wide">
              {league.name}
            </h3>
          </div>
          {/* Removed divide-y from here, border is on ListItem now */}
          <div>
            {league.matches.map((match: Match) => (
              <ResultsListItem key={match?._id} match={match} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultsList;
