import ReplayStreamPage from "@/components/layout/ReplayStreamPage";
import {
  mockMainReplayItem,
  mockSidebarReplaysForStreamPage,
} from "@/data/mockStreamData";
import * as React from "react";

const ReplayStream: React.FC = () => {
  return (
    <div className="container mx-auto max-w-screen-xl px-2 sm:px-4 py-3 relative">
      <ReplayStreamPage
        mainReplay={mockMainReplayItem}
        suggestedReplays={mockSidebarReplaysForStreamPage}
      />
    </div>
  );
};

export default ReplayStream;
