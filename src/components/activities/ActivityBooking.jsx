import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useAuth from "@/hooks/useAuth";
import { fetchActivitySchedules } from "@/services/activityService";
import {
  cancelActivityBooking,
  createActivityBooking,
  fetchMyActivityBookings,
  selectActiveActivityBookings,
  selectCancellingActivityBooking,
  selectCreatingActivityBooking,
} from "@/services/activityBookings/activityBookingsSlice";

const formatScheduleLabel = (schedule) =>
  `${schedule.date} - ${schedule.startTime} to ${schedule.endTime}`;

const phonePattern = /^(\+?[1-9]\d{7,14}|00[1-9]\d{7,14})$/;

const ActivityBooking = forwardRef(function ActivityBooking(
  { activities = [], initialActivityId = "", initialScheduleId = "" },
  ref
) {
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();
  const { isAuthenticated, user } = useAuth();
  const isCreating = useSelector(selectCreatingActivityBooking);
  const isCancelling = useSelector(selectCancellingActivityBooking);
  const myActiveBookings = useSelector(selectActiveActivityBookings);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [guests, setGuests] = useState("2");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [schedules, setSchedules] = useState([]);
  const sectionRef = useRef(null);

  const isSubmitting = isCreating || isCancelling;

  useEffect(() => {
    let isMounted = true;

    const loadSchedules = async () => {
      try {
        setIsLoadingSchedules(true);
        const apiSchedules = await fetchActivitySchedules();
        if (isMounted) {
          setSchedules(apiSchedules.filter((schedule) => schedule.status !== "cancelled"));
        }
      } catch {
        if (isMounted) {
          setSchedules([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingSchedules(false);
        }
      }
    };

    loadSchedules();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    void dispatch(fetchMyActivityBookings(axiosPrivate));
  }, [axiosPrivate, dispatch, isAuthenticated]);

  useEffect(() => {
    if (!initialActivityId) return;
    setSelectedActivity(initialActivityId);
  }, [initialActivityId]);

  useEffect(() => {
    if (!initialScheduleId) return;
    setSelectedSchedule(initialScheduleId);
  }, [initialScheduleId]);

  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) =>
      selectedActivity ? schedule.activityId === selectedActivity : true
    );
  }, [schedules, selectedActivity]);

  const selectedScheduleData = useMemo(
    () => filteredSchedules.find((schedule) => schedule.id === selectedSchedule) ?? null,
    [filteredSchedules, selectedSchedule]
  );

  const existingBooking = useMemo(
    () => myActiveBookings.find((booking) => booking.schedule?.id === selectedSchedule) ?? null,
    [myActiveBookings, selectedSchedule]
  );

  useEffect(() => {
    if (!existingBooking && user?.phoneNumber && !phone) {
      setPhone(user.phoneNumber);
    }
  }, [existingBooking, phone, user?.phoneNumber]);

  const totalPrice = useMemo(() => {
    if (!selectedScheduleData) return 0;

    if (selectedScheduleData.pricingType === "per_group") {
      return selectedScheduleData.resolvedPrice;
    }

    return selectedScheduleData.resolvedPrice * Number(guests || 0);
  }, [selectedScheduleData, guests]);

  const handleActivityChange = (value) => {
    setSelectedActivity(value);
    setSelectedSchedule("");
  };

  useImperativeHandle(ref, () => ({
    selectActivity(activityId, scheduleId = "") {
      setSelectedActivity(activityId);
      setSelectedSchedule(scheduleId);
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
  }));

  const resetForm = () => {
    setSelectedActivity("");
    setSelectedSchedule("");
    setGuests("2");
    setPhone("");
    setNotes("");
  };

  const handleBookingSubmit = async () => {
    const normalizedPhone = phone.trim();
    const normalizedNotes = notes.trim();

    await dispatch(
      createActivityBooking({
        axiosPrivate,
        payload: {
          scheduleId: selectedScheduleData.id,
          guests: Number(guests),
          contactPhone: normalizedPhone,
          notes: normalizedNotes,
        },
      })
    ).unwrap();

    setSchedules((current) =>
      current.map((schedule) =>
        schedule.id === selectedScheduleData.id
          ? {
              ...schedule,
              availableSeats: Math.max(schedule.availableSeats - Number(guests), 0),
              status:
                schedule.availableSeats - Number(guests) <= 0 ? "full" : schedule.status,
            }
          : schedule
      )
    );
    resetForm();
    toast.success("Activity booking created successfully.");
  };

  const handleCancelBooking = async () => {
    await dispatch(
      cancelActivityBooking({
        axiosPrivate,
        bookingId: existingBooking._id,
      })
    ).unwrap();

    setSchedules((current) =>
      current.map((schedule) =>
        schedule.id === existingBooking.schedule?.id
          ? {
              ...schedule,
              availableSeats: schedule.availableSeats + Number(existingBooking.guests || 0),
              status: "scheduled",
            }
          : schedule
      )
    );
    toast.success("Activity booking cancelled successfully.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedScheduleData) return;
    if (!isAuthenticated) {
      toast.error("Please sign in first to manage activity bookings.");
      return;
    }

    if (!existingBooking) {
      const normalizedPhone = phone.trim();
      const guestCount = Number(guests);

      if (!Number.isInteger(guestCount) || guestCount < 1) {
        toast.error("Please enter a valid number of guests.");
        return;
      }

      if (guestCount > Number(selectedScheduleData.availableSeats || 0)) {
        toast.error("Selected guests exceed the available seats for this session.");
        return;
      }

      if (!phonePattern.test(normalizedPhone)) {
        toast.error("Use a valid phone number, for example +201012345678.");
        return;
      }
    }

    try {
      if (existingBooking) {
        await handleCancelBooking();
        return;
      }

      await handleBookingSubmit();
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Failed to update activity booking"
      );
    }
  };

  return (
    <section className="border-t border-border/30">
      <div ref={sectionRef} className="container mx-auto max-w-6xl px-4 py-16 sm:py-24">
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
                Choose your preferred experience, select an available session, and confirm your
                booking instantly from your account.
              </p>
              <p>
                For urgent requests, call our activities desk at{" "}
                <span className="font-bold text-secondary">+20 95 123 4567</span>.
              </p>
            </div>

            <div className="mt-8 rounded-[2rem] border border-border/50 bg-card/60 p-6 backdrop-blur-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Booking Snapshot
              </p>

              {selectedScheduleData ? (
                <div className="mt-5 space-y-4">
                  <div>
                    <p className="text-lg font-header font-bold text-foreground">
                      {selectedScheduleData.activityTitle}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatScheduleLabel(selectedScheduleData)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-border/50 bg-background/70 px-4 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                        Seats Left
                      </p>
                      <p className="mt-2 text-sm font-bold text-foreground">
                        {selectedScheduleData.availableSeats}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border/50 bg-background/70 px-4 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                        Total
                      </p>
                      <p className="mt-2 text-sm font-bold text-secondary">${totalPrice}</p>
                    </div>
                  </div>

                  {existingBooking ? (
                    <div className="rounded-2xl border border-secondary/30 bg-secondary/10 px-4 py-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-secondary">
                        Already Booked
                      </p>
                      <p className="mt-2 text-sm leading-6 text-foreground">
                        You already booked this exact session for {existingBooking.guests} guest(s).
                        You can cancel it from here if your plans changed.
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : (
                <p className="mt-5 text-sm text-muted-foreground">
                  Select an activity and a session to preview the schedule details and price.
                </p>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label className="block text-[12px] font-bold text-muted-foreground">Activity*</label>
                <Select value={selectedActivity} onValueChange={handleActivityChange}>
                  <SelectTrigger className="h-12 rounded-xl border-border/40 bg-transparent text-sm text-muted-foreground">
                    <SelectValue placeholder="Choose an activity" />
                  </SelectTrigger>
                  <SelectContent>
                    {activities
                      .filter((activity) => activity.isActive)
                      .map((activity) => (
                        <SelectItem key={activity.id} value={activity.id}>
                          {activity.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="block text-[12px] font-bold text-muted-foreground">Session*</label>
                <Select
                  value={selectedSchedule}
                  onValueChange={setSelectedSchedule}
                  disabled={isLoadingSchedules || filteredSchedules.length === 0}
                >
                  <SelectTrigger className="h-12 rounded-xl border-border/40 bg-transparent text-sm text-muted-foreground">
                    <SelectValue
                      placeholder={isLoadingSchedules ? "Loading sessions..." : "Choose a session"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSchedules.map((schedule) => (
                      <SelectItem key={schedule.id} value={schedule.id}>
                        {formatScheduleLabel(schedule)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="guests" className="block text-[12px] font-bold text-muted-foreground">
                  Guests*
                </label>
                <Input
                  id="guests"
                  name="guests"
                  type="number"
                  min="1"
                  max={selectedScheduleData?.availableSeats || 20}
                  value={existingBooking ? String(existingBooking.guests) : guests}
                  onChange={(event) => setGuests(event.target.value)}
                  disabled={Boolean(existingBooking)}
                  required
                  variant="palm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="block text-[12px] font-bold text-muted-foreground">
                  Phone*
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+201012345678"
                  pattern="^(\\+?[1-9]\\d{7,14}|00[1-9]\\d{7,14})$"
                  value={existingBooking ? existingBooking.contactPhone : phone}
                  onChange={(event) => setPhone(event.target.value)}
                  disabled={Boolean(existingBooking)}
                  required
                  variant="palm"
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
                value={existingBooking ? existingBooking.notes ?? '' : notes}
                onChange={(event) => setNotes(event.target.value)}
                disabled={Boolean(existingBooking)}
                className="resize-none"
              />
            </div>

            <div className="flex justify-center pt-4">
              <Button
                variant={existingBooking ? "palmSecondary" : "palmPrimary"}
                type="submit"
                disabled={isSubmitting || !selectedActivity || !selectedSchedule}
                className="flex items-center gap-2 rounded-full px-10 py-7 text-[13px] font-bold uppercase tracking-widest"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {existingBooking ? 'Cancelling...' : 'Booking...'}
                  </>
                ) : existingBooking ? (
                  'Cancel Booking'
                ) : (
                  'Confirm Booking'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
});

export default ActivityBooking;
