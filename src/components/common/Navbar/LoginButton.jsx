import { useState, useRef, useCallback } from "react";
import { LogIn, User, LogOut, Settings, UserCircle } from "lucide-react";
import { NavLink, useNavigate, useMatch } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import NavTooltip from "./NavTooltip";
import { logout } from "@/store/slices/authSlice";
import { toast } from "react-toastify";
import axiosInstance from "@/services/axiosInstance";

export default function LoginButton() {
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);
  const isProfilePage = useMatch("/profile");
  const isSettingsPage = useMatch("/settings");

  const handleEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  }, []);

  const handleLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setOpen(false), 200);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch {
      // Clear frontend auth state even if the server logout request fails.
    } finally {
      dispatch(logout());
      setOpen(false);
      toast.success("You've been logged out.");
      navigate("/");
    }
  }, [dispatch, navigate]);

  if (!isAuthenticated) {
    return (
      <NavTooltip label="Login">
        <NavLink
          to="/auth/login"
          className={({ isActive }) => `
            flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10
            transition-all duration-300 hover:bg-primary/20
            ${isActive ? "text-primary bg-primary/20 shadow-inner border border-primary/20" : "text-white/60 bg-primary/5"}
          `}
        >
          <motion.div>
            <LogIn className="w-4 h-4 md:w-[18px] md:h-[18px]" />
          </motion.div>
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
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border transition-all duration-300 hover:bg-primary/20 overflow-hidden bg-primary/5 cursor-pointer
          ${(isProfilePage || isSettingsPage)
            ? "text-primary bg-primary/20 shadow-inner border-primary/20"
            : "border-white/10"
          }
        `}
        onClick={() => setOpen((p) => !p)}
      >
        {user?.image ? (
          <img
            src={user.image}
            alt={user.userName}
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
          />
        ) : (
          <User className="w-4 h-4 md:w-[18px] md:h-[18px] text-white/60" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute right-0 top-full mt-4 w-64 bg-card/90 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden z-50"
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
