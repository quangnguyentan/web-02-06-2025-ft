import * as React from "react";
import {
  FeaturedBroadcastItem,
  HighlightedEventInfo,
} from "@/types/index.types";
import demo from "@/assets/user/demo.jpg";
interface FeaturedBroadcastSectionProps {
  mainTitle: string;
  subTitle: string; // e.g., THAPCAM.TV
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

      {/* Highlighted Event Summary Area - Responsive Layout */}
      <div className="bg-slate-700/40 p-2 sm:p-3 rounded-md flex flex-col md:flex-row items-stretch gap-2 sm:gap-3 md:gap-4 relative min-h-[120px] sm:min-h-[150px] md:min-h-[130px]">
        {/* Left Column: Player Image */}
        <div className="w-full md:w-2/5 flex-shrink-0">
          <img
            src={demo}
            alt={`Player highlight`}
            className="w-full h-28 sm:h-36 md:h-[130px] lg:h-[160px] object-cover rounded shadow-md border border-slate-500/70"
          />
        </div>

        {/* Right Column: Text Description and Date */}
        <div className="flex flex-col justify-center flex-grow md:w-3/5">
          <div className="bg-black/30 p-2 rounded-sm w-full">
            <p className="text-xs sm:text-sm text-gray-200 leading-tight font-medium">
              {highlightedEvent.description}
            </p>
            <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
              {highlightedEvent.commentatorInfo}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedBroadcastSection;
