import ReplayStreamPage from "@/components/layout/ReplayStreamPage";
import { apiGetReplayBySlug } from "@/services/replay.services";
import { Replay } from "@/types/replay.types";
import * as React from "react";
import { useParams } from "react-router-dom";
import { useData } from "@/context/DataContext";

const ReplayStream: React.FC = () => {
  const { slug } = useParams();
  const { replayData, fetchData } = useData();
  const [currentReplay, setCurrentReplay] = React.useState<Replay>({});
  const [relatedReplays, setRelatedReplays] = React.useState<Replay[]>([]);

  React.useEffect(() => {
    const loadReplayData = async () => {
      if (!replayData.length) {
        await fetchData(); // Chỉ gọi nếu chưa có dữ liệu
      }
      const replay = replayData.find((r) => r._id === slug) || {};
      setCurrentReplay(replay);
      setRelatedReplays(replayData.filter((r) => r._id !== replay._id) || []);
    };
    loadReplayData();
  }, [slug, replayData, fetchData]);

  return (
    <div>
      <ReplayStreamPage
        mainReplay={currentReplay}
        suggestedReplays={relatedReplays}
      />
    </div>
  );
};

export default ReplayStream;
