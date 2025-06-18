import { useState, useMemo } from "react";
import DateSelector from "@/components/layout/DateSelector";
import MatchList from "@/components/layout/MatchList";
import ReplaySuggestionsPanel from "@/components/layout/ReplaySuggestionsPanel";
import { DateTabInfo, LeagueSchedule } from "@/types/match.types";
import { HomeIconSolid, ChevronRightIcon } from "@/components/layout/Icon";
import * as React from "react";
import belt_bottom_top from "@/assets/user/1330t190.gif";
import { Replay } from "@/types/replay.types";
import { capitalizeFirstLetter } from "@/lib/helper";

interface SchedulePageProps {
  isHideBreadcrumbs?: boolean;
  availableDates: DateTabInfo[];
  initialSelectedDateId: string;
  scheduleData: { [dateId: string]: LeagueSchedule[] };
  replayItems: Replay[];
}

const ScheduleBreadcrumbs: React.FC = () => {
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
      <span className="text-gray-200 font-medium">Lịch Thi Đấu {nameSlug}</span>
    </nav>
  );
};

const SchedulePage: React.FC<SchedulePageProps> = ({
  isHideBreadcrumbs,
  availableDates,
  initialSelectedDateId,
  scheduleData,
  replayItems,
}) => {
  const [selectedDateId, setSelectedDateId] = useState<string>(
    initialSelectedDateId
  );

  const currentMatches = useMemo(() => {
    return scheduleData[selectedDateId] || [];
  }, [selectedDateId, scheduleData]);
  const nameSlug = localStorage.getItem("selectedSportsNavbarPage");
  const selectedDateTab = useMemo(() => {
    return availableDates.find((d) => d.id === selectedDateId);
  }, [selectedDateId, availableDates]);
  const pageTitle = `Lịch Thi Đấu ${nameSlug} ${
    selectedDateTab?.dateSuffix || ""
  } Cập Nhật Mới Nhất 24H - Thập Cẩm TV`;
  const pageDescription = `Lịch trực tiếp ${nameSlug} ${
    selectedDateTab?.dateSuffix || ""
  } mới nhất được ThapCamTV cập nhật liên tục 24h. Các fan hâm mộ có thể theo dõi nhiều hơn nữa BXH các giải đấu cho tới giải to trên toàn thế giới tại ThapCamTV.`;
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
      <main className="w-full py-2">
        {isHideBreadcrumbs ? null : <ScheduleBreadcrumbs />}

        <div className="flex flex-col lg:flex-row">
          {/* Left Column: Date Selector + Match List */}
          <div className="w-full lg:w-3/4 pr-2 flex-shrink-0">
            <div className="p-3 sm:p-4 rounded-lg mb-4">
              <h1 className="text-lg sm:text-xl font-bold text-blue-400 mb-1">
                {capitalizeFirstLetter(pageTitle)}
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {capitalizeFirstLetter(pageDescription)}
              </p>
            </div>
            <DateSelector
              dates={availableDates}
              selectedDateId={selectedDateId}
              onSelectDate={setSelectedDateId}
            />
            <MatchList
              leagues={currentMatches}
              selectedDateLabel={selectedDateTab?.label || "ngày này"}
            />
          </div>

          {/* Right Column: Replay Suggestions */}
          <div className="w-full lg:w-1/4 flex-shrink-0 mt-4 lg:mt-0">
            <div>
              <ReplaySuggestionsPanel
                replays={replayItems}
                title={`XEM LẠI ${replayItems[0]?.sport?.name?.toUpperCase()}`}
                titleHidden
              />
            </div>
          </div>
        </div>
        <div className="py-3">
          <img
            src={belt_bottom_top}
            alt="Small Ad Banner"
            className="w-full rounded-md shadow"
          />
        </div>
      </main>
    </div>
  );
};

export default SchedulePage;
