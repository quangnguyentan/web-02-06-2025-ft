import * as React from "react";
import banner_container from "@/assets/user/tc-banner-t5.png";
import banner_container_after from "@/assets/user/bg-topz-min.jpg";

const HeroSection: React.FC = () => {
  return (
    <div className="relative bg-[#323232] h-[220px] sm:h-[320px] md:h-[320px] flex items-center justify-center overflow-hidden rounded-b-xl ">
      {/* Background athletes */}
      <div className="absolute inset-0 opacity-90">
        <img
          src={banner_container_after}
          alt="background"
          className="w-full h-full object-cover"
        />
      </div>
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-[#323232] via-slate-900/70 to-transparent"></div>

      {/* Text Content */}
      <div className="relative z-10 text-center flex flex-col items-center px-2 lg:max-w-[1024px] xl:max-w-[1200px] 2xl:max-w-[1440px]">
        <img
          src={banner_container}
          alt="banner_container"
          className="lg:w-full sm:w-[320px] md:w-[420px] max-w-full mx-auto drop-shadow-lg"
        />
      </div>
    </div>
  );
};

export default HeroSection;
