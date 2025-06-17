import ReplayCard from "./ReplayCard"; // Using the updated ReplayCard with 'compact' variant
import { TVIcon } from "./Icon";
import * as React from "react";
import { Replay } from "@/types/replay.types";

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
      <div className="bg-slate-800 p-2 sm:p-3 rounded-lg shadow text-center text-gray-500 text-xs sm:text-sm">
        Không có video xem lại.
      </div>
    );
  }

  return (
    // <div className="bg-slate-800 p-2 sm:p-3 rounded-lg shadow mt-3 sm:mt-0">
    <div className="p-2 sm:p-3 rounded-lg shadow mt-3 sm:mt-0">
      <div className="space-y-5 max-h-[320px] sm:max-h-[700px] overflow-y-auto pr-1 custom-scrollbar">
        {/* Added max-h and pr for scrollbar spacing */}
        {replays?.map((replay) => (
          <ReplayCard key={replay?._id} replay={replay} variant="compact" />
        ))}
      </div>
    </div>
  );
};

export default ReplaySuggestionsPanel;
