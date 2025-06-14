import ResultsPage from "@/components/layout/ResultPage"; // New page for match results
import {
  mockDateTabsForResults,
  mockResultsData,
  mockReplayDataForResultsPage,
} from "@/data/mockResultsData";
import * as React from "react";

const Result: React.FC = () => {
  const initialDateId =
    mockDateTabsForResults.find((tab) => tab.isToday)?.id ||
    mockDateTabsForResults[mockDateTabsForResults.length - 1].id; // Default to latest available past date or today

  return (
    <ResultsPage
      availableDates={mockDateTabsForResults}
      initialSelectedDateId={initialDateId}
      resultsData={mockResultsData} // This would be { [dateId]: LeagueSchedule[] }
      replayItems={mockReplayDataForResultsPage}
    />
  );
};

export default Result;
