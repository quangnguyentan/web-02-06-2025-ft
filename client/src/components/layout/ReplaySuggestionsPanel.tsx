import { Replay } from "@/types/index.types";
import ReplayCard from "./ReplayCard"; // Using the updated ReplayCard with 'compact' variant
import { TVIcon } from "./Icon";
import * as React from "react";

interface ReplaySuggestionsPanelProps {
  replays: Replay[];
  title?: string;
}

const ReplaySuggestionsPanel: React.FC<ReplaySuggestionsPanelProps> = ({
  replays,
  title = "XEM LẠI",
}) => {
  if (!replays || replays.length === 0) {
    return (
      <div className="bg-slate-800 p-2 sm:p-3 rounded-lg shadow mt-3 sm:mt-4 text-center text-gray-500 text-xs sm:text-sm">
        Không có video xem lại.
      </div>
    );
  }

  return (
    <div className="bg-slate-800 p-2 sm:p-3 rounded-lg shadow mt-3 sm:mt-0">
      <h3 className="text-xs sm:text-sm font-semibold text-yellow-400 mb-2 sm:mb-3 flex items-center border-b border-slate-700 pb-1.5 sm:pb-2">
        <TVIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 text-yellow-400" />
        {title}
      </h3>
      <div className="space-y-2 max-h-[320px] sm:max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
        {/* Added max-h and pr for scrollbar spacing */}
        {replays.map((replay) => (
          <ReplayCard key={replay.id} replay={replay} variant="compact" />
        ))}
      </div>
    </div>
  );
};

export default ReplaySuggestionsPanel;
