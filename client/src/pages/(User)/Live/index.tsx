import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Match, MatchStatusType } from "@/types/match.types";
import { useData } from "@/context/DataContext";
import belt from "@/assets/user/160t1800.gif";
import * as React from "react";
import { formatDateFull } from "@/lib/helper";
import { Loader } from "@/components/layout/Loader";
import { UserInteractionProvider } from "@/context/UserInteractionContext";
// Lazy load components
const MatchStreamPage = React.lazy(
  () => import("@/components/layout/MatchStream")
);
const VerticalAdBanner = React.lazy(
  () => import("@/components/layout/VerticalAdBanner")
);

const Live: React.FC = () => {
  const { slug, slugSport } = useParams<{ slug: string; slugSport: string }>();
  const { matchData, replayData, fetchData, loading } = useData();
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const today = useMemo(() => new Date(), []);

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
    [matchData, slugSport, slug, today] // Added `today` to dependency array for correctness
  );

  const replaySuggestions = useMemo(
    () => replayData?.filter((replay) => replay?.sport?.slug === slugSport),
    [replayData, slugSport]
  );

  useEffect(() => {
    const loadMatchData = async () => {
      if (!matchData.length && !loading) {
        await fetchData();
      }
      const match = matchData.find((m) => m?.slug === slug) || null;
      setCurrentMatch(match);
    };
    loadMatchData();
  }, [slugSport, slug, matchData, fetchData, loading]); // Added `slug` to dependency array

  console.log(currentMatch);

  return (
    <React.Suspense fallback={<Loader />}>
      <div className="flex">
        <VerticalAdBanner position="left" imageUrl={belt} />
        {/* FIX: Conditionally render MatchStreamPage only if currentMatch is not null */}
        {currentMatch ? (
          <MatchStreamPage
            match={currentMatch} // TypeScript now knows currentMatch is definitely 'Match' here
            relatedMatches={relatedMatches}
            replaySuggestions={replaySuggestions}
            autoPlay={true}
          />
        ) : (
          <Loader />
        )}
        <VerticalAdBanner position="right" imageUrl={belt} />
      </div>
    </React.Suspense>
  );
};

export default Live;
