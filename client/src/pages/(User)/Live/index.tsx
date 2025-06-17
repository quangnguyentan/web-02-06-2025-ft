import MatchStreamPage from "@/components/layout/MatchStream";
import VerticalAdBanner from "@/components/layout/VerticalAdBanner";
import belt from "@/assets/user/160t1800.gif";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Match } from "@/types/match.types";
import { Replay } from "@/types/replay.types";
import { useData } from "@/context/DataContext";

const Live: React.FC = () => {
  const { slug } = useParams();
  const { matchData, replayData, fetchData } = useData();
  const [currentMatch, setCurrentMatch] = useState<Match>({});
  const [relatedMatches, setRelatedMatches] = useState<Match[]>([]);
  const [replaySuggestions, setReplaySuggestions] = useState<Replay[]>([]);

  useEffect(() => {
    const loadMatchData = async () => {
      console.log(matchData);
      if (!matchData.length || !replayData.length) {
        await fetchData(); // Chỉ gọi nếu chưa có dữ liệu
      }
      const match = matchData.find((m) => m.slug === slug) || {};
      setCurrentMatch(match);
      setRelatedMatches(matchData);
      setReplaySuggestions(replayData);
    };
    loadMatchData();
  }, [slug, matchData, replayData, fetchData]);

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
