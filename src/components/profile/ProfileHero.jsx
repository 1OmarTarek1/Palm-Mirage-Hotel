import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BadgeCheck, Eye, Pencil, Settings, User } from "lucide-react";

import { Button } from "@/components/ui/button";

const profileActionBtnClass =
  "h-10 w-10 rounded-full border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground [&_svg]:h-[18px] [&_svg]:w-[18px]";

export default function ProfileHero({ user, onOpenDetails, onOpenEdit }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end gap-2 px-1 sm:px-0">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={profileActionBtnClass}
          onClick={onOpenDetails}
          aria-label="View Account Details"
        >
          <Eye size={18} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={profileActionBtnClass}
          onClick={onOpenEdit}
          aria-label="Edit Profile"
        >
          <Pencil size={18} />
        </Button>
        <Button asChild variant="ghost" size="icon" className={profileActionBtnClass}>
          <Link to="/settings" aria-label="Account Settings">
            <Settings size={18} />
          </Link>
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 18 }}
        className="relative overflow-hidden rounded-[2.25rem] border border-border/50 bg-[radial-gradient(circle_at_top_left,rgba(199,161,92,0.16),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.82),rgba(255,255,255,0.58))] p-8 shadow-sm backdrop-blur-xl dark:bg-[radial-gradient(circle_at_top_left,rgba(199,161,92,0.2),transparent_34%),linear-gradient(135deg,rgba(24,24,27,0.92),rgba(24,24,27,0.76))]"
      >
        <div className="absolute -right-12 -top-14 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full flex-col items-center gap-6 text-center lg:flex-row lg:items-start lg:gap-5 lg:text-left">
            <div className="relative shrink-0">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.userName}
                className="h-28 w-28 rounded-full border-4 border-primary/20 object-cover shadow-xl sm:h-32 sm:w-32"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-primary/20 bg-primary/10 shadow-xl sm:h-32 sm:w-32">
                <User className="h-11 w-11 text-primary sm:h-[52px] sm:w-[52px]" strokeWidth={1.5} />
              </div>
            )}
            {user?.provider === "google" ? (
              <div className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-border bg-card">
                <BadgeCheck size={18} className="text-primary" />
              </div>
            ) : null}
            </div>

            <div className="flex w-full max-w-2xl flex-col items-center gap-3 pt-0 lg:items-start lg:pt-2 lg:text-left">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              Guest Profile
            </p>
            <h1 className="text-2xl font-black text-foreground sm:text-3xl lg:mt-0 lg:text-4xl">
              {user?.userName}
            </h1>
            <p className="text-sm leading-6 text-muted-foreground lg:mt-0 lg:max-w-2xl">
              {user?.provider === "google"
                ? "Signed in with Google. You can review everything you've saved, plan the rest of your stay, and cancel eligible bookings from one place."
                : "Manage your saved rooms, active cart items, and all your hotel bookings from this single account hub."}
            </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
