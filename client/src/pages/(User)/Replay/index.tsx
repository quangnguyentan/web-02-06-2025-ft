import ReplayHubPage from "@/components/layout/ReplayHubPage";
import {
  mockFeaturedBroadcasts,
  mockHighlightedEventData,
  mockCategorizedReplays,
  mockSidebarReplaysForHub,
} from "@/data/mockReplayHubData";

import * as React from "react";

const Replay: React.FC = () => {
  return (
    <ReplayHubPage
      featuredBroadcasts={mockFeaturedBroadcasts}
      highlightedEvent={mockHighlightedEventData}
      categorizedReplays={mockCategorizedReplays}
      sidebarReplays={mockSidebarReplaysForHub}
    />
  );
};

export default Replay;
