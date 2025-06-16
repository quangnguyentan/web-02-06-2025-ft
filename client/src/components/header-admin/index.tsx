import { LogOut, Settings } from "lucide-react";
import { useAppDispatch } from "@/hooks/use-dispatch";
import { logout } from "@/stores/actions/authAction";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HeaderAdmin = () => {
  const { userData } = useSelector((state: RootState) => state.user);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const wrapperRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
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
    <header className="flex justify-end items-center p-4 bg-[#2ABBB2] text-white w-full absolute">
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
            {userData?.username || "anonymous"}
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
    </header>
  );
};

export default HeaderAdmin;
