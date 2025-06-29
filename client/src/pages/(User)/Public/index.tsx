import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/header/index";
import FooterInfo from "@/components/footer/index";
import StickyAdBanner from "@/components/layout/StickyAdBanner";
import * as React from "react";
import VerticalAdBanner from "@/components/layout/VerticalAdBanner";
import { useData } from "@/context/DataContext";
import { useSelectedPageContext } from "@/hooks/use-context";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { X } from "lucide-react";
import { useMediaQuery, useTheme } from "@mui/material";
import { UserInteractionProvider } from "@/context/UserInteractionContext";
import { isInitialLoadComplete, setInitialLoadComplete } from "@/lib/helper";
import { Banner } from "@/types/banner.types";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  border: "none", // Remove border from Box
  outline: "none", // Remove any outline (e.g., focus outline)
};
const Public = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const location = useLocation();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { setSelectedPage, setSelectedSportsNavbarPage } =
    useSelectedPageContext();
  const { bannerData } = useData();
  const [open, setOpen] = React.useState(!isInitialLoadComplete());
  const handleClose = () => setOpen(false);
  // In Public.tsx
  const filterBanners = (
    position: Banner["position"],
    displayPage: Banner["displayPage"]
  ): Banner | undefined => {
    return bannerData
      ?.filter(
        (banner) =>
          banner.position === position &&
          banner.displayPage === displayPage &&
          banner.isActive
      )
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))[0];
  };
  React.useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  React.useEffect(() => {
    const savedPage = localStorage.getItem("selectedPage");
    const savedSportsPage = localStorage.getItem("selectedSportsNavbarPage");
    if (savedPage) setSelectedPage(savedPage);
    if (savedSportsPage) setSelectedSportsNavbarPage(savedSportsPage);
  }, [setSelectedPage, setSelectedSportsNavbarPage]);

  React.useEffect(() => {
    setOpen(true);
    setInitialLoadComplete(true);
  }, []);
  return (
    <UserInteractionProvider>
      <div
        ref={containerRef}
        className="bg-slate-700 text-brand-text overflow-y-auto h-screen "
      >
        <div className="flex flex-col min-h-screen bg-[#1E2027]">
          <StickyAdBanner
            position="top"
            imageUrl={filterBanners("TOP", "ALL_PAGE")?.imageUrl}
          />
          <div className="pt-[6px] flex-grow relative">
            <Header />
            <div className="container mx-auto relative px-1 sm:px-0">
              <div className="hidden lg:block">
                <VerticalAdBanner
                  position="left"
                  imageUrl={filterBanners("SIDEBAR_LEFT", "ALL_PAGE")?.imageUrl}
                />
                <VerticalAdBanner
                  position="right"
                  imageUrl={
                    filterBanners("SIDEBAR_RIGHT", "ALL_PAGE")?.imageUrl
                  }
                />
              </div>
              <Outlet />
            </div>
            {location.pathname.startsWith("/truc-tiep") && isMobile ? (
              ""
            ) : (
              <FooterInfo />
            )}
          </div>
          <StickyAdBanner
            position="bottom"
            imageUrl={filterBanners("BOTTOM", "ALL_PAGE")?.imageUrl}
          />
          {/* <FloatingChatButton /> */}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <div className="flex justify-center relative">
                <div
                  className={
                    isMobile
                      ? "relative w-[320px]" // Chiều rộng bằng ảnh khi mobile
                      : "relative w-full" // Chiều rộng full khi desktop
                  }
                >
                  <img
                    src={filterBanners("POPUP", "ALL_PAGE")?.imageUrl}
                    alt="Centered Ad Banner"
                    className="w-full h-auto"
                  />
                  <button
                    onClick={handleClose}
                    className="absolute top-0 right-0 w-6 h-6 bg-red-500 text-white rounded-lg flex items-center justify-center z-20"
                  >
                    <X />
                  </button>
                </div>
              </div>
            </Box>
          </Modal>
        </div>
      </div>
    </UserInteractionProvider>
  );
};

export default Public;
