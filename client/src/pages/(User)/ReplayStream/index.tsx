import { Replay } from "@/types/replay.types";
import * as React from "react";
import { useParams } from "react-router-dom";
import { useData } from "@/context/DataContext";
const ReplayStreamPage = React.lazy(
  () => import("@/components/layout/ReplayStreamPage")
);
const ReplayStream: React.FC = () => {
  const { slug } = useParams();
  const { replayData, fetchData } = useData();
  const [currentReplay, setCurrentReplay] = React.useState<Replay>({});
  const relatedReplays = React.useMemo(() => {
    return replayData.filter((r) => r._id !== slug) || [];
  }, [replayData, slug]);
  React.useEffect(() => {
    const loadReplayData = async () => {
      if (!replayData.length) {
        await fetchData(); // Chỉ gọi nếu chưa có dữ liệu
      }
      const replay = replayData.find((r) => r._id === slug) || {};
      setCurrentReplay(replay);
    };
    loadReplayData();
  }, [slug, replayData, fetchData]);

  return (
    <React.Suspense fallback={<div>Đang tải trang...</div>}>
      <div>
        <ReplayStreamPage
          mainReplay={currentReplay}
          suggestedReplays={relatedReplays}
        />
      </div>
    </React.Suspense>
  );
};

export default ReplayStream;
