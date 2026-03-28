import { Check } from "lucide-react";

export default function ActivityHighlightsSection({ highlights = [] }) {
  if (!highlights.length) return null;

  return (
    <div className="pt-10">
      <h2 className="text-2xl font-header font-bold text-primary">Why Guests Choose It</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {highlights.map((highlight) => (
          <div
            key={highlight}
            className="flex items-start gap-3 rounded-[1.6rem] border border-border bg-card px-5 py-4 text-sm text-primary"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary text-primary">
              <Check className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <p className="pt-1">{highlight}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
