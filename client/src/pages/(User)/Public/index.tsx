import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/header/index";
import FooterInfo from "@/components/footer/index";
import StickyAdBanner from "@/components/layout/StickyAdBanner";
import FloatingChatButton from "@/components/layout/FloatingChatButton";
import belt_left_right from "@/assets/user/160t1800.gif";
import belt_bottom_top from "@/assets/user/1330t190.gif";

import * as React from "react";
import VerticalAdBanner from "@/components/layout/VerticalAdBanner";
const Public = () => {
  const location = useLocation();
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname]);
  return (
    <div
      ref={containerRef}
      className="bg-[#323232] text-brand-text overflow-y-auto h-screen"
    >
      <div className="flex flex-col min-h-screen bg-[#323232]">
        {/* Banner top luôn hiển thị */}
        <StickyAdBanner position="top" imageUrl={belt_bottom_top} />
        {/* <div className="pt-[6px] pb-[60px] flex-grow"> */}
        <div className="pt-[6px]flex-grow">
          <Header />
          <div className="container mx-auto relative px-1 sm:px-0">
            {/* Banner dọc chỉ hiện trên màn hình lớn */}
            <div className="hidden lg:block">
              <VerticalAdBanner position="left" imageUrl={belt_left_right} />
              <VerticalAdBanner position="right" imageUrl={belt_left_right} />
            </div>
            <Outlet />
          </div>
          <FooterInfo />
        </div>
        {/* Banner bottom luôn hiển thị */}
        <StickyAdBanner position="bottom" imageUrl={belt_bottom_top} />
        <FloatingChatButton />
      </div>
    </div>
  );
};

export default Public;
