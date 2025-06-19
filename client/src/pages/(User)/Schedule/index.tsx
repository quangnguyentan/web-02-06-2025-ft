import SchedulePage from "@/components/layout/SchedulePage";
import { useScheduleData, formatDate } from "@/data/mockScheduleData";
import { useData } from "@/context/DataContext";
import * as React from "react";
import { useParams } from "react-router-dom";
import { Replay } from "@/types/replay.types";
import { Match } from "@/types/match.types";

const today = new Date();

const Schedule: React.FC = () => {
  // Loại bỏ fetchData ở đây vì nó không còn được gọi trực tiếp trong component này.
  const { matchData, replayData, loading, error } = useData();
  const { slug } = useParams();

  // Lấy dữ liệu giả lập từ useScheduleData (chỉ gọi một lần)
  const { scheduleData: mockScheduleData } = useScheduleData([]);
  const mockReplayData: Replay[] = React.useMemo(() => [], []); // Dữ liệu giả lập cho replay, memoize rỗng

  // Lấy tất cả Match từ mockScheduleData và memoize
  const allMockMatches = React.useMemo(() => {
    return Object.values(mockScheduleData)
      .flat()
      .flatMap((league: any) => league.matches);
  }, [mockScheduleData]);

  // Tính toán currentMatch bằng useMemo, giống cách Home lọc dữ liệu
  const currentMatch = React.useMemo(() => {
    // Nếu không có dữ liệu thực hoặc có lỗi, dùng dữ liệu giả lập
    if (!matchData.length || error) {
      return allMockMatches.filter((m) => m.sport?.slug === slug);
    } else {
      // Ngược lại, dùng dữ liệu thực
      return matchData.filter((m) => m.sport?.slug === slug) || [];
    }
  }, [matchData, error, allMockMatches, slug]); // Dependencies: chỉ tính lại khi các giá trị này thay đổi

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

  // Gọi useScheduleData trực tiếp ở cấp cao nhất của component.
  // Hook này sẽ tự động re-run khi `currentMatch` thay đổi.
  const { dateTabs, scheduleData } = useScheduleData(currentMatch);

  const initialDateId = formatDate(today);

  // Hiển thị thông báo lỗi nếu có
  if (error) {
    return <div>Error loading data. Displaying mock data.</div>;
  }

  // Chỉ hiển thị loading khi đang fetch lần đầu và chưa có dữ liệu
  if (loading && !matchData.length && !replayData.length) {
    return <div>Loading...</div>;
  }

  return (
    <SchedulePage
      availableDates={dateTabs}
      initialSelectedDateId={initialDateId}
      scheduleData={scheduleData}
      replayItems={replaySuggestions}
    />
  );
};

export default Schedule;
