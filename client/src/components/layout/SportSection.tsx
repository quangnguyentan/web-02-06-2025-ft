import MatchCard from "./MatchCard";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icon";
import * as React from "react";
import SpotlightMatchCard from "./SpotlightMatchCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Match } from "@/types/match.types";

interface SportSectionProps {
  isSportSection?;
  title: string;
  icon?: React.ReactNode;
  matches: Match[];
  viewAllUrl?: string;
  isSpotlight?: boolean;
  titleClassName?: string;
}

const SportSection: React.FC<SportSectionProps> = ({
  isSportSection,
  title,
  icon,
  matches,
  viewAllUrl,
  isSpotlight = false,
  titleClassName = "text-lg sm:text-xl md:text-2xl font-semibold text-white",
}) => {
  if (!matches || matches.length === 0) {
    return null;
  }

  // Slider settings for desktop
  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: location?.pathname.startsWith("/truc-tiep") ? 2.3 : 3.5,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PreviewArrow />,
    lazyLoad: "ondemand",
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section className="py-3 sm:py-4 px-1 sm:px-4 md:px-3">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4">
        <h2 className={`${titleClassName} flex items-center mb-2 sm:mb-0`}>
          {icon && <span className="mr-2 text-yellow-400">{icon}</span>}
          {title}
        </h2>
        {viewAllUrl && !isSpotlight && (
          <a
            href={viewAllUrl}
            className="text-xs sm:text-sm text-yellow-400 hover:text-yellow-300 flex items-center"
          >
            Xem tất cả <ChevronRightIcon className="w-4 h-4 ml-1" />
          </a>
        )}
      </div>
      {isSpotlight ? (
        <div
          className={
            isSportSection
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4"
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4"
          }
        >
          {matches.map((match) => (
            <SpotlightMatchCard key={match._id} match={match} />
          ))}
        </div>
      ) : (
        <div>
          <div className="block lg:hidden">
            <div className="flex overflow-x-auto space-x-3 sm:space-x-4 pb-3 sm:pb-4 -mx-1 sm:-mx-4 px-1 sm:px-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              {matches.map((match) => (
                <MatchCard key={match._id} match={match} small />
              ))}
              <div className="flex-shrink-0 w-px"></div>
            </div>
          </div>
          <div className="hidden lg:block">
            <Slider {...sliderSettings} className="group !text-left relative">
              {matches.map((match) => (
                <div key={match._id} className="px-0 h-full flex">
                  <div className="h-full flex match-card-content">
                    <MatchCard match={match} small />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}
    </section>
  );
};

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      className="custom-next-arrow absolute top-1/2 right-0 transform  -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 cursor-pointer"
      onClick={onClick}
    >
      {ChevronRightIcon ? (
        <ChevronRightIcon className="w-8 h-8 text-white" />
      ) : (
        <div className="text-white">Icon Missing</div>
      )}
    </div>
  );
};
const PreviewArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      className="custom-preview-arrow absolute top-1/2 left-0 transform  -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 cursor-pointer"
      onClick={onClick}
    >
      {ChevronLeftIcon ? (
        <ChevronLeftIcon className="w-8 h-8 text-white" />
      ) : (
        <div className="text-white">Icon Missing</div>
      )}
    </div>
  );
};
export default SportSection;
