import { useState, useRef, useCallback, useEffect } from "react";
import { LogIn, User, LogOut, Settings, UserCircle } from "lucide-react";
import { NavLink, useNavigate, useMatch } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import NavTooltip from "./NavTooltip";
import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";
import { logout } from "@/store/slices/authSlice";
import { toast } from "react-toastify";
import axiosInstance from "@/services/axiosInstance";
import { markPostLogoutRedirect } from "@/utils/authRedirect";

const MotionDiv = motion.div;

export default function LoginButton() {
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const isProfilePage = useMatch("/profile");
  const isSettingsPage = useMatch("/settings");

  const handleLogout = useCallback(async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch {
      // Clear frontend auth state even if the server logout request fails.
    } finally {
      markPostLogoutRedirect("/");
      navigate("/", { replace: true });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      dispatch(logout());
      setOpen(false);
      toast.success("You've been logged out.");
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleScrollClose = () => setOpen(false);
    window.addEventListener("scroll", handleScrollClose, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollClose);
  }, [open]);

  if (!isAuthenticated) {
    return (
      <NavTooltip label="Login">
        <NavLink
          to="/auth/login"
          aria-label="Login"
          className={({ isActive }) => `
            flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-full border border-white/10
            transition-all duration-300 hover:bg-primary/20
            focus:outline-none focus-visible:outline-none focus-visible:ring-0
            ${isActive ? "text-primary bg-primary/20 shadow-inner border border-primary/20" : "text-white/60 bg-primary/5"}
          `}
        >
          <MotionDiv>
            <LogIn className="w-[18px] h-[18px] md:w-5 md:h-5" />
          </MotionDiv>
        </NavLink>
      </NavTooltip>
    );
  }

  const menuItems = [
    { label: "Profile", icon: UserCircle, href: "/profile" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <NavTooltip label="User">
        <button
          className={`flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-full border transition-all duration-300 hover:bg-primary/20 overflow-hidden bg-primary/5 cursor-pointer
            focus:outline-none focus-visible:outline-none focus-visible:ring-0
            ${(isProfilePage || isSettingsPage)
              ? "text-primary bg-primary/20 shadow-inner border-primary/20"
              : "border-white/10"
            }
          `}
          onClick={() => setOpen((p) => !p)}
          aria-expanded={open}
          aria-label="Open user menu"
        >
          {user?.image ? (
            <img
              src={user.image}
              alt={user.userName}
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          ) : (
            <User className="w-[18px] h-[18px] md:w-5 md:h-5 text-white/60" />
          )}
        </button>
      </NavTooltip>

      <AnimatePresence>
        {open && (
          <MotionDiv
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute right-0 top-full mt-4 w-64 bg-card/90 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden z-[60]"
          >
            <div className="px-4 py-3 border-b border-border/30">
              <p className="text-sm font-semibold text-foreground truncate">
                {user?.userName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>

            <div className="p-2 space-y-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200
                    ${isActive
                      ? "text-primary bg-primary/10"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/10"}
                  `}
                >
                  <item.icon size={16} />
                  {item.label}
                </NavLink>
              ))}
              <LanguageToggle embedded />
              <ThemeToggle mobile menuCard />
            </div>

            <div className="p-2 border-t border-border/30">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium rounded-xl text-red-500/80 hover:text-red-500 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
}
