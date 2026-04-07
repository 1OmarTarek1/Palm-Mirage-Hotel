import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BedDouble, UtensilsCrossed, Activity } from "lucide-react";

const navigationItems = [
  {
    title: "Rooms",
    href: "/rooms",
    icon: BedDouble,
    description: "Find your perfect stay",
  },
  {
    title: "Restaurant",
    href: "/services/restaurant",
    icon: UtensilsCrossed,
    description: "Dining experiences",
  },
  {
    title: "Activities",
    href: "/services/activities",
    icon: Activity,
    description: "Adventure & wellness",
  },
];

export default function NavigationSidebar({ className }) {
  const location = useLocation();

  return (
    <aside className={cn("w-full h-fit", className)}>
      <div className="rounded-[2rem] border border-border/50 bg-card/60 p-6 backdrop-blur-sm">
        <h3 className="text-lg font-header font-bold text-foreground mb-6">
          Explore
        </h3>
        
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs opacity-70">{item.description}</div>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
