import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Replay } from "@/types/replay.types";
import { useData } from "@/context/DataContext";
import * as React from "react";
import { useSelectedPageContext } from "@/hooks/use-context";
import {
  FootballIcon,
  BasketballIcon,
  TennisIcon,
  EventsIcon,
} from "@/components/layout/Icon";
import { Loader } from "@/components/layout/Loader";

const ReplayStreamPage = React.lazy(
  () => import("@/components/layout/ReplayStreamPage")
);

const ReplayStream: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { replayData, loading, error } = useData();
  const { selectedSportsNavbarPage } = useSelectedPageContext();
  console.log(selectedSportsNavbarPage);
  const currentReplay = useMemo(() => {
    if (error || !replayData.length) {
      return null;
    }
    return replayData.find((r) => r.title === slug) || null;
  }, [replayData, slug, error]);

  const relatedReplays = useMemo(
    () =>
      replayData.filter(
        (r) => r.title !== slug && r.sport?.name === selectedSportsNavbarPage
      ),
    [replayData, slug, selectedSportsNavbarPage]
  );

  const categorizedReplays = React.useMemo(() => {
    const categories: { [key: string]: Replay[] } = {};
    relatedReplays?.forEach((replay) => {
      const sportName = replay.sport?.name || "Khác";
      if (!categories[sportName]) {
        categories[sportName] = [];
      }
      categories[sportName].push(replay);
    });

    return Object.entries(categories).map(([title, replays]) => {
      let IconComponent: React.ElementType = FootballIcon;
      switch (title.toLowerCase()) {
        case "football":
          IconComponent = FootballIcon;
          break;
        case "basketball":
          IconComponent = BasketballIcon;
          break;
        case "tennis":
          IconComponent = TennisIcon;
          break;
        default:
          IconComponent = EventsIcon;
          break;
      }

      return {
        id: title.toLowerCase().replace(/\s+/g, "-"),
        title: title,
        icon: React.createElement(IconComponent, {
          className: "w-5 h-5 text-green-400",
        }),
        replays: replays,
        viewAllUrl: "#",
      };
    });
  }, [relatedReplays]);

  if (loading && !replayData.length) {
    return <Loader />;
  }

  if (error) {
    return <Loader />;
  }

  if (!currentReplay) {
    return <Loader />;
  }
  return (
    <React.Suspense fallback={<Loader />}>
      <ReplayStreamPage
        mainReplay={currentReplay}
        categorizedReplays={categorizedReplays}
        suggestedReplays={relatedReplays}
      />
    </React.Suspense>
  );
};

export default ReplayStream;
