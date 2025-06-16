import * as React from "react";
import ReplayCard from "@/components/layout/ReplayCard";
import { ChevronRightIcon, TVIcon } from "@/components/layout/Icon";
import { Replay } from "@/types/replay.types";

interface ReplaySectionProps {
  title: string;
  replays: Replay[];
  viewAllUrl?: string;
}

const ReplaySection: React.FC<ReplaySectionProps> = ({
  title,
  replays,
  viewAllUrl,
}) => {
  if (!replays || replays.length === 0) {
    return null;
  }

  return (
    <section className="py-4 px-2 sm:px-4 md:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-2">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white flex items-center">
          <TVIcon className="w-6 h-6 mr-2 text-yellow-400" /> {title}
        </h2>
        {viewAllUrl && (
          <a
            href={viewAllUrl}
            className="text-xs sm:text-sm text-yellow-400 hover:text-yellow-300 flex items-center"
          >
            Xem tất cả <ChevronRightIcon className="w-4 h-4 ml-1" />
          </a>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 3xl:grid-cols-4 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {replays?.map((replay) => (
          <ReplayCard key={replay?._id} replay={replay} />
        ))}
      </div>
    </section>
  );
};

export default ReplaySection;
