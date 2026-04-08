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
  addPendingActivityBooking,
} from "@/store/slices/cartSlice";
import { useFlyToCart } from "@/hooks/useFlyToCart";

const formatScheduleLabel = (schedule) =>
  `${schedule.date} - ${schedule.startTime} to ${schedule.endTime}`;

const phonePattern = /^[\d\s()+-]+$/;

const ActivityBooking = forwardRef(function ActivityBooking(
  { activities = [], initialActivityId = "", initialScheduleId = "" },
  ref
) {
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();
  const { isAuthenticated, user } = useAuth();
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [guests, setGuests] = useState("2");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [schedules, setSchedules] = useState([]);
  const sectionRef = useRef(null);
  const submitBtnRef = useRef(null);
  const { flyToCart } = useFlyToCart();

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
    const params = new URLSearchParams(window.location.search);
    const pay = params.get("payment");
    if (pay === "success") {
      toast.success("Payment successful - your activity booking is confirmed.");
      window.history.replaceState({}, "", window.location.pathname);
    } else if (pay === "cancel") {
      toast.info("Card payment was cancelled.");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

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
      selectedActivity ? String(schedule.activityId) === String(selectedActivity) : true
    );
  }, [schedules, selectedActivity]);

  const selectedScheduleData = useMemo(
    () => filteredSchedules.find((schedule) => schedule.id === selectedSchedule) ?? null,
    [filteredSchedules, selectedSchedule]
  );

  const existingBooking = null; // Simplified for now - no existing bookings in Redux version
  const isPaidExistingBooking = false;
  const isAwaitingPayment = false;

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

  const handleScheduleChange = (value) => {
    setSelectedSchedule(value);
    if (!selectedActivity) {
      const schedule = schedules.find(s => String(s.id) === value);
      if (schedule && schedule.activityId) {
        setSelectedActivity(schedule.activityId);
      }
    }
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

    // Create booking data object and add to Redux store
    const bookingData = {
      activityId: selectedScheduleData.activityId,
      activityTitle: selectedScheduleData.activityTitle,
      scheduleId: selectedScheduleData.id,
      scheduleDate: selectedScheduleData.date,
      startTime: selectedScheduleData.startTime,
      endTime: selectedScheduleData.endTime,
      guests: Number(guests),
      contactPhone: normalizedPhone,
      notes: normalizedNotes,
      pricingType: selectedScheduleData.pricingType,
      price: selectedScheduleData.pricingType === "per_group"
        ? (selectedScheduleData.resolvedPrice / Number(guests))
        : (selectedScheduleData.resolvedPrice || 0),
      activityImage: (() => {
        const act = activities.find(a => String(a._id || a.id) === String(selectedActivity));
        if (!act) return "";
        if (typeof act.image === "string") return act.image;
        return act.image?.secure_url || act.image?.url || "";
      })()
    };

    // Add to Redux store
    dispatch(addPendingActivityBooking({
      ...bookingData,
      id: Date.now().toString(), // temporary ID
      createdAt: new Date().toISOString()
    }));

    if (submitBtnRef.current) {
      flyToCart(submitBtnRef.current, "navbar-cart-button");
    }
    toast.success("Activity booking added to cart.");
    
    // Clear inputs upon adding successfully
    resetForm();
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

  const handlePayExistingCard = async () => {
    if (!existingBooking?._id) return;
    try {
      const checkout = await dispatch(
        createActivityCheckoutSession({
          axiosPrivate,
          activityBookingId: existingBooking._id,
        })
      ).unwrap();
      if (checkout?.url) {
        window.location.href = checkout.url;
      }
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : error?.message || "Could not start payment"
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedScheduleData) return;
    if (!isAuthenticated) {
      toast.info("Please sign in first to manage activity bookings.");
      return;
    }

    if (!existingBooking) {
      const normalizedPhone = phone.trim();
      const compactPhone = normalizedPhone.replace(/[^\d+]/g, "");
      const guestCount = Number(guests);

      if (!Number.isInteger(guestCount) || guestCount < 1) {
        toast.info("Please enter a valid number of guests.");
        return;
      }

      if (guestCount > Number(selectedScheduleData.availableSeats || 0)) {
        toast.info("Selected guests exceed the available seats for this session.");
        return;
      }

      if (!phonePattern.test(normalizedPhone) || compactPhone.replace(/\D/g, "").length < 7) {
        toast.info("Use a valid phone number.");
        return;
      }
    }

    try {
      if (existingBooking) {
        if (isPaidExistingBooking) {
          toast.info("Paid bookings are view-only and cannot be cancelled from your account.");
          return;
        }

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
                        {isPaidExistingBooking
                          ? `You already booked and paid for this session for ${existingBooking.guests} guest(s). It is view-only from your account.`
                          : isAwaitingPayment
                            ? `Complete card payment to confirm ${existingBooking.guests} guest(s), or cancel this request.`
                            : `You already booked this exact session for ${existingBooking.guests} guest(s). You can cancel it from here if your plans changed.`}
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

          <form onSubmit={handleSubmit} noValidate className="w-full space-y-6">
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
                        <SelectItem key={activity.id} value={String(activity.id)}>
                          {activity.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedActivity && (
                <div className="space-y-2 sm:col-span-2">
                  <label className="block text-[12px] font-bold text-muted-foreground">Session*</label>
                  <Select
                    value={selectedSchedule}
                    onValueChange={handleScheduleChange}
                    disabled={isLoadingSchedules || filteredSchedules.length === 0}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-border/40 bg-transparent text-sm text-muted-foreground">
                      <SelectValue
                        placeholder={isLoadingSchedules ? "Loading sessions..." : "Choose a session"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredSchedules.length === 0 ? (
                        <div className="py-4 text-center text-sm text-muted-foreground">
                          No available sessions right now.
                        </div>
                      ) : (
                        filteredSchedules.map((schedule) => (
                          <SelectItem key={schedule.id} value={String(schedule.id)}>
                            {formatScheduleLabel(schedule)}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
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

            <div className="flex flex-col items-center gap-3 pt-4 sm:flex-row sm:justify-center">
              {isAwaitingPayment ? (
                <>
                  <Button
                    type="button"
                    variant="palmPrimary"
                    disabled={checkoutLoading}
                    onClick={() => void handlePayExistingCard()}
                    className="flex items-center gap-2 rounded-full px-10 py-7 text-[13px] font-bold uppercase tracking-widest"
                  >
                    {checkoutLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Redirecting…
                      </>
                    ) : (
                      "Pay with card"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="palmSecondary"
                    disabled={isCancelling}
                    onClick={() => void handleCancelBooking().catch(() => null)}
                    className="flex items-center gap-2 rounded-full px-10 py-7 text-[13px] font-bold uppercase tracking-widest"
                  >
                    {isCancelling ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Cancelling…
                      </>
                    ) : (
                      "Cancel request"
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  ref={submitBtnRef}
                  variant={existingBooking ? "palmSecondary" : "palmPrimary"}
                  type="submit"
                  disabled={isSubmitting || !selectedActivity || !selectedSchedule || isPaidExistingBooking}
                  className="flex h-10 items-center gap-2 rounded-full px-6 text-xs font-bold uppercase tracking-[0.12em]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {existingBooking ? "Cancelling..." : "Adding..."}
                    </>
                  ) : isPaidExistingBooking ? (
                    "Paid Booking"
                  ) : existingBooking ? (
                    "Cancel Booking"
                  ) : (
                    "Add to cart"
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
});

export default ActivityBooking;
