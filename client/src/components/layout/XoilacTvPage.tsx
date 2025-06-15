import HeroSection from "@/components/layout/HeroSection";
import SportSection from "@/components/layout/SportSection";
import HorizontalAdBanner from "@/components/layout/HorizontalAdBanner";
import {
  HomeIconSolid,
  ChevronRightIcon,
  StarIcon,
  FootballIcon,
  TennisIcon,
  BasketballIcon,
  VolleyballIcon,
} from "@/components/layout/Icon";
import * as React from "react";
import { Match } from "@/types/match.types";

interface XoilacTvPageProps {
  spotlightMatches: Match[];
  footballMatches: Match[];
  tennisMatches: Match[];
  basketballMatches: Match[];
  volleyballMatches: Match[];
}

const XoilacTvBreadcrumbs: React.FC = () => (
  <nav
    className="text-xs text-gray-400 mb-3 px-1 flex items-center space-x-1.5 pt-2"
    aria-label="Breadcrumb"
  >
    <a href="#" className="hover:text-yellow-400 flex items-center">
      <HomeIconSolid className="w-3.5 h-3.5 mr-1" /> Trang chủ
    </a>
    <ChevronRightIcon className="w-3 h-3 text-gray-500" />
    <span className="text-gray-200 font-medium">Xoilac.TV</span>
  </nav>
);

const XoilacTvPage: React.FC<XoilacTvPageProps> = ({
  spotlightMatches,
  footballMatches,
  tennisMatches,
  basketballMatches,
  volleyballMatches,
}) => {
  const introText =
    "XOILAC TV xem trực tiếp bóng đá online nhanh nhất. Xem XoilacTV là kênh cập nhật link xem trực tiếp bóng đá, bóng chuyền, bóng rổ và các môn Thể thao khác cho Fan hâm mộ Việt Nam và Quốc tế với tốc độ Internet. Xem thể thao trực tuyến với tiền thân Xoilac TV chất lượng cao không giật lag.";
  const titleText =
    "THAPCAM TV xem trực tiếp bóng đá, bóng rổ, bóng chuyền, tennis online nhanh nhất - Thập Cẩm TV";
  return (
    <main
      className="lg:max-w-[1024px]
    xl:max-w-[1200px]
    2xl:max-w-[1440px]

    lg:translate-x-0
    xl:translate-x-[calc((100vw-1200px)/2)]
    2xl:translate-x-[calc((100vw-1440px)/2)]"
    >
      {/* Margin to avoid overlap with side ads */}
      <XoilacTvBreadcrumbs />
      <HeroSection />
      <div className="px-4 rounded-lg shadow text-center space-y-4 mt-1">
        <p className="text-sm sm:text-lg md:text-xl text-gray-200 font-semibold  mx-auto drop-shadow">
          {titleText}
        </p>
        <p className="text-sm text-gray-300 leading-relaxed">{introText}</p>
      </div>
      <HorizontalAdBanner />
      <SportSection
        title="TÂM ĐIỂM THỂ THAO"
        icon={<StarIcon className="w-5 h-5 text-yellow-400" />}
        matches={spotlightMatches}
        isSpotlight={true}
        titleClassName="text-lg md:text-xl font-bold text-yellow-400 uppercase"
      />
      <HorizontalAdBanner />
      <SportSection
        title="BÓNG ĐÁ"
        icon={<FootballIcon className="w-5 h-5 text-green-400" />}
        matches={footballMatches}
        viewAllUrl="#"
      />
      <HorizontalAdBanner />
      <SportSection
        title="TENNIS"
        icon={<TennisIcon className="w-5 h-5 text-lime-400" />}
        matches={tennisMatches}
        viewAllUrl="#"
      />
      <HorizontalAdBanner />
      <SportSection
        title="BÓNG RỔ"
        icon={<BasketballIcon className="w-5 h-5 text-orange-400" />}
        matches={basketballMatches}
        viewAllUrl="#"
      />
      <HorizontalAdBanner />
      <SportSection
        title="BÓNG CHUYỀN"
        icon={<VolleyballIcon className="w-5 h-5 text-sky-400" />}
        matches={volleyballMatches}
        viewAllUrl="#"
      />
      <HorizontalAdBanner />
    </main>
  );
};

export default XoilacTvPage;
