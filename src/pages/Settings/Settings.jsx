import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Moon, Lock, Trash2 } from "lucide-react";
import { toggleTheme, selectIsDark } from "@/store/slices/themeSlice";
import ChangePassword from "@/pages/Auth/ChangePassword";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, type: "spring", stiffness: 200, damping: 20 },
  }),
};

export default function Settings() {
  const { user, isAuthenticated, isHydrating } = useSelector((s) => s.auth);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const isDark = useSelector(selectIsDark);
  const dispatch = useDispatch();

  if (isHydrating) return null;

  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;

  return (
    <section className="max-w-2xl mx-auto py-16 px-4">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-foreground mb-8"
      >
        Settings
      </motion.h1>

      <div className="space-y-4">
        {/* Theme Toggle */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between p-5 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/40"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Appearance</p>
              <p className="text-xs text-muted-foreground">
                {isDark ? "Dark mode" : "Light mode"}
              </p>
            </div>
          </div>
          <button
            onClick={() => dispatch(toggleTheme())}
            className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
              isDark ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                isDark ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </motion.div>

        {/* Change Password - only for system users */}
        {user?.provider === "system" && (
          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-between p-5 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/40"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
                <Lock size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Change Password</p>
                <p className="text-xs text-muted-foreground">Update your account password</p>
              </div>
            </div>
            <button
              onClick={() => setIsChangePasswordOpen(true)}
              className="px-4 py-2 text-xs font-medium rounded-xl border border-border/50 text-foreground/80 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all"
            >
              Change
            </button>
          </motion.div>
        )}

        {/* Danger Zone */}
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between p-5 rounded-2xl bg-card/60 backdrop-blur-sm border border-red-500/20"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/10 text-red-500">
              <Trash2 size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Delete Account</p>
              <p className="text-xs text-muted-foreground">Permanently remove your data</p>
            </div>
          </div>
          <button className="px-4 py-2 text-xs font-medium rounded-xl border border-red-500/30 text-red-500/80 hover:text-red-500 hover:bg-red-500/10 transition-all">
            Delete
          </button>
        </motion.div>
      </div>

      <ChangePassword
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </section>
  );
}
