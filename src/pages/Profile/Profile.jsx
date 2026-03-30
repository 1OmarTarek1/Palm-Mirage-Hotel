import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Globe,
  Phone,
  Calendar,
  Shield,
  BadgeCheck,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, type: "spring", stiffness: 200, damping: 20 },
  }),
};

function InfoCard({ icon: Icon, label, value, index }) {
  if (!value) return null;
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="flex items-center gap-4 p-4 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/40 hover:border-primary/30 transition-colors"
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary shrink-0">
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">{value}</p>
      </div>
    </motion.div>
  );
}

export default function Profile() {
  const { user, isAuthenticated, isHydrating } = useSelector((s) => s.auth);

  if (isHydrating) return null;

  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const infoItems = [
    { icon: Mail, label: "Email", value: user?.email },
    { icon: Globe, label: "Country", value: user?.country !== "N/A" ? user?.country : null },
    { icon: Phone, label: "Phone", value: user?.phoneNumber },
    { icon: User, label: "Gender", value: user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : null },
    { icon: Calendar, label: "Date of Birth", value: user?.DOB ? new Date(user.DOB).toLocaleDateString() : null },
    { icon: Calendar, label: "Member Since", value: memberSince },
    { icon: Shield, label: "Role", value: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : null },
  ];

  return (
    <section className="max-w-3xl mx-auto py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        className="flex flex-col items-center gap-4 mb-12"
      >
        <div className="relative">
          {user?.image ? (
            <img
              src={user.image}
              alt={user.userName}
              className="w-28 h-28 rounded-full object-cover border-4 border-primary/20 shadow-xl"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center shadow-xl">
              <User size={48} className="text-primary" />
            </div>
          )}
          {user?.provider === "google" && (
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-card border-2 border-border flex items-center justify-center">
              <BadgeCheck size={16} className="text-primary" />
            </div>
          )}
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">{user?.userName}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {user?.provider === "google" ? "Signed in with Google" : "Email & Password account"}
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {infoItems.map((item, i) => (
          <InfoCard key={item.label} {...item} index={i} />
        ))}
      </div>
    </section>
  );
}
