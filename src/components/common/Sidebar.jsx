import { cn } from "@/lib/utils";

export default function Sidebar({ children, className }) {
  return (
    <aside className={cn("w-full h-fit", className)}>
      {children}
    </aside>
  );
}
