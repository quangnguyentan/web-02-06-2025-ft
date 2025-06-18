import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Replay } from "@/types/replay.types";
import { useData } from "@/context/DataContext";
import * as React from "react";
import { useSelectedPageContext } from "@/hooks/use-context";
import { FootballIcon } from "@/components/layout/Icon";

const ReplayStreamPage = React.lazy(
  () => import("@/components/layout/ReplayStreamPage")
);

const ReplayStream: React.FC = () => {
  const { slug } = useParams<{ slug: string }>(); // Use slug since route is /xem-lai/:slug
  const { replayData, fetchData, loading } = useData();
  const { selectedSportsNavbarPage } = useSelectedPageContext();
  const [currentReplay, setCurrentReplay] = useState<Replay | null>(null);
  const relatedReplays = useMemo(
    () =>
      replayData.filter(
        (r) => r.title !== slug && r.sport?.name === selectedSportsNavbarPage
      ),
    [replayData, slug, selectedSportsNavbarPage]
  );

  useEffect(() => {
    const loadReplayData = async () => {
      if (!replayData.length && !loading) {
        await fetchData();
      }
      const replay = replayData.find((r) => r.title === slug) || null;
      setCurrentReplay(replay);
    };

    loadReplayData();
  }, [slug, replayData, fetchData, loading]);
  const categorizedReplays = React.useMemo(() => {
    const categories: { [key: string]: Replay[] } = {};
    relatedReplays?.forEach((replay) => {
      const sportName = replay.sport?.name || "Uncategorized";
      if (!categories[sportName]) {
        categories[sportName] = [];
      }
      categories[sportName].push(replay);
    });

    return Object.entries(categories).map(([title, replays]) => ({
      id: title.toLowerCase().replace(/\s+/g, "-"),
      title: title,
      icon: React.createElement(FootballIcon, {
        className: "w-5 h-5 text-green-400",
      }),
      replays: replays,
      viewAllUrl: "#",
    }));
  }, [relatedReplays]);
  if (loading || !currentReplay) {
    return <div>Loading replay...</div>;
  }

  return (
    <React.Suspense fallback={<div>Loading page...</div>}>
      <ReplayStreamPage
        mainReplay={currentReplay}
        categorizedReplays={categorizedReplays}
        suggestedReplays={relatedReplays}
      />
    </React.Suspense>
  );
};

export default ReplayStream;
