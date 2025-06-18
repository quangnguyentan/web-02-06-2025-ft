import ReplayCard from "./ReplayCard"; // Using the updated ReplayCard with 'compact' variant
import { TVIcon } from "./Icon";
import * as React from "react";
import { Replay } from "@/types/replay.types";

interface ReplaySuggestionsPanelProps {
  replays: Replay[];
  title?: string;
  titleHidden?: boolean; // Optional prop to hide the title
}

const ReplaySuggestionsPanel: React.FC<ReplaySuggestionsPanelProps> = ({
  replays,
  title = "XEM LẠI",
  titleHidden,
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
    <div className="rounded-lg shadow">
      <div className="space-y-5 max-h-[320px] sm:max-h-[700px] overflow-y-auto pr-1 custom-scrollbar">
        {/* Added max-h and pr for scrollbar spacing */}
        {titleHidden && (
          <div className="flex items-center space-x-2 px-2">
            <TVIcon className="w-5 h-5 text-yellow-400" />
            <h3 className="text-sm sm:text-lg font-bold text-white">{title}</h3>
          </div>
        )}
        {location?.pathname?.startsWith("/xem-lai/") ? (
          <>
            {replays?.slice(1, 4).map((replay) => (
              <ReplayCard key={replay?._id} replay={replay} variant="default" />
            ))}
          </>
        ) : (
          <>
            {replays?.slice(0, 3).map((replay, index) => (
              <ReplayCard
                key={replay?._id}
                replay={replay}
                variant={index === 0 ? "default" : "compact"}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ReplaySuggestionsPanel;
