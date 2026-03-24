import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { ACTIVITIES_DATA } from "@/data/activitiesData";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ActivityBooking() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(
        "Your activity inquiry has been sent! We'll contact you shortly."
      );
      e.target.reset();
      setSelectedActivity("");
    } catch {
      toast.error("Failed to send inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="border-t border-border/30">
      <div className="container mx-auto px-4 max-w-6xl py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Info */}
          <div className="max-w-md">
            <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-4">
              Plan Your Adventure
            </span>
            <h2 className="text-3xl sm:text-4xl font-header font-bold text-foreground mb-6 leading-tight">
              Book an Activity
            </h2>
            <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
              <p>
                Ready to explore? Fill out the form and our concierge team will
                craft the perfect itinerary for your stay in Luxor. Whether
                you're seeking adventure or relaxation, we'll make it
                unforgettable.
              </p>
              <p>
                We typically respond within 24 hours. For urgent bookings, call
                our activities desk at{" "}
                <span className="text-secondary font-bold">
                  +20 95 123 4567
                </span>
                .
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="activity" className="block text-[12px] font-bold text-muted-foreground">
                  Activity*
                </label>
                <Select 
                  value={selectedActivity} 
                  onValueChange={setSelectedActivity}
                  required
                >
                  <SelectTrigger className="w-full h-12 rounded-xl bg-transparent border border-border/40 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all text-muted-foreground">
                    <SelectValue placeholder="— Choose an activity —" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACTIVITIES_DATA.map((act) => (
                      <SelectItem key={act.id} value={act.id}>
                        {act.title}
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
              <Textarea
                id="notes"
                name="notes"
                rows={5}
                className="resize-none"
              />
            </div>

            <div className="flex justify-center pt-4">
              <Button
                variant="palmPrimary"
                type="submit"
                disabled={isSubmitting}
                className="px-10 py-7 rounded-full text-[13px] font-bold tracking-widest uppercase flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
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
