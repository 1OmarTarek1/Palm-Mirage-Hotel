import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BadgeCheck, Eye, Pencil, Settings, User } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ProfileHero({ user, onOpenDetails, onOpenEdit }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 140, damping: 18 }}
      className="relative overflow-hidden rounded-[2.25rem] border border-border/50 bg-[radial-gradient(circle_at_top_left,rgba(199,161,92,0.16),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.82),rgba(255,255,255,0.58))] p-8 shadow-sm backdrop-blur-xl dark:bg-[radial-gradient(circle_at_top_left,rgba(199,161,92,0.2),transparent_34%),linear-gradient(135deg,rgba(24,24,27,0.92),rgba(24,24,27,0.76))]"
    >
      <div className="absolute -right-12 -top-14 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute right-5 top-5 z-10 flex items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="rounded-full border border-border/60 backdrop-blur-sm"
          onClick={onOpenDetails}
          aria-label="View Account Details"
        >
          <Eye size={18} />
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="rounded-full border border-border/60 backdrop-blur-sm"
          onClick={onOpenEdit}
          aria-label="Edit Profile"
        >
          <Pencil size={18} />
        </Button>
        <Button
          asChild
          variant="secondary"
          size="icon"
          className="rounded-full border border-border/60 backdrop-blur-sm"
        >
          <Link to="/settings" aria-label="Account Settings">
            <Settings size={18} />
          </Link>
        </Button>
      </div>

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-5">
          <div className="relative">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.userName}
                className="h-28 w-28 rounded-full border-4 border-primary/20 object-cover shadow-xl"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-primary/20 bg-primary/10 shadow-xl">
                <User size={46} className="text-primary" />
              </div>
            )}
            {user?.provider === "google" ? (
              <div className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-border bg-card">
                <BadgeCheck size={18} className="text-primary" />
              </div>
            ) : null}
          </div>

          <div className="pt-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              Guest Profile
            </p>
            <h1 className="mt-3 text-3xl font-black text-foreground sm:text-4xl">
              {user?.userName}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              {user?.provider === "google"
                ? "Signed in with Google. You can review everything you've saved, plan the rest of your stay, and cancel eligible bookings from one place."
                : "Manage your saved rooms, active cart items, and all your hotel bookings from this single account hub."}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
