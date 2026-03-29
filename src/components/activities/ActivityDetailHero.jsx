import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ActivityDetailHero({ activity }) {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem]">
      <img src={activity.image} alt={activity.title} className="h-[55vh] w-full object-cover" />
      <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/25 to-black/70" />

      <div className="absolute inset-0 flex items-end">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-10 text-white">
          <Button asChild variant="palmWhiteSecondary" className="w-fit">
            <Link to="/services/activities">
              <ArrowLeft className="h-4 w-4" />
              Back to Activities
            </Link>
          </Button>

          <div className="max-w-3xl space-y-3">
            <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">
              {activity.label}
            </span>
            <h1 className="text-4xl font-header font-bold sm:text-5xl">{activity.title}</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-white/80">{activity.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
