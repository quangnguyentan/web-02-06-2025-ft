import * as React from "react";
import {
  FeaturedBroadcastItem,
  HighlightedEventInfo,
} from "@/types/replay.types";

interface FeaturedBroadcastSectionProps {
  items: FeaturedBroadcastItem[];
  highlightedEvent: HighlightedEventInfo;
}

const FeaturedBroadcastSection: React.FC<FeaturedBroadcastSectionProps> = ({
  highlightedEvent,
}) => {
  return (
    <div className="rounded-lg shadow-xl">
      <div className="relative rounded-md overflow-hidden shadow-md">
        <img
          src={highlightedEvent?.replay?.thumbnail}
          alt="Player highlight"
          className="
            w-full 
            h-[320px] 
            sm:h-[420px] 
            lg:h-[700px] 
            object-cover 
            transition-all duration-300
          "
        />

        {/* Overlay Text Content */}
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4">
          <div className="text-white space-y-1">
            <p className="text-xs sm:text-sm font-medium">
              {highlightedEvent?.description}
            </p>
            <p className="text-[11px] sm:text-xs text-gray-300">
              {highlightedEvent?.commentatorInfo}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedBroadcastSection;
