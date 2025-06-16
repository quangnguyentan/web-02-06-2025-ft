// src/pages/Replay.tsx
import ReplayHubPage from "@/components/layout/ReplayHubPage";
import { apiGetAllReplays } from "@/services/replay.services";
import { Replay } from "@/types/replay.types";
import * as React from "react";
import { FootballIcon } from "@/components/layout/Icon"; // Import FootballIcon for categorization

const Replay: React.FC = () => {
  const [replayItems, setReplayItems] = React.useState<Replay[]>([]);

  // Fetch real replay data
  const fetchMatchRelatedData = async () => {
    try {
      const replayRes = await apiGetAllReplays();
      const allReplay = replayRes.data ?? [];
      setReplayItems(allReplay);
    } catch (error) {
      console.error("Error fetching replay data:", error);
      setReplayItems([]); // Fallback to empty array on error
    }
  };

  React.useEffect(() => {
    fetchMatchRelatedData();
  }, []);

  // Transform replayItems into featured broadcasts
  const featuredBroadcasts = React.useMemo(() => {
    return replayItems.map((replay) => ({
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
  }, [replayItems]);

  // Transform replayItems into highlighted event
  const highlightedEvent = React.useMemo(() => {
    const replay = replayItems[0];
    if (!replay) return null;
    return {
      playerImages: [
        replay.match?.homeTeam?.logo || "",
        replay.match?.awayTeam?.logo || "",
        replay.thumbnail || "",
      ],
      replay: replay,
      description: `${replay.match?.title}`,
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
  }, [replayItems]);

  // Transform replayItems into categorized replays
  const categorizedReplays = React.useMemo(() => {
    const categories: { [key: string]: Replay[] } = {};
    replayItems.forEach((replay) => {
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
      }), // Default icon, can be customized per sport
      replays: replays, // Use raw Replay objects
      viewAllUrl: "#",
    }));
  }, [replayItems]);

  // Use all replayItems for sidebar
  const sidebarReplays = React.useMemo(() => {
    return replayItems; // Use raw Replay objects
  }, [replayItems]);

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
