import ReplaySuggestionsPanel from "@/components/layout/ReplaySuggestionsPanel";
import FeaturedBroadcastSection from "@/components/layout/FeaturedBroadcastSection";
import CategoryReplaySection from "@/components/layout/CategoryReplaySection";
import FilterBarReplays from "@/components/layout/FilterBarReplays";
import {
  FeaturedBroadcastItem,
  HighlightedEventInfo,
  CategorizedReplayGroup,
} from "@/types/replay.types";
import { HomeIconSolid, ChevronRightIcon } from "@/components/layout/Icon";
import * as React from "react";
import { Replay } from "@/types/replay.types";

interface ReplayHubPageProps {
  featuredBroadcasts?: FeaturedBroadcastItem[];
  highlightedEvent?: HighlightedEventInfo;
  categorizedReplays?: CategorizedReplayGroup[];
  sidebarReplays?: Replay[];
}

const ReplayHubBreadcrumbs: React.FC = () => (
  <nav
    className="text-xs text-gray-400 mb-3 px-1 flex items-center space-x-1.5"
    aria-label="Breadcrumb"
  >
    <a href="#" className="hover:text-yellow-400 flex items-center">
      <HomeIconSolid className="w-3.5 h-3.5 mr-1" /> Trang chủ
    </a>
    <ChevronRightIcon className="w-3 h-3 text-gray-500" />
    <span className="text-gray-200 font-medium">Xem Lại</span>
  </nav>
);

const ReplayHubPage: React.FC<ReplayHubPageProps> = ({
  featuredBroadcasts,
  highlightedEvent,
  categorizedReplays,
  sidebarReplays,
}) => {
  const pageTitle =
    "XEM LẠI NHỮNG TRẬN ĐẤU ĐỈNH CAO TRÊN THAPCAM TV MỚI NHẤT, CẬP NHẬT LIÊN TỤC";
  const pageDescription =
    "Trang Thapcam TV cập nhật đầy đủ các video bóng đá, thể thao chất lượng nhất, được bình luận bằng tiếng Việt. Thêm vào đó còn có các tin tức thể thao mới nhất được cập nhật liên tục.";
  return (
    <div
      className=" lg:max-w-[1024px]
    xl:max-w-[1200px]
    2xl:max-w-[1440px]

    lg:translate-x-0
    xl:translate-x-[calc((100vw-1200px)/2)]
   2xl:translate-x-[calc((100vw-1440px)/12)]
    3xl:translate-x-[calc((100vw-1440px)/2)]"
    >
      <main className="w-full pt-2">
        <ReplayHubBreadcrumbs />
        <FilterBarReplays />
        <div className="bg-slate-800 p-4 rounded-lg shadow-xl mb-4">
          <h1 className="text-xl font-bold text-yellow-400 mb-2">
            {pageTitle}
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed">
            {pageDescription}
          </p>
        </div>
        <h2 className="text-lg font-bold uppercase text-gray-100/80 py-4">
          Mới cập nhật
        </h2>
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-2/3 flex-shrink-0 pr-2">
            <div className="rounded-lg shadow-md mb-4">
              <FeaturedBroadcastSection
                items={featuredBroadcasts}
                highlightedEvent={highlightedEvent}
              />
            </div>

            {categorizedReplays.map((group) => (
              <CategoryReplaySection key={group.id} group={group} />
            ))}
          </div>

          <div className="lg:w-1/3 flex-shrink-0">
            <div className="">
              {/* Adjust top based on header height */}
              <ReplaySuggestionsPanel
                replays={sidebarReplays}
                title="XEM LẠI BÓNG ĐÁ"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReplayHubPage;
