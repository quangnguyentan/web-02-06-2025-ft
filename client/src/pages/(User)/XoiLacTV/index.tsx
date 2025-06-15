import XoilacTvPage from "@/components/layout/XoilacTvPage";
import { apiGetAllMatches } from "@/services/match.services";
import { Match } from "@/types/match.types";
import * as React from "react";

const XoiLacTV: React.FC = () => {
  const [matchData, setMatchData] = React.useState<Match[]>([]);
  const spotlightMatchesXoilac = React.useMemo(() => {
    return matchData.filter((match) => match?.isHot);
  }, [matchData]);
  const footballMatchesXoilac = React.useMemo(() => {
    return matchData.filter((match) => match.sport.slug === "football");
  }, [matchData]);
  const tennisMatchesXoilac = React.useMemo(() => {
    return matchData.filter((match) => match.sport.slug === "tennis");
  }, [matchData]);
  const basketballMatchesXoilac = React.useMemo(() => {
    return matchData.filter((match) => match.sport.slug === "basketball");
  }, [matchData]);
  const volleyballMatchesXoilac = React.useMemo(() => {
    return matchData.filter((match) => match.sport.slug === "volleyball");
  }, [matchData]);
  const fetchMatchRelatedData = async () => {
    const [matchesRes] = await Promise.all([apiGetAllMatches()]);

    const allMatch = matchesRes.data || [];
    setMatchData(allMatch);
  };

  React.useEffect(() => {
    fetchMatchRelatedData();
  }, []);
  return (
    <XoilacTvPage
      spotlightMatches={spotlightMatchesXoilac}
      footballMatches={footballMatchesXoilac}
      tennisMatches={tennisMatchesXoilac}
      basketballMatches={basketballMatchesXoilac}
      volleyballMatches={volleyballMatchesXoilac}
    />
  );
};

export default XoiLacTV;
