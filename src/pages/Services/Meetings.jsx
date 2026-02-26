import { NavLink } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  MEETINGS_HERO_IMAGE,
  MEETINGS_CAROUSEL_IMAGES,
  MEETINGS_AMENITIES,
  EVENT_TYPES,
  GUEST_COUNT_OPTIONS,
} from "@/utils/constants";


export default function Meetings() {
  const [current, setCurrent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const total = MEETINGS_CAROUSEL_IMAGES.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  // Show 2 images side-by-side at a time
  const visible = [
    MEETINGS_CAROUSEL_IMAGES[current % total],
    MEETINGS_CAROUSEL_IMAGES[(current + 1) % total],
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Consultation request sent successfully! We'll contact you soon.", {
        position: "top-right",
        autoClose: 3000,
      });
      e.target.reset();
    } catch (error) {
      toast.error("Failed to send request. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-main">

      {/* Hero */}
      <section className="relative w-full h-[55vh] sm:h-[65vh] lg:h-[75vh] overflow-hidden">
        <img
          src={MEETINGS_HERO_IMAGE}
          alt="Meeting & Events"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50" />

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] max-w-xl">
          <div className="bg-card text-card-foreground rounded-t-2xl px-8 py-8 text-center shadow-xl transition-colors duration-300">
            <h1 className="text-3xl sm:text-4xl font-header font-medium mb-3 text-foreground">
              Meeting &amp; Events
            </h1>
            <Breadcrumb>
              <BreadcrumbList className="justify-center text-sm">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground hover:text-primary transition-colors"
                      }
                    >
                      Home
                    </NavLink>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-border">/</BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-muted-foreground">
                    Events, Meetings
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 max-w-6xl py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 items-start">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#c8a96e] mb-4">
              Professionalism and Style
            </span>
            <h2 className="text-3xl sm:text-4xl font-header font-medium text-foreground leading-tight">
              Create Memorable Events
            </h2>
          </div>
          <p className="text-[14px] sm:text-[15px] text-muted-foreground leading-relaxed lg:pt-10">
            Elevate your business meetings and special occasions with our
            state-of-the-art event facilities. Our hotel offers a range of
            elegant meeting rooms and spacious ballrooms equipped with the
            latest audiovisual technology, high-speed Wi-Fi, and flexible
            seating arrangements.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-hidden">
            {visible.map((img, idx) => (
              <div key={idx} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-all duration-500"
                />
              </div>
            ))}
          </div>

          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-10 h-10 rounded-full bg-card border border-border shadow-md flex items-center justify-center text-foreground hover:bg-muted transition-colors z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={next}
            aria-label="Next"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-10 h-10 rounded-full bg-card border border-border shadow-md flex items-center justify-center text-foreground hover:bg-muted transition-colors z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </section>

      <section className="container mx-auto px-4 max-w-6xl py-16 sm:py-20 text-center">

        <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#8c9e8d] mb-4">
          Benefits of Meeting Room
        </span>
        <h2 className="text-3xl sm:text-4xl font-black font-header text-foreground mb-4">
          Amenities Of Meeting Room
        </h2>
        <p className="text-[14px] text-muted-foreground max-w-xl mx-auto leading-relaxed mb-14">
          Whether you're hiking, kayaking, or simply exploring nature with our Saint
          Bernard dogs, every experience brings more than just fun. Here's what you'll gain.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MEETINGS_AMENITIES.map(({ id, title, desc }) => (
            <div
              key={id}
              className="border border-border rounded-2xl p-8 flex flex-col items-center text-center gap-5 hover:shadow-md transition-shadow duration-300 bg-card"
            >
              <div>
                {id === "wifi" && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 mx-auto text-[#8c9e8d]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12 20.25h.008v.008H12v-.008z" />
                  </svg>
                )}
                {id === "projector" && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 mx-auto text-[#8c9e8d]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75.125V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m0 0h17.25m-17.25 0h17.25m0 0c.621 0 1.125.504 1.125 1.125m0 0v1.5m-1.125-1.5c.621 0 1.125.504 1.125 1.125m0 0v1.5" />
                  </svg>
                )}
                {id === "audio" && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 mx-auto text-[#8c9e8d]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                )}
                {id === "catering" && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 mx-auto text-[#8c9e8d]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                )}
              </div>
              <h3 className="font-bold text-[15px] text-foreground">{title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

      </section>

      <section className="container mx-auto px-4 max-w-6xl py-16 sm:py-24 border-t border-border/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div className="max-w-md">
            <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#8c9e8d] mb-4">
              Book a Consultation
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-header text-foreground mb-6 leading-tight">
              Plan Your Event With Us
            </h2>
            <div className="space-y-6 text-[14px] sm:text-[15px] text-muted-foreground leading-relaxed">
              <p>
                Looking to host a meeting or special event? Fill out the form below
                and our event specialists will get in touch with you shortly to
                discuss your needs and help you book the perfect space.
              </p>
              <p>
                We typically respond within 24 hours. For urgent inquiries, please
                call our events team at <span className="text-[#8c9e8d] font-bold">[Hotel Phone Number]</span>.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[12px] font-bold text-muted-foreground">Name*</label>
                <input
                  type="text"
                  required
                  className="w-full h-12 px-4 rounded-xl bg-card border border-border/40 focus:border-[#8c9e8d] focus:ring-1 focus:ring-[#8c9e8d] outline-none transition-all placeholder:text-muted-foreground/30"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[12px] font-bold text-muted-foreground">Email*</label>
                <input
                  type="email"
                  required
                  className="w-full h-12 px-4 rounded-xl bg-card border border-border/40 focus:border-[#8c9e8d] focus:ring-1 focus:ring-[#8c9e8d] outline-none transition-all placeholder:text-muted-foreground/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[12px] font-bold text-muted-foreground">Phone Number*</label>
                <input
                  type="tel"
                  required
                  className="w-full h-12 px-4 rounded-xl bg-card border border-border/40 focus:border-[#8c9e8d] focus:ring-1 focus:ring-[#8c9e8d] outline-none transition-all placeholder:text-muted-foreground/30"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[12px] font-bold text-muted-foreground">Preferred Event Date</label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full h-12 px-4 rounded-xl bg-card border border-border/40 focus:border-[#8c9e8d] focus:ring-1 focus:ring-[#8c9e8d] outline-none transition-all appearance-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[12px] font-bold text-muted-foreground">Type of Event*</label>
                <select className="w-full h-12 px-4 rounded-xl bg-card border border-border/40 focus:border-[#8c9e8d] focus:ring-1 focus:ring-[#8c9e8d] outline-none transition-all appearance-none text-muted-foreground">
                  <option>—Please choose an option—</option>
                  {EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-[12px] font-bold text-muted-foreground">Estimated Number of Guests*</label>
                <select className="w-full h-12 px-4 rounded-xl bg-card border border-border/40 focus:border-[#8c9e8d] focus:ring-1 focus:ring-[#8c9e8d] outline-none transition-all appearance-none text-muted-foreground">
                  <option>—Please choose an option—</option>
                  {GUEST_COUNT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[12px] font-bold text-muted-foreground">Additional Requests / Notes</label>
              <textarea
                rows={5}
                className="w-full p-4 rounded-xl bg-card border border-border/40 focus:border-[#8c9e8d] focus:ring-1 focus:ring-[#8c9e8d] outline-none transition-all placeholder:text-muted-foreground/30 resize-none"
              ></textarea>
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-10 py-4 bg-[#8c9e8d] hover:bg-[#7a8c7b] disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-white font-bold rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 uppercase tracking-widest text-[13px] flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Book A Consultation"
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

    </div>
  );
}
