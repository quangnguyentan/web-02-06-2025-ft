import XoilacTvPage from "@/components/layout/XoilacTvPage";
import {
  mockSpotlightMatchesXoilac,
  mockFootballMatchesXoilac,
  mockTennisMatchesXoilac,
  mockBasketballMatchesXoilac,
  mockVolleyballMatchesXoilac,
} from "@/data/mockXoiLacTVData";
import * as React from "react";

const XoiLacTV: React.FC = () => {
  return (
    <XoilacTvPage
      spotlightMatches={mockSpotlightMatchesXoilac}
      footballMatches={mockFootballMatchesXoilac}
      tennisMatches={mockTennisMatchesXoilac}
      basketballMatches={mockBasketballMatchesXoilac}
      volleyballMatches={mockVolleyballMatchesXoilac}
    />
  );
};

export default XoiLacTV;
