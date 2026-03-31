import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useAuth from "@/hooks/useAuth";
import {
  createTableBooking,
  selectCreatingTableBooking,
} from "@/services/restaurantBookings/restaurantBookingsSlice";

export default function RestaurantBooking() {
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();
  const { isAuthenticated } = useAuth();
  const isCreating = useSelector(selectCreatingTableBooking);

  // Form State
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState("2");

  const resetForm = () => {
    setDate("");
    setTime("");
    setGuests("2");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please sign in first to reserve a table.");
      return;
    }

    if (!date || !time) {
      toast.error("Please select both date and time.");
      return;
    }

    const guestCount = Number(guests);
    if (!Number.isInteger(guestCount) || guestCount < 1) {
      toast.error("Please enter a valid number of guests.");
      return;
    }

    try {
      const response = await dispatch(
        createTableBooking({
          axiosPrivate,
          payload: {
            date,
            time,
            guests: guestCount,
            // We let the backend auto-assign the table by not providing 'number'
          },
        })
      ).unwrap();

      resetForm();
      
      // If the backend adds to waitlist it returns a specific message, handle it nicely
      if (response && response.message) {
        toast.success(response.message);
      } else {
        toast.success("Table reserved successfully.");
      }
      
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Failed to reserve a table"
      );
    }
  };

  return (
    <section id="table-booking" className="border-t border-border/30 bg-background/50">
      <div className="container mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="max-w-md">
            <span className="mb-4 block text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">
              Plan Your Visit
            </span>
            <h2 className="mb-6 text-3xl font-header font-bold leading-tight text-foreground sm:text-4xl">
              Reserve a Table
            </h2>
            <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
              <p>
                Choose your preferred date, time, and party size. We'll find the perfect table for your dining experience or securely add you to our waitlist if we're fully booked.
              </p>
              <p>
                For large gatherings or private events, call our concierge at{" "}
                <span className="font-bold text-secondary">+20 95 123 4567</span>.
              </p>
            </div>

            <div className="mt-8 rounded-[2rem] border border-border/50 bg-card/60 p-6 backdrop-blur-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Dining Experience
              </p>
              <p className="mt-5 text-sm leading-relaxed text-foreground">
                Enjoy a carefully curated atmosphere. By providing your party size and desired time, we tailor the perfect arrangement prior to your arrival. Please make sure to arrive on time.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-6 mt-4 lg:mt-0">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="date" className="block text-[12px] font-bold text-muted-foreground">
                  Date*
                </label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  required
                  variant="palm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="time" className="block text-[12px] font-bold text-muted-foreground">
                  Time*
                </label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  required
                  variant="palm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="guests" className="block text-[12px] font-bold text-muted-foreground">
                Guests*
              </label>
              <Input
                id="guests"
                name="guests"
                type="number"
                min="1"
                max="20"
                value={guests}
                onChange={(event) => setGuests(event.target.value)}
                required
                variant="palm"
              />
            </div>

            <div className="flex justify-center sm:justify-start pt-4">
              <Button
                variant="palmPrimary"
                type="submit"
                disabled={isCreating}
                className="flex w-full sm:w-auto justify-center items-center gap-2 rounded-full px-10 py-7 text-[13px] font-bold uppercase tracking-widest"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Reserving...
                  </>
                ) : (
                  'Confirm Reservation'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
