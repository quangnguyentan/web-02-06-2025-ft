import MatchStreamPage from "@/components/layout/MatchStream";
import VerticalAdBanner from "@/components/layout/VerticalAdBanner";
import belt from "@/assets/user/160t1800.gif";
import { useEffect, useState } from "react";
import { apiGetAllMatches, apiGetMatchBySlug } from "@/services/match.services";
import { useParams } from "react-router-dom";
import { Match } from "@/types/match.types";
import { Replay } from "@/types/replay.types";
import { apiGetAllReplays } from "@/services/replay.services";

const Live: React.FC = () => {
  const { slug } = useParams();
  const [currentMatch, setCurrentMatch] = useState<Match>({});
  const [relatedMatches, setRelatedMatches] = useState<Match[]>([]);
  const [replaySuggestions, setReplaySuggestions] = useState<Replay[]>([]);

  const fetchMatchRelatedData = async (slug) => {
    const [matchResSlug, matchesRes, replayRes] = await Promise.all([
      apiGetMatchBySlug(slug),
      apiGetAllMatches(),
      apiGetAllReplays(),
    ]);

    const allLeagueSlug = matchResSlug.data ?? {};
    const allLeagues = matchesRes.data ?? [];
    const allReplay = replayRes.data ?? [];

    setCurrentMatch(allLeagueSlug);
    setRelatedMatches(allLeagues);
    setReplaySuggestions(allReplay);
  };

  useEffect(() => {
    fetchMatchRelatedData(slug);
  }, [slug]);
  return (
    <div>
      <VerticalAdBanner position="left" imageUrl={belt} />
      <VerticalAdBanner position="right" imageUrl={belt} />
      <MatchStreamPage
        match={currentMatch}
        relatedMatches={relatedMatches}
        replaySuggestions={replaySuggestions}
      />
    </div>
  );
};

export default Live;
