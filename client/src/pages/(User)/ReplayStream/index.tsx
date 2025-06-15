import ReplayStreamPage from "@/components/layout/ReplayStreamPage";
import {
  mockMainReplayItem,
  mockSidebarReplaysForStreamPage,
} from "@/data/mockStreamData";
import * as React from "react";

const ReplayStream: React.FC = () => {
  return (
    <div>
      <ReplayStreamPage
        mainReplay={mockMainReplayItem}
        suggestedReplays={mockSidebarReplaysForStreamPage}
      />
    </div>
  );
};

export default ReplayStream;
