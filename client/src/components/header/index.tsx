import { NavItem, SportCategory } from "@/types/index.types";
import {
  UserIcon,
  BadmintonIcon,
  BasketballIcon,
  OtherSportsIcon,
  EventsIcon,
  FootballIcon,
  TennisIcon,
  VolleyballIcon,
  EsportsIcon,
  RacingIcon,
  MartialArtsIcon,
  BilliardsIcon,
  TVIcon,
} from "../layout/Icon";
import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import Input from "@mui/material/Input";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { Button } from "@mui/material";
import { Sport } from "@/types/sport.types";
import { useSelectedPageContext } from "@/hooks/use-context";
import { useData } from "@/context/DataContext";
import { LogOut, Settings } from "lucide-react";
import { useAppDispatch } from "@/hooks/use-dispatch";
import { logout } from "@/stores/actions/authAction";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { motion, AnimatePresence } from "framer-motion";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const MainNavbar: React.FC<{ onOpenMenu: () => void }> = ({ onOpenMenu }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [passwordShown, setPasswordShown] = React.useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);
  const {
    selectedPage,
    setSelectedPage,
    setSelectedSportsNavbarPage,
    selectedSportsNavbarPage,
  } = useSelectedPageContext();
  const { sportData } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = useSelector((state: RootState) => state.user);
  const { isLoggedIn, token } = useSelector((state: RootState) => state.auth);

  const getSportNameFromSlug = (slug: string) => {
    const sport = sportData.find((s) => s.slug === slug);
    return sport ? sport.name : null;
  };

  const getInitialActiveSportName = React.useCallback(() => {
    if (
      location.pathname.startsWith("/lich-thi-dau/") ||
      location.pathname.startsWith("/ket-qua/") ||
      location.pathname.startsWith("/xem-lai/")
    ) {
      const parts = location.pathname.split("/");
      const urlSlug = parts[parts.length - 1];
      return getSportNameFromSlug(urlSlug) || "eSports";
    }
    const savedSportName = localStorage.getItem("selectedSportsNavbarPage");
    if (savedSportName && sportData.some((s) => s.name === savedSportName)) {
      return savedSportName;
    }
    return "eSports";
  }, [location.pathname, sportData]);

  const navItems: NavItem[] = React.useMemo(() => {
    const activeSportName = getInitialActiveSportName();
    const sport = sportData.find((s) => s.name === activeSportName);
    const slug = sport ? sport.slug : "esports";
    return [
      { label: "TRANG CHỦ", url: "/" },
      {
        label: "LỊCH THI ĐẤU",
        url: `/lich-thi-dau/${slug}`,
        nameForHighlight: activeSportName,
      },
      {
        label: "KẾT QUẢ",
        url: `/ket-qua/${slug}`,
        nameForHighlight: activeSportName,
      },
      {
        label: "XEM LẠI",
        url: `/xem-lai/${slug}`,
        nameForHighlight: activeSportName,
      },
      // { label: "XOILAC.TV", url: "/xoi-lac-tv" },
    ];
  }, [getInitialActiveSportName, sportData]);

  const handleClickTypeLogin = (type: string) => {
    window.open(`http://localhost:8080/api/auth/${type}`, "_self");
  };
  const dispatch = useAppDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const wrapperRef = React.useRef(null);

  const handleLogout = () => {
    setSelectedPage("TRANG CHỦ");
    localStorage.setItem("selectedPage", "TRANG CHỦ");
    setSelectedSportsNavbarPage("");
    localStorage.removeItem("selectedSportsNavbarPage");
    dispatch(logout());
    navigate("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-[#1E2027] text-gray-300 flex items-center justify-between p-2 relative">
      <img
        src="https://via.placeholder.com/120x32/FFFFFF/1A202C?text=THAPCAM"
        alt="ThapCam TV Logo"
        className="h-8 sm:h-10 mr-2 md:mr-6"
      />
      <div>
        <nav className="hidden md:flex items-center">
          {navItems.map((item) => (
            <div
              key={item.label}
              onClick={() => {
                const activeSportName =
                  selectedSportsNavbarPage || getInitialActiveSportName();
                const sport = sportData.find((s) => s.name === activeSportName);
                const targetSlug = sport ? sport.slug : "esports";
                const finalUrl =
                  item.url.includes(":slug") || item.url.includes(":title")
                    ? item.url
                        .replace(":slug", targetSlug)
                        .replace(":title", targetSlug)
                    : item.url;

                navigate(finalUrl);
                setSelectedPage(item.label);
                localStorage.setItem("selectedPage", item.label);
                if (item.nameForHighlight) {
                  setSelectedSportsNavbarPage(item.nameForHighlight);
                  localStorage.setItem(
                    "selectedSportsNavbarPage",
                    item.nameForHighlight
                  );
                } else {
                  setSelectedSportsNavbarPage("");
                  localStorage.removeItem("selectedSportsNavbarPage");
                }
              }}
              className={`px-1.5 sm:px-2 lg:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs lg:text-sm rounded transition-colors whitespace-nowrap font-bold cursor-pointer ${
                selectedPage === item.label
                  ? "text-[#ff7f32]"
                  : "text-gray-300 hover:text-[#ff7f32]"
              }`}
            >
              {item.label}
            </div>
          ))}
        </nav>
      </div>
      <div className="flex items-center space-x-1.5 sm:space-x-3">
        <button className="hidden sm:flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm">
          <TVIcon className="w-5 h-5 mr-1" />
          ThapCam TV
        </button>
        <button className="hidden sm:flex items-center bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold px-3 py-2 rounded text-sm">
          Cược Uy Tín
        </button>
        <div>
          {isLoggedIn && token && userData?.avatar ? (
            <div className="relative" ref={wrapperRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 focus:outline-none"
              >
                <img
                  src={userData?.avatar} // Replace with actual avatar path
                  alt="User Avatar"
                  className="w-6 h-6 rounded-full"
                />
                <span className="font-bold text-xs">
                  {userData?.username ?? "anonymous"}
                </span>
              </button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg z-10"
                  >
                    <ul className="py-1">
                      <li>
                        <button
                          onClick={() => alert("Settings clicked")}
                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          <Settings size={16} className="mr-2" />
                          Cài đặt
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          <LogOut size={16} className="mr-2" />
                          Đăng xuất
                        </button>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={handleOpen}
              className="bg-slate-700 hover:bg-slate-600 p-1.5 sm:p-2 rounded-full"
            >
              <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          )}
          <Modal
            aria-labelledby="signin-modal-title"
            aria-describedby="signin-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{ backdrop: { timeout: 500 } }}
          >
            <Fade in={open}>
              <Box sx={style}>
                <section className="text-center px-6 py-4">
                  <Typography
                    id="signin-modal-title"
                    variant="h4"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    Sign In
                  </Typography>
                  <Typography
                    id="signin-modal-description"
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 4 }}
                  >
                    Enter your email and password to sign in
                  </Typography>
                  <form className="mx-auto max-w-md text-left space-y-4">
                    <div>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 1, color: "text.primary", fontWeight: 500 }}
                      >
                        Email Address
                      </Typography>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        fullWidth
                        placeholder="name@mail.com"
                        size="medium"
                      />
                    </div>
                    <div>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 1, color: "text.primary", fontWeight: 500 }}
                      >
                        Password
                      </Typography>
                      <Input
                        id="password"
                        name="password"
                        type={passwordShown ? "text" : "password"}
                        fullWidth
                        placeholder="********"
                        size="medium"
                        endAdornment={
                          <i
                            onClick={togglePasswordVisiblity}
                            className="cursor-pointer"
                          >
                            {passwordShown ? (
                              <EyeIcon className="h-5 w-5 text-gray-500" />
                            ) : (
                              <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                            )}
                          </i>
                        }
                      />
                    </div>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      sx={{ mt: 2 }}
                    >
                      Sign In
                    </Button>
                    <Typography
                      variant="body2"
                      align="right"
                      sx={{ mt: 1, color: "text.secondary" }}
                    >
                      <a href="#" className="hover:underline text-sm">
                        Forgot password?
                      </a>
                    </Typography>
                    <Button
                      onClick={() => handleClickTypeLogin("google")}
                      variant="outlined"
                      size="large"
                      fullWidth
                      startIcon={
                        <img
                          src="https://www.material-tailwind.com/logos/logo-google.png"
                          alt="Google"
                          className="h-5 w-5"
                        />
                      }
                      sx={{ mt: 2 }}
                    >
                      Sign in with Google
                    </Button>
                    <Typography
                      variant="body2"
                      align="center"
                      sx={{ mt: 3, color: "text.secondary" }}
                    >
                      Not registered?{" "}
                      <a
                        href="#"
                        className="font-medium text-primary hover:underline"
                      >
                        Create account
                      </a>
                    </Typography>
                  </form>
                </section>
              </Box>
            </Fade>
          </Modal>
        </div>
        <button
          className="md:hidden p-2 text-gray-300 hover:text-white"
          onClick={onOpenMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

const SportsNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sportData, matchData } = useData();

  const { selectedSportsNavbarPage, setSelectedSportsNavbarPage } =
    useSelectedPageContext();
  React.useEffect(() => {
    if (sportData.length === 0) return;

    // Check if set by ReplayCard
    const setByReplayCard = localStorage.getItem("setByReplayCard") === "true";
    if (setByReplayCard) {
      localStorage.removeItem("setByReplayCard"); // Clear flag after use
      return; // Skip useEffect logic
    }

    const pathSegments = location.pathname.split("/");
    const currentPathSlug = pathSegments[pathSegments.length - 1];
    const currentSection = pathSegments[1] || "home";

    const previousSection = localStorage.getItem("previousSection") || "";

    if (location.pathname === "/") {
      setSelectedSportsNavbarPage("");
      localStorage.setItem("selectedSportsNavbarPage", "");
      localStorage.setItem("previousSection", currentSection);
      return;
    }

    if (
      (location.pathname.startsWith("/lich-thi-dau/") ||
        location.pathname.startsWith("/ket-qua/") ||
        location.pathname.startsWith("/xem-lai/")) &&
      currentSection !== previousSection
    ) {
      setSelectedSportsNavbarPage("eSports");
      localStorage.setItem("selectedSportsNavbarPage", "eSports");
      localStorage.setItem("previousSection", currentSection);
      return;
    }

    if (
      location.pathname.startsWith("/lich-thi-dau/") ||
      location.pathname.startsWith("/ket-qua/") ||
      location.pathname.startsWith("/xem-lai/")
    ) {
      const sportFromUrl = sportData.find((s) => s.slug === currentPathSlug);
      let initialSportName = "eSports";
      if (sportFromUrl) {
        initialSportName = sportFromUrl.name;
      } else {
        const savedSportName = localStorage.getItem("selectedSportsNavbarPage");
        if (
          savedSportName &&
          sportData.some((s) => s.name === savedSportName)
        ) {
          initialSportName = savedSportName;
        }
      }
      setSelectedSportsNavbarPage(initialSportName);
      localStorage.setItem("selectedSportsNavbarPage", initialSportName);
    }
  }, [setSelectedSportsNavbarPage, location.pathname, sportData]);
  const handleSportClick = (category: Sport) => {
    let targetUrl = "";
    if (
      location.pathname.startsWith("/lich-thi-dau/") ||
      location.pathname.startsWith("/ket-qua/") ||
      location.pathname.startsWith("/xem-lai/")
    ) {
      // Maintain the current section (lich-thi-dau, ket-qua, or xem-lai)
      const basePath = location.pathname.split("/")[1]; // Extract the section
      targetUrl = `/${basePath}/${category.slug}`;
    } else {
      // On homepage or other paths, navigate directly to /:slug
      targetUrl = `/${category.slug}`;
    }
    navigate(targetUrl);
    setSelectedSportsNavbarPage(category.name);
    localStorage.setItem("selectedSportsNavbarPage", category.name);
  };

  return (
    <div className="hidden md:flex bg-[#22252D] px-3 py-4 gap-12 overflow-x-auto shadow-xl">
      {sportData?.map((category) => (
        <div
          key={category._id}
          onClick={() => handleSportClick(category)}
          className={`group relative flex items-center gap-2 pb-2 pt-4 text-sm font-medium cursor-pointer
          transition-all duration-300
          ${
            selectedSportsNavbarPage === category.name
              ? "text-[#ff7f32]"
              : "text-gray-200 hover:text-white"
          }`}
        >
          <img src={category?.icon} className="w-4 h-4" alt={category?.name} />
          <span>{category.name}</span>
          <span
            className={`
            absolute bottom-0 left-1/2 h-[2px] bg-[#ff7f32] transition-all duration-300 ease-in-out
            ${
              selectedSportsNavbarPage === category.name
                ? "w-full -translate-x-1/2"
                : "w-0 group-hover:w-full group-hover:-translate-x-1/2"
            }
          `}
          />
          {matchData?.some(
            (match) =>
              match.sport?.slug === category.slug && match.status === "LIVE"
          ) && (
            <span className="ml-1 text-[7px] bg-red-500 text-white px-2 rounded-xl absolute right-[-10px] top-[0px]">
              LIVE
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
const DrawerMenu: React.FC<{
  open: boolean;
  onClose: () => void;
  navItems: NavItem[];
  sportCategories: SportCategory[];
  navigate: (url: string) => void;
}> = ({ open, onClose, navItems, sportCategories, navigate }) => {
  const { setSelectedPage, setSelectedSportsNavbarPage } =
    useSelectedPageContext();
  const { sportData } = useData();

  const handleSportClick = (category: SportCategory) => {
    const sport = sportData.find((s) => s.name === category.name);
    const targetUrl = sport ? `/xem-lai/${sport.slug}` : "/xem-lai/esports";
    navigate(targetUrl);
    setSelectedSportsNavbarPage(category.name);
    localStorage.setItem("selectedSportsNavbarPage", category.name);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        open ? "visible" : "invisible"
      }`}
    >
      <div
        className={`absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`absolute left-0 top-0 h-full w-64 max-w-[80vw] bg-slate-800 shadow-lg transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        <button
          className="self-end m-3 p-2 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <svg
            width={24}
            height={24}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <nav className="flex-1 px-4">
          {navItems.map((item) => (
            <div
              key={item.label}
              onClick={() => {
                navigate(item.url);
                setSelectedPage(item.label);
                localStorage.setItem("selectedPage", item.label);
                onClose();
              }}
              className="py-2 text-sm font-semibold text-white hover:text-orange-400 cursor-pointer"
              style={{
                color: item.label === "TRANG CHỦ" ? "#ff7f32" : undefined,
              }}
            >
              {item.label}
            </div>
          ))}
          <hr className="my-2 border-slate-700" />
          <div className="flex flex-col gap-1">
            {sportCategories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleSportClick(category)}
                className="flex items-center gap-2 py-1 text-gray-200 text-sm cursor-pointer hover:text-orange-400"
              >
                {category.icon}
                <span>{category.name}</span>
                {(category.name === "Cầu lông" ||
                  category.name === "Bóng rổ" ||
                  category.name === "Môn khác" ||
                  category.name === "Tennis" ||
                  category.name === "Đua xe" ||
                  category.name === "eSports") && (
                  <span className="text-[9px] bg-red-500 text-white rounded-[5px] px-[6px]">
                    Live
                  </span>
                )}
              </div>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

const Header: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const navigate = useNavigate();
  const { setSelectedPage, setSelectedSportsNavbarPage } =
    useSelectedPageContext();

  const navItems: NavItem[] = [
    { label: "TRANG CHỦ", url: "/" },
    { label: "LỊCH THI ĐẤU", url: "/lich-thi-dau/esports" },
    { label: "KẾT QUẢ", url: "/ket-qua/esports" },
    { label: "XEM LẠI", url: "/xem-lai/esports" },
    { label: "XOILAC.TV", url: "/xoi-lac-tv" },
  ];
  const sportCategories: SportCategory[] = [
    { id: "tennis", name: "Tennis", icon: <TennisIcon className="w-4 h-4" /> },
    { id: "racing", name: "Đua xe", icon: <RacingIcon className="w-4 h-4" /> },
    {
      id: "esports",
      name: "eSports",
      icon: <EsportsIcon className="w-4 h-4" />,
    },
    {
      id: "basketball",
      name: "Bóng rổ",
      icon: <BasketballIcon className="w-4 h-4" />,
    },
    {
      id: "badminton",
      name: "Cầu lông",
      icon: <BadmintonIcon className="w-4 h-4" />,
    },
    {
      id: "volleyball",
      name: "Bóng chuyền",
      icon: <VolleyballIcon className="w-4 h-4" />,
    },
    {
      id: "other_sports",
      name: "Môn khác",
      icon: <OtherSportsIcon className="w-4 h-4" />,
    },
    {
      id: "football",
      name: "Bóng đá",
      icon: <FootballIcon className="w-4 h-4" />,
    },
    {
      id: "martial_arts",
      name: "Võ thuật",
      icon: <MartialArtsIcon className="w-4 h-4" />,
    },
    {
      id: "events",
      name: "Sự kiện đặc biệt",
      icon: <EventsIcon className="w-4 h-4" />,
    },
    {
      id: "billiards",
      name: "Bi-a",
      icon: <BilliardsIcon className="w-4 h-4" />,
    },
  ];
  React.useEffect(() => {
    const savedPage = localStorage.getItem("selectedPage");
    console.log(savedPage);
    const savedSportsPage = localStorage.getItem("selectedSportsNavbarPage");
    if (savedPage) setSelectedPage(savedPage);
    if (savedSportsPage) setSelectedSportsNavbarPage(savedSportsPage);
  }, [setSelectedPage, setSelectedSportsNavbarPage]);

  return (
    <header
      className="lg:max-w-[1024px] xl:max-w-[1200px] 2xl:max-w-[1440px]
      lg:translate-x-0 xl:translate-x-[calc((100vw-1200px)/2)] 2xl:translate-x-[calc((100vw-1440px)/2)]"
    >
      <MainNavbar onOpenMenu={() => setDrawerOpen(true)} />
      <SportsNavbar />
      <DrawerMenu
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        navItems={navItems}
        sportCategories={sportCategories}
        navigate={navigate}
      />
    </header>
  );
};

export default Header;
