import ReplayHubPage from "@/components/layout/ReplayHubPage";
import { useData } from "@/context/DataContext";
import * as React from "react";
import { FootballIcon } from "@/components/layout/Icon";
import { Replay } from "@/types/replay.types";
import { useParams } from "react-router-dom";

const Replay: React.FC = () => {
  const { replayData, fetchData, loading } = useData();

  const [replaySuggestions, setReplaySuggestions] = React.useState<Replay[]>(
    []
  );
  const { slug } = useParams();
  React.useEffect(() => {
    const loadMatchData = async () => {
      if (!replayData.length && !loading) {
        await fetchData();
      }
      const replay = replayData?.filter((r) => r.sport?.slug === slug) || [];
      setReplaySuggestions(replay);
    };
    loadMatchData();
  }, [slug, replayData, fetchData, loading]);

  const featuredBroadcasts = React.useMemo(() => {
    return replaySuggestions.map((replay) => ({
      id: replay._id || "",
      playerImage: replay.match?.homeTeam?.logo || "",
      playerName: replay.match?.homeTeam?.name || "",
      time:
        new Date(replay.publishDate || "").toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }) + " ---",
      opponentName: replay.match?.awayTeam?.name || "",
      commentator: replay.commentator || "",
    }));
  }, [replaySuggestions]);

  const highlightedEvent = React.useMemo(() => {
    const replay = replaySuggestions[0];
    if (!replay) return null;
    return {
      playerImages: [
        replay.match?.homeTeam?.logo || "",
        replay.match?.awayTeam?.logo || "",
        replay.thumbnail || "",
      ],
      replay: replay,
      description: `${replay?.title}`,
      commentatorInfo: `${replay.commentator} | ${new Date(
        replay.publishDate || ""
      ).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
      })}`,
      dateDisplay: new Date(replay.publishDate || "").toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "2-digit",
        }
      ),
    };
  }, [replaySuggestions]);

  const categorizedReplays = React.useMemo(() => {
    const categories: { [key: string]: Replay[] } = {};
    replaySuggestions.forEach((replay) => {
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
  }, [replaySuggestions]);

  const sidebarReplays = React.useMemo(() => {
    return replaySuggestions;
  }, [replaySuggestions]);

  if (loading) return <div>Loading...</div>;
  return (
    <ReplayHubPage
      featuredBroadcasts={featuredBroadcasts}
      highlightedEvent={highlightedEvent}
      categorizedReplays={categorizedReplays}
      sidebarReplays={sidebarReplays}
    />
  );
};

export default Replay;
