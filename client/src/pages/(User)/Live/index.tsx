import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Match, MatchStatusType } from "@/types/match.types";
import { useData } from "@/context/DataContext";
import belt from "@/assets/user/160t1800.gif";
import * as React from "react";
import { formatDateFull } from "@/lib/helper";

// Lazy load components
const MatchStreamPage = React.lazy(
  () => import("@/components/layout/MatchStream")
);
const VerticalAdBanner = React.lazy(
  () => import("@/components/layout/VerticalAdBanner")
);

const Live: React.FC = () => {
  const { slug, slugSport } = useParams<{ slug: string; slugSport: string }>(); // Type the params
  const { matchData, replayData, fetchData, loading } = useData();
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const today = useMemo(() => new Date(), []);
  // Memoize related matches and replay suggestions
  const relatedMatches = useMemo(
    () =>
      matchData?.filter((m) => {
        if (!m?.startTime) return false;
        const matchDate = new Date(m?.startTime);
        const matchDay = formatDateFull(matchDate);
        const todayDay = formatDateFull(today);
        return (
          m?.sport?.slug === slugSport &&
          m?.slug !== slug &&
          m?.status !== MatchStatusType.FINISHED &&
          m?.status !== MatchStatusType.CANCELLED &&
          matchDay === todayDay
        );
      }),
    [matchData, slugSport, slug]
  );
  const replaySuggestions = useMemo(
    () => replayData?.filter((replay) => replay?.sport?.slug === slugSport),
    [replayData, slugSport]
  );
  useEffect(() => {
    const loadMatchData = async () => {
      if (!matchData.length && !loading) {
        await fetchData(); // Fetch only if no data and not loading
      }
      const match = matchData.find((m) => m?.slug === slug) || null;
      setCurrentMatch(match);
    };
    loadMatchData();
  }, [slugSport, matchData, fetchData, loading]);
  console.log(currentMatch);
  return (
    <React.Suspense fallback={<div>Loading page...</div>}>
      <div className="flex">
        <VerticalAdBanner position="left" imageUrl={belt} />
        <MatchStreamPage
          match={currentMatch}
          relatedMatches={relatedMatches}
          replaySuggestions={replaySuggestions}
        />
        <VerticalAdBanner position="right" imageUrl={belt} />
      </div>
    </React.Suspense>
  );
};

export default Live;
