import { useState, useMemo } from "react";
import DateSelector from "@/components/layout/DateSelector";
import ResultsList from "@/components/layout/ResultsList";
import ReplaySuggestionsPanel from "@/components/layout/ReplaySuggestionsPanel";
import { DateTabInfo, LeagueSchedule, Replay } from "@/types/index.types";
import { HomeIconSolid, ChevronRightIcon } from "@/components/layout/Icon";
import * as React from "react";
import belt_bottom_top from "@/assets/user/1330t190.gif";

interface ResultsPageProps {
  availableDates: DateTabInfo[];
  initialSelectedDateId: string;
  resultsData: { [dateId: string]: LeagueSchedule[] }; // All results data keyed by dateId
  replayItems: Replay[];
}

const ResultsBreadcrumbs: React.FC = () => (
  <nav
    className="text-xs text-gray-400 mb-3 px-1 flex items-center space-x-1.5"
    aria-label="Breadcrumb"
  >
    <a href="#" className="hover:text-yellow-400 flex items-center">
      <HomeIconSolid className="w-3.5 h-3.5 mr-1" /> Trang chủ
    </a>
    <ChevronRightIcon className="w-3 h-3 text-gray-500" />
    <span className="text-gray-200 font-medium">Kết Quả Bóng Đá</span>
  </nav>
);

const ResultsPage: React.FC<ResultsPageProps> = ({
  availableDates,
  initialSelectedDateId,
  resultsData,
  replayItems,
}) => {
  const [selectedDateId, setSelectedDateId] = useState<string>(
    initialSelectedDateId
  );

  const currentResults = useMemo(() => {
    return resultsData[selectedDateId] || [];
  }, [selectedDateId, resultsData]);

  const selectedDateTab = useMemo(() => {
    return availableDates.find((d) => d.id === selectedDateId);
  }, [selectedDateId, availableDates]);

  const pageTitleDate = selectedDateTab?.isToday
    ? "HÔM NAY"
    : selectedDateTab?.dateSuffix;
  const pageTitle = `THAPCAM TV: KẾT QUẢ BÓNG ĐÁ ${
    pageTitleDate || ""
  } CẬP NHẬT MỚI NHẤT 24H`;
  const pageDescription = `Kết quả bóng đá ${
    pageTitleDate || ""
  } mới nhất được ThapCamTV cập nhật liên tục 24h. Các fan hâm mộ có thể theo dõi nhiều hơn nữa BXH các giải đấu cho tới giải to trên toàn thế giới tại ThapCamTV.`;

  return (
    <div className="container mx-auto max-w-screen-xl px-2 sm:px-4 py-4">
      <main className="w-full">
        <ResultsBreadcrumbs />
        <div className="bg-slate-800 p-4 rounded-lg shadow-xl mb-4">
          <h1 className="text-xl font-bold text-yellow-400 mb-1">
            {pageTitle}
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed">
            {pageDescription}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left Column: Date Selector + Results List */}
          <div className="lg:w-2/3 flex-shrink-0">
            <DateSelector
              dates={availableDates}
              selectedDateId={selectedDateId}
              onSelectDate={setSelectedDateId}
              activeTabStyle="results" // Use a specific style for results page
            />
            <ResultsList
              leagues={currentResults}
              selectedDateLabel={selectedDateTab?.label || "ngày này"}
            />
          </div>

          {/* Right Column: Replay Suggestions + Ad */}
          <div className="lg:w-1/3 flex-shrink-0">
            <div className="sticky top-[180px]">
              {" "}
              {/* Adjust top based on header height + main nav + sports nav */}
              <ReplaySuggestionsPanel
                replays={replayItems}
                title="XEM LẠI BÓNG ĐÁ"
              />
              <div className="my-3">
                {" "}
                {/* Ad placeholder */}
                <img
                  src={belt_bottom_top}
                  alt="Small Ad Banner"
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

export default ResultsPage;
