import ReplayStreamPage from "@/components/layout/ReplayStreamPage";
import {
  apiGetAllReplays,
  apiGetReplayBySlug,
} from "@/services/replay.services";
import { Replay } from "@/types/replay.types";
import * as React from "react";
import { useParams } from "react-router-dom";

const ReplayStream: React.FC = () => {
  const { slug } = useParams();
  const [currentReplay, setCurrentReplay] = React.useState<Replay>({});
  const [relatedReplays, setRelatedReplays] = React.useState<Replay[]>([]);
  const fetchMatchRelatedData = async (slug) => {
    const [replayRes, replayRelated] = await Promise.all([
      apiGetReplayBySlug(slug),
      apiGetAllReplays(),
    ]);

    const getReplay = replayRes.data ?? {};
    const allReplayRelated = replayRelated.data ?? [];

    setCurrentReplay(getReplay);
    setRelatedReplays(allReplayRelated);
  };
  React.useEffect(() => {
    fetchMatchRelatedData(slug);
  }, [slug]);
  return (
    <div>
      <ReplayStreamPage
        mainReplay={currentReplay}
        suggestedReplays={
          relatedReplays?.filter(
            (replay) => replay?._id !== currentReplay?._id
          ) || []
        }
      />
    </div>
  );
};

export default ReplayStream;
