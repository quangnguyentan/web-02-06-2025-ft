import SchedulePage from "@/components/layout/SchedulePage"; // New page for match schedule
import {
  mockDateTabs,
  mockScheduleData,
  mockReplayDataForSchedule,
} from "@/data/mockScheduleData";
import * as React from "react";

const Schedule: React.FC = () => {
  const initialDateId =
    mockDateTabs.find((tab) => tab.isToday)?.id || mockDateTabs[0].id;

  return (
    <SchedulePage
      availableDates={mockDateTabs}
      initialSelectedDateId={initialDateId}
      scheduleData={mockScheduleData} // This would be { [dateId]: LeagueSchedule[] }
      replayItems={mockReplayDataForSchedule}
    />
  );
};

export default Schedule;
