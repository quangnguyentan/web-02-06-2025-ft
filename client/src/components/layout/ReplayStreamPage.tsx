import VideoPlayer from "@/components/layout/VideoPlayer";
import FilterBarReplays from "@/components/layout/FilterBarReplays";
import ReplaySuggestionsPanel from "@/components/layout/ReplaySuggestionsPanel";
import { CategorizedReplayGroup, Replay } from "@/types/replay.types";
import { HomeIconSolid, ChevronRightIcon } from "@/components/layout/Icon";
import * as React from "react";
import belt_bottom_top from "@/assets/user/1330t190.gif";
import CategoryReplaySection from "./CategoryReplaySection";

interface ReplayStreamPageProps {
  mainReplay: Replay;
  categorizedReplays?: CategorizedReplayGroup[];
  suggestedReplays: Replay[];
}

const ReplayStreamBreadcrumbs: React.FC<{ replay: Replay }> = ({ replay }) => (
  <nav
    className="text-xs text-gray-400 mb-2 px-1 flex items-center space-x-0.5 pt-4"
    aria-label="Breadcrumb"
  >
    <a href="#" className="hover:text-yellow-400 flex items-center">
      <HomeIconSolid className="w-3.5 h-3.5 mr-1" /> Trang chủ
    </a>
    <ChevronRightIcon className="w-3 h-3 text-gray-500" />
    <a href="#" className="hover:text-yellow-400">
      Xem lại
    </a>
    <ChevronRightIcon className="w-3 h-3 text-gray-500" />
    <a href="#" className="hover:text-yellow-400">
      {replay?.sport?.name || "Thể loại"}
    </a>
    <ChevronRightIcon className="w-3 h-3 text-gray-500" />
    <span
      className="text-orange-500 truncate max-w-[120px] xs:max-w-[180px] sm:max-w-xs"
      title={replay?.title}
    >
      {replay?.title}
    </span>
  </nav>
);

const ReplayStreamPage: React.FC<ReplayStreamPageProps> = ({
  mainReplay,
  suggestedReplays,
  categorizedReplays,
}) => {
  const filteredCategorizedReplays = categorizedReplays
    ? categorizedReplays?.filter((_, index) => index === 0 || index >= 4)
    : [];
  return (
    <div
      className="lg:max-w-[1024px]
    xl:max-w-[1200px]
    2xl:max-w-[1440px]
    lg:translate-x-0
    xl:translate-x-[calc((100vw-1200px)/2)]
    2xl:translate-x-[calc((100vw-1440px)/12)]
    3xl:translate-x-[calc((100vw-1440px)/2)]"
    >
      <ReplayStreamBreadcrumbs replay={mainReplay} />
      <FilterBarReplays currentCategory={mainReplay?.slug} />
      <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-white my-3 px-1">
        {mainReplay?.title}
      </h1>

      <div className="flex flex-col lg:flex-row">
        {/* Left Column: Video Player + Ad */}
        <div className="w-full lg:w-full xl:w-3/4 flex-shrink-0 pr-2">
          <VideoPlayer
            videoTitle={mainReplay?.title}
            videoUrl={mainReplay?.videoUrl}
            posterUrl={mainReplay?.thumbnail}
          />
          <div className="">
            <img
              src={belt_bottom_top}
              alt="Ad Banner"
              className="object-cover md:w-full "
            />
          </div>
          <div className="rounded-md text-xs sm:text-sm text-white py-2">
            <p>{mainReplay?.title}</p>
          </div>
        </div>

        {/* Right Column: Replay Suggestions */}
        <div className="w-full lg:w-1/3 xl:w-1/4 flex-shrink-0 mt-4 lg:mt-0">
          <div>
            <ReplaySuggestionsPanel
              replays={suggestedReplays}
              title={`XEM LẠI ${
                mainReplay?.sport?.name?.toUpperCase() || "KHÁC"
              }`}
            />
          </div>
        </div>
      </div>
      <div className="w-full">
        {filteredCategorizedReplays?.map((group) => (
          <CategoryReplaySection key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
};

export default ReplayStreamPage;
