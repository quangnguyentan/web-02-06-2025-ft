import VideoPlayer from "@/components/layout/VideoPlayer";
import FilterBarReplays from "@/components/layout/FilterBarReplays";
import ReplaySuggestionsPanel from "@/components/layout/ReplaySuggestionsPanel";
import HorizontalAdBanner from "@/components/layout/HorizontalAdBanner";
import { Replay } from "@/types/index.types";
import { HomeIconSolid, ChevronRightIcon } from "@/components/layout/Icon";
import * as React from "react";

interface ReplayStreamPageProps {
  mainReplay: Replay;
  suggestedReplays: Replay[];
}

const ReplayStreamBreadcrumbs: React.FC<{ replay: Replay }> = ({ replay }) => (
  <nav
    className="text-xs text-gray-400 mb-2 px-1 flex items-center space-x-1.5"
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
      {replay.categoryDisplayName || "Thể loại"}
    </a>
    <ChevronRightIcon className="w-3 h-3 text-gray-500" />
    <span
      className="text-gray-200 truncate max-w-[120px] xs:max-w-[180px] sm:max-w-xs"
      title={replay.title}
    >
      {replay.title}
    </span>
  </nav>
);

const ReplayStreamPage: React.FC<ReplayStreamPageProps> = ({
  mainReplay,
  suggestedReplays,
}) => {
  return (
    <div className="container mx-auto max-w-screen-xl px-1 sm:px-4 py-3">
      <ReplayStreamBreadcrumbs replay={mainReplay} />
      <FilterBarReplays currentCategory={mainReplay.categoryDisplayName} />
      <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-white my-3 px-1">
        {mainReplay.title}
      </h1>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Column: Video Player + Ad */}
        <div className="w-full lg:w-full xl:w-3/4 flex-shrink-0">
          <VideoPlayer
            videoTitle={mainReplay.title}
            videoUrl={mainReplay.videoUrl}
            posterUrl={
              mainReplay.thumbnailUrl ||
              "https://picsum.photos/seed/superbowl_poster/1280/720"
            }
          />
          <div>
            <HorizontalAdBanner
              imageUrl="https://via.placeholder.com/150x50/0B65C2/FFFFFF?text=8XBET+Horizontal"
              text="HOÀN TIỀN VỀ CƯỢC ĐẦU TIÊN 100%"
              buttonText="ĐĂNG KÝ NGAY"
            />
          </div>
          <div className="bg-slate-800 p-3 rounded-md text-xs sm:text-sm text-gray-400 mt-3">
            <p>
              Nội dung mô tả thêm về trận đấu hoặc video này. Ví dụ:{" "}
              {mainReplay.title}. Bình luận bởi {mainReplay.commentator}. Video
              có thời lượng {mainReplay.duration}.
            </p>
          </div>
        </div>

        {/* Right Column: Replay Suggestions */}
        <div className="w-full lg:w-1/3 xl:w-1/4 flex-shrink-0 mt-4 lg:mt-0">
          <div className="lg:sticky lg:top-[120px]">
            <ReplaySuggestionsPanel
              replays={suggestedReplays}
              title={`XEM LẠI ${
                mainReplay.categoryDisplayName?.toUpperCase() || "KHÁC"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplayStreamPage;
