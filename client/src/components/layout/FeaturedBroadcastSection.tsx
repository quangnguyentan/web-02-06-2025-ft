import * as React from "react";
import {
  FeaturedBroadcastItem,
  HighlightedEventInfo,
} from "@/types/replay.types";

interface FeaturedBroadcastSectionProps {
  mainTitle: string;
  subTitle: string;
  items: FeaturedBroadcastItem[];
  highlightedEvent: HighlightedEventInfo;
}

const FeaturedBroadcastSection: React.FC<FeaturedBroadcastSectionProps> = ({
  mainTitle,
  subTitle,
  highlightedEvent,
}) => {
  return (
    <div className="bg-slate-800/50 p-4 rounded-lg shadow-xl my-4">
      <h2 className="text-lg sm:text-2xl font-bold text-white uppercase tracking-wide">
        {mainTitle}
      </h2>
      <p className="text-base sm:text-lg font-semibold text-orange-400 mb-4">
        {subTitle}
      </p>

      {/* Highlighted Event Summary Area */}
      <div className="relative rounded-md overflow-hidden shadow-md border border-slate-500/70">
        {/* Background Image */}
        <img
          src={highlightedEvent?.replay?.thumbnail}
          alt="Player highlight"
          className="
            w-full 
            h-[320px] 
            sm:h-[420px] 
            lg:h-[620px] 
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
