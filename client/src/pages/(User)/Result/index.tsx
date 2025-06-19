import ResultsPage from "@/components/layout/ResultPage";
import { useScheduleDataForResults, formatDate } from "@/data/mockResultsData";
import { useData } from "@/context/DataContext";
import * as React from "react";
import {
  mockDateTabsForResults,
  mockResultsData,
} from "@/data/mockResultsData";
import { Match, MatchStatusType } from "@/types/match.types";
import { useParams } from "react-router-dom";
import { Replay } from "@/types/replay.types";

const today = new Date();

const Result: React.FC = () => {
  // Loại bỏ fetchData ở đây vì nó không còn được gọi trực tiếp trong component này.
  const { matchData, replayData, loading, error } = useData();
  const { slug } = useParams();

  // Dữ liệu giả lập cho kết quả (nếu có trong mockResultsData)
  // Giả sử useScheduleDataForResults([]) trả về một cấu trúc tương tự mockResultsData cho trường hợp không có dữ liệu
  const { scheduleData: mockScheduleDataForResults } =
    useScheduleDataForResults([]);
  const mockReplayData: Replay[] = React.useMemo(() => [], []); // Dữ liệu giả lập cho replay, memoize rỗng

  // Lọc dữ liệu trận đấu dựa trên slug và trạng thái, sử dụng useMemo
  const currentMatchResults = React.useMemo(() => {
    let matchesToFilter: Match[] = [];

    if (!matchData.length || error) {
      matchesToFilter = Array.isArray(mockResultsData)
        ? (mockResultsData as Match[])
        : []; // Fallback to empty array if not directly usable
    } else {
      matchesToFilter = matchData;
    }

    // Lọc trận đấu theo slug và trạng thái hoàn thành/đang trực tiếp
    return matchesToFilter.filter((m) => {
      const matchDate = new Date(m.startTime);
      return (
        m.sport?.slug === slug &&
        !isNaN(matchDate.getTime()) &&
        (m.status === MatchStatusType.FINISHED ||
          m.status === MatchStatusType.LIVE)
      );
    });
  }, [matchData, error, slug]); // Dependencies: chỉ tính lại khi các giá trị này thay đổi

  // Tính toán replaySuggestions bằng useMemo
  const replaySuggestions = React.useMemo(() => {
    // Nếu không có dữ liệu thực hoặc có lỗi, dùng dữ liệu giả lập
    if (!replayData.length || error) {
      return mockReplayData;
    } else {
      // Ngược lại, dùng dữ liệu thực
      return replayData.filter((r) => r.sport?.slug === slug) || [];
    }
  }, [replayData, error, mockReplayData, slug]); // Dependencies: chỉ tính lại khi các giá trị này thay đổi

  // Gọi useScheduleDataForResults trực tiếp ở cấp cao nhất của component.
  // Hook này sẽ tự động re-run khi `currentMatchResults` thay đổi.
  const { dateTabs, scheduleData } =
    useScheduleDataForResults(currentMatchResults);

  // Tính toán initialDateId
  const initialDateId = React.useMemo(() => {
    return (
      dateTabs.find((tab) => tab.isToday)?.id ||
      dateTabs.find((tab) => tab.id !== "live")?.id ||
      formatDate(today)
    );
  }, [dateTabs]); // Chỉ tính toán lại khi dateTabs thay đổi

  // Hiển thị thông báo lỗi nếu có
  if (error) {
    return <div>Error loading data. Displaying mock data.</div>;
  }

  // Chỉ hiển thị loading khi đang fetch lần đầu và chưa có dữ liệu
  if (loading && !matchData.length && !replayData.length) {
    return <div>Loading...</div>;
  }

  return (
    <ResultsPage
      availableDates={dateTabs.length > 0 ? dateTabs : mockDateTabsForResults}
      initialSelectedDateId={initialDateId}
      resultsData={scheduleData || mockResultsData}
      replayItems={replaySuggestions}
      noMatchesMessage="Không có trận nào"
    />
  );
};

export default Result;
