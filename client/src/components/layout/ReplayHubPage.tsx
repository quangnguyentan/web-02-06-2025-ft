import ReplaySuggestionsPanel from "@/components/layout/ReplaySuggestionsPanel";
import FeaturedBroadcastSection from "@/components/layout/FeaturedBroadcastSection";
import CategoryReplaySection from "@/components/layout/CategoryReplaySection";
import FilterBarReplays from "@/components/layout/FilterBarReplays";
import {
  Replay,
  FeaturedBroadcastItem,
  HighlightedEventInfo,
  CategorizedReplayGroup,
} from "@/types/index.types";
import { HomeIconSolid, ChevronRightIcon } from "@/components/layout/Icon";
import * as React from "react";
import belt_bottom_top from "@/assets/user/1330t190.gif";

interface ReplayHubPageProps {
  featuredBroadcasts: FeaturedBroadcastItem[];
  highlightedEvent: HighlightedEventInfo;
  categorizedReplays: CategorizedReplayGroup[];
  sidebarReplays: Replay[];
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
    <div className="container mx-auto max-w-screen-xl px-2 sm:px-4 py-4 ">
      <main className="w-full">
        <ReplayHubBreadcrumbs />

        <div className="bg-slate-800 p-4 rounded-lg shadow-xl mb-4">
          <h1 className="text-xl font-bold text-yellow-400 mb-2">
            {pageTitle}
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed">
            {pageDescription}
          </p>
        </div>

        <FilterBarReplays />

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Main Content: Featured and Categorized Replays */}
          <div className="lg:w-2/3 flex-shrink-0">
            <div className="bg-slate-800 p-1 rounded-lg shadow-md mb-4">
              <h2 className="text-sm font-semibold uppercase text-gray-400 px-3 pt-2">
                Mới cập nhật
              </h2>
              <FeaturedBroadcastSection
                mainTitle="Lịch Phát Sóng & Bình Luận Trực Tiếp ROLAND GARROS"
                subTitle="THAPCAM.TV"
                items={featuredBroadcasts}
                highlightedEvent={highlightedEvent}
              />
            </div>

            {categorizedReplays.map((group) => (
              <CategoryReplaySection key={group.id} group={group} />
            ))}
          </div>

          {/* Right Sidebar: Replay Suggestions + Ad */}
          <div className="lg:w-1/3 flex-shrink-0">
            <div className="sticky top-[180px]">
              {/* Adjust top based on header height */}
              <ReplaySuggestionsPanel
                replays={sidebarReplays}
                title="XEM LẠI BÓNG ĐÁ"
              />
              <div className="my-3">
                {/* Ad placeholder */}
                <img
                  src={belt_bottom_top}
                  alt="Ad Banner"
                  className="w-full rounded-md shadow"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReplayHubPage;
