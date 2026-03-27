import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function ActivityBooking({ activities = [] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Your activity inquiry has been sent! We'll contact you shortly.");
      event.target.reset();
      setSelectedActivity("");
    } catch {
      toast.error("Failed to send inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="border-t border-border/30">
      <div className="container mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="max-w-md">
            <span className="mb-4 block text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">
              Plan Your Adventure
            </span>
            <h2 className="mb-6 text-3xl font-header font-bold leading-tight text-foreground sm:text-4xl">
              Book an Activity
            </h2>
            <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
              <p>
                Ready to explore? Fill out the form and our concierge team will craft the
                perfect itinerary for your stay in Luxor. Whether you're seeking adventure or
                relaxation, we'll make it unforgettable.
              </p>
              <p>
                We typically respond within 24 hours. For urgent bookings, call our activities
                desk at <span className="font-bold text-secondary">+20 95 123 4567</span>.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-[12px] font-bold text-muted-foreground">
                  Name*
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  variant="palm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-[12px] font-bold text-muted-foreground">
                  Email*
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  variant="palm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  id="activity-label"
                  htmlFor="activity"
                  className="block text-[12px] font-bold text-muted-foreground"
                >
                  Activity*
                </label>
                <input
                  id="activity"
                  name="activity"
                  value={selectedActivity}
                  readOnly
                  required
                  aria-hidden="true"
                  tabIndex={-1}
                  className="sr-only"
                />
                <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                  <SelectTrigger
                    id="activity-trigger"
                    aria-labelledby="activity-label activity-trigger"
                    aria-required="true"
                    className="h-12 rounded-xl border-border/40 bg-transparent text-sm text-muted-foreground"
                  >
                    <SelectValue placeholder="Choose an activity" />
                  </SelectTrigger>
                  <SelectContent>
                    {activities.map((activity) => (
                      <SelectItem key={activity.id} value={activity.id}>
                        {activity.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="date" className="block text-[12px] font-bold text-muted-foreground">
                  Preferred Date
                </label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  autoComplete="off"
                  variant="palm"
                  className="appearance-none text-muted-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="notes" className="block text-[12px] font-bold text-muted-foreground">
                Notes / Special Requests
              </label>
              <Textarea id="notes" name="notes" rows={5} className="resize-none" />
            </div>

            <div className="flex justify-center pt-4">
              <Button
                variant="palmPrimary"
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-full px-10 py-7 text-[13px] font-bold uppercase tracking-widest"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Submit Inquiry"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
