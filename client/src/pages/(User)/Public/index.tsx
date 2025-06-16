import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/header/index";
import FooterInfo from "@/components/footer/index";
import StickyAdBanner from "@/components/layout/StickyAdBanner";
import FloatingChatButton from "@/components/layout/FloatingChatButton";
import belt_left_right from "@/assets/user/160t1800.gif";
import belt_bottom_top from "@/assets/user/1330t190.gif";
import * as React from "react";
import VerticalAdBanner from "@/components/layout/VerticalAdBanner";
import { useSelectedPageContext } from "@/hooks/use-context";

// Custom hook to manage localStorage for page state

const Public = () => {
  const location = useLocation();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { setSelectedPage, setSelectedSportsNavbarPage } =
    useSelectedPageContext();
  // Load saved scroll position from localStorage when component mounts or pathname changes
  React.useEffect(() => {
    containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  React.useEffect(() => {
    const savedPage = localStorage.getItem("selectedPage");
    const savedSportsPage = localStorage.getItem("selectedSportsNavbarPage");
    if (savedPage) setSelectedPage(savedPage);
    if (savedSportsPage) setSelectedSportsNavbarPage(savedSportsPage);
  }, [setSelectedPage, setSelectedSportsNavbarPage]);

  return (
    <div
      ref={containerRef}
      className="bg-[#1e2027] text-brand-text overflow-y-auto h-screen"
    >
      <div className="flex flex-col min-h-screen bg-[#1E2027]">
        <StickyAdBanner position="top" imageUrl={belt_bottom_top} />
        <div className="pt-[6px] flex-grow">
          <Header />
          <div className="container mx-auto relative px-1 sm:px-0">
            <div className="hidden lg:block">
              <VerticalAdBanner position="left" imageUrl={belt_left_right} />
              <VerticalAdBanner position="right" imageUrl={belt_left_right} />
            </div>
            <Outlet />
          </div>
          <FooterInfo />
        </div>
        <StickyAdBanner position="bottom" imageUrl={belt_bottom_top} />
        <FloatingChatButton />
      </div>
    </div>
  );
};

export default Public;
