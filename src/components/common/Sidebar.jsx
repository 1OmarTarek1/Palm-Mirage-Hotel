import { cn } from "@/lib/utils";

export default function Sidebar({ children, className }) {
  return (
    <aside className={cn("bg-card rounded-2xl p-6 border border-foreground/10 space-y-7 w-full h-fit", className)}>
      {children}
    </aside>
  );
}
