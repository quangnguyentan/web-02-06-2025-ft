import { useState, useMemo } from "react";
import DateSelector from "@/components/layout/DateSelector";
import ResultsList from "@/components/layout/ResultsList";
import ReplaySuggestionsPanel from "@/components/layout/ReplaySuggestionsPanel";
import { DateTabInfo, LeagueSchedule } from "@/types/match.types";
import { HomeIconSolid, ChevronRightIcon } from "@/components/layout/Icon";
import * as React from "react";
import belt_bottom_top from "@/assets/user/1330t190.gif";
import { Replay } from "@/types/replay.types";

interface ResultsPageProps {
  availableDates: DateTabInfo[];
  initialSelectedDateId: string;
  resultsData: { [dateId: string]: LeagueSchedule[] }; // All results data keyed by dateId
  replayItems: Replay[];
  noMatchesMessage?: string;
}

const ResultsBreadcrumbs: React.FC = () => {
  const nameSlug = localStorage.getItem("selectedSportsNavbarPage");

  return (
    <nav
      className="text-xs text-gray-400 mb-3 px-1 flex items-center space-x-1.5"
      aria-label="Breadcrumb"
    >
      <a href="#" className="hover:text-yellow-400 flex items-center">
        <HomeIconSolid className="w-3.5 h-3.5 mr-1" /> Trang chủ
      </a>
      <ChevronRightIcon className="w-3 h-3 text-gray-500" />
      <span className="text-gray-200 font-medium">Kết Quả {nameSlug}</span>
    </nav>
  );
};

const ResultsPage: React.FC<ResultsPageProps> = ({
  availableDates,
  initialSelectedDateId,
  resultsData,
  replayItems,
  noMatchesMessage = "Không có trận nào",
}) => {
  const nameSlug = localStorage.getItem("selectedSportsNavbarPage");

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
  const pageTitle = `THAPCAM TV: KẾT QUẢ ${nameSlug} ${
    pageTitleDate ? pageTitleDate : ""
  } CẬP NHẬT MỚI NHẤT 24H`;
  const pageDescription = `Kết quả ${nameSlug} ${
    pageTitleDate ? pageTitleDate : ""
  } mới nhất được ThapCamTV cập nhật liên tục 24h. Các fan hâm mộ có thể theo dõi nhiều hơn nữa BXH các giải đấu cho tới giải to trên toàn thế giới tại ThapCamTV.`;

  return (
    <div className="lg:max-w-[1024px] xl:max-w-[1200px] 2xl:max-w-[1440px] lg:translate-x-0 xl:translate-x-[calc((100vw-1200px)/2)] 2xl:translate-x-[calc((100vw-1440px)/12)] 3xl:translate-x-[calc((100vw-1440px)/2)]">
      <main className="w-full py-2">
        <ResultsBreadcrumbs />
        <div className="flex flex-col lg:flex-row">
          {/* Left Column: Date Selector + Results List */}
          <div className="lg:w-3/4 flex-shrink-0 pr-2">
            <div className="p-4 rounded-lg mb-4">
              <h1 className="text-xl font-bold text-blue-400 mb-1">
                {pageTitle}
              </h1>
              <p className="text-sm text-gray-300 leading-relaxed">
                {pageDescription}
              </p>
            </div>
            <DateSelector
              dates={availableDates}
              selectedDateId={selectedDateId}
              onSelectDate={setSelectedDateId}
              activeTabStyle="results" // Use a specific style for results page
            />
            <ResultsList
              leagues={currentResults}
              selectedDateLabel={selectedDateTab?.label || "ngày này"}
              noMatchesMessage={noMatchesMessage}
            />
          </div>

          {/* Right Column: Replay Suggestions + Ad */}
          <div className="lg:w-1/4 flex-shrink-0">
            <div>
              <ReplaySuggestionsPanel
                replays={replayItems}
                title="XEM LẠI BÓNG ĐÁ"
                titleHidden
              />
              <div className="my-3">
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
