import { NavLink } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const HERO_IMAGE =
  "https://sailing.thimpress.com/demo-mountain-hotel/wp-content/uploads/sites/27/2025/06/58c6981fd8826441d3b9cbef2ee5c60b0c3485ef-scaled.jpg";

const CAROUSEL_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1470&auto=format&fit=crop",
    alt: "Conference room with blue chairs",
  },
  {
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1469&auto=format&fit=crop",
    alt: "Meeting room with projector screen",
  },
  {
    src: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1469&auto=format&fit=crop",
    alt: "Boardroom setup",
  },
  {
    src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1470&auto=format&fit=crop",
    alt: "Conference presentation hall",
  },
];

export default function Meetings() {
  const [current, setCurrent] = useState(0);
  const total = CAROUSEL_IMAGES.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  // Show 2 images side-by-side at a time
  const visible = [
    CAROUSEL_IMAGES[current % total],
    CAROUSEL_IMAGES[(current + 1) % total],
  ];
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-main">

      {/* Hero */}
      <section className="relative w-full h-[55vh] sm:h-[65vh] lg:h-[75vh] overflow-hidden">
        <img
          src={HERO_IMAGE}
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
          {[
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 mx-auto text-[#8c9e8d]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12 20.25h.008v.008H12v-.008z" />
                </svg>
              ),
              title: "High-Speed Wi-Fi",
              desc: "Seamless internet connection for presentations, video calls, and real-time collaboration.",
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 mx-auto text-[#8c9e8d]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75.125V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m0 0h17.25m-17.25 0h17.25m0 0c.621 0 1.125.504 1.125 1.125m0 0v1.5m-1.125-1.5c.621 0 1.125.504 1.125 1.125m0 0v1.5" />
                </svg>
              ),
              title: "Projector & Screen",
              desc: "High-definition projection system for impactful visual presentations.",
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 mx-auto text-[#8c9e8d]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
              ),
              title: "Microphone & Sound System",
              desc: "Clear audio support for speeches, hybrid meetings, and larger audiences.",
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 mx-auto text-[#8c9e8d]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              ),
              title: "On-Site Catering",
              desc: "Coffee breaks, lunch, or full-service dining tailored to your event schedule.",
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="border border-border rounded-2xl p-8 flex flex-col items-center text-center gap-5 hover:shadow-md transition-shadow duration-300 bg-card"
            >
              <div>{icon}</div>
              <h3 className="font-bold text-[15px] text-foreground">{title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

      </section>

    </div>
  );
}

