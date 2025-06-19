import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/header/index";
import FooterInfo from "@/components/footer/index";
import StickyAdBanner from "@/components/layout/StickyAdBanner";
import FloatingChatButton from "@/components/layout/FloatingChatButton";
import belt_left_right from "@/assets/user/160t1800.gif";
import belt_bottom_top from "@/assets/user/1330t190.gif";
import * as React from "react";
import VerticalAdBanner from "@/components/layout/VerticalAdBanner";
import { DataProvider } from "@/context/DataContext";
import { useSelectedPageContext } from "@/hooks/use-context";
import propImage from "@/assets/user/500t1500.gif";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { X } from "lucide-react";

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
  const location = useLocation();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { setSelectedPage, setSelectedSportsNavbarPage } =
    useSelectedPageContext();
  const [open, setOpen] = React.useState(true);
  const handleClose = () => setOpen(false);
  React.useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  React.useEffect(() => {
    const savedPage = localStorage.getItem("selectedPage");
    const savedSportsPage = localStorage.getItem("selectedSportsNavbarPage");
    if (savedPage) setSelectedPage(savedPage);
    if (savedSportsPage) setSelectedSportsNavbarPage(savedSportsPage);
  }, [setSelectedPage, setSelectedSportsNavbarPage]);

  // Effect to show image on reload (component mount)
  React.useEffect(() => {
    setOpen(true); // Set to true when component mounts (on reload)
  }, []); // Empty dependency array ensures it runs only once on mount

  return (
    <DataProvider>
      <div
        ref={containerRef}
        className="bg-white text-brand-text overflow-y-auto h-screen "
      >
        <div className="flex flex-col min-h-screen bg-[#1E2027]">
          <StickyAdBanner position="top" imageUrl={belt_bottom_top} />
          <div className="pt-[6px] flex-grow relative">
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
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <div className="flex justify-center relative">
                <div className="relative w-full">
                  <img
                    src={propImage}
                    alt="Centered Ad Banner"
                    className="w-full h-auto object-cover"
                  />
                  <button
                    onClick={handleClose}
                    className="absolute top-0 right-0 w-6 h-6 bg-white text-black rounded-lg flex items-center justify-center "
                  >
                    <X />
                  </button>
                </div>
              </div>
            </Box>
          </Modal>
        </div>
      </div>
    </DataProvider>
  );
};

export default Public;
