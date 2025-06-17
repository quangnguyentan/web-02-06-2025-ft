import XoilacTvPage from "@/components/layout/XoilacTvPage";
import { useData } from "@/context/DataContext";
import { MatchStatusType } from "@/types/match.types";
import * as React from "react";

const XoiLacTV: React.FC = () => {
  const { matchData, replayData, loading } = useData();
  const today = new Date();
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const adjustToVietnamTime = (date: Date): Date => {
    const vietnamDate = new Date(date);
    vietnamDate.setHours(vietnamDate.getHours() + 7); // Điều chỉnh từ UTC sang UTC+07:00
    return vietnamDate;
  };

  const spotlightMatches = React.useMemo(() => {
    return matchData.filter((match) => {
      if (!match?.startTime) return false;
      const matchDate = adjustToVietnamTime(new Date(match.startTime));
      const matchDay = formatDate(matchDate);
      const todayDay = formatDate(today);
      return (
        match?.isHot &&
        match?.status !== MatchStatusType.FINISHED &&
        match?.status !== MatchStatusType.CANCELLED &&
        matchDay === todayDay
      );
    });
  }, [matchData]);

  const footballMatches = React.useMemo(() => {
    return matchData.filter((match) => {
      if (!match?.startTime) return false;
      const matchDate = adjustToVietnamTime(new Date(match.startTime));
      const matchDay = formatDate(matchDate);
      const todayDay = formatDate(today);
      return (
        match.sport.slug === "football" &&
        match?.status !== MatchStatusType.FINISHED &&
        match?.status !== MatchStatusType.CANCELLED &&
        matchDay === todayDay
      );
    });
  }, [matchData]);

  const tennisMatches = React.useMemo(() => {
    return matchData.filter((match) => {
      if (!match?.startTime) return false;
      const matchDate = adjustToVietnamTime(new Date(match.startTime));
      const matchDay = formatDate(matchDate);
      const todayDay = formatDate(today);
      return (
        match.sport.slug === "tennis" &&
        match?.status !== MatchStatusType.FINISHED &&
        match?.status !== MatchStatusType.CANCELLED &&
        matchDay === todayDay
      );
    });
  }, [matchData]);

  const basketballMatches = React.useMemo(() => {
    return matchData.filter((match) => {
      if (!match?.startTime) return false;
      const matchDate = adjustToVietnamTime(new Date(match.startTime));
      const matchDay = formatDate(matchDate);
      const todayDay = formatDate(today);
      return (
        match.sport.slug === "basketball" &&
        match?.status !== MatchStatusType.FINISHED &&
        match?.status !== MatchStatusType.CANCELLED &&
        matchDay === todayDay
      );
    });
  }, [matchData]);
  const volleyballMatches = React.useMemo(() => {
    return matchData.filter((match) => {
      if (!match?.startTime) return false;
      const matchDate = adjustToVietnamTime(new Date(match.startTime));
      const matchDay = formatDate(matchDate);
      const todayDay = formatDate(today);
      return (
        match.sport.slug === "volleyball" &&
        match?.status !== MatchStatusType.FINISHED &&
        match?.status !== MatchStatusType.CANCELLED &&
        matchDay === todayDay
      );
    });
  }, [matchData]);
  if (loading) return <div>Loading...</div>;

  return (
    <XoilacTvPage
      spotlightMatches={spotlightMatches}
      footballMatches={footballMatches}
      tennisMatches={tennisMatches}
      basketballMatches={basketballMatches}
      volleyballMatches={volleyballMatches}
    />
  );
};

export default XoiLacTV;
