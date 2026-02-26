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

        {/* Title card overlapping bottom of image */}
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

      {/* ── Create Memorable Events ───────────────────────────────────── */}
      <section className="container mx-auto px-4 max-w-6xl py-16 sm:py-20">

        {/* Top row: label | heading | paragraph */}
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

          {/* Prev arrow */}
          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-10 h-10 rounded-full bg-card border border-border shadow-md flex items-center justify-center text-foreground hover:bg-muted transition-colors z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next arrow */}
          <button
            onClick={next}
            aria-label="Next"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-10 h-10 rounded-full bg-card border border-border shadow-md flex items-center justify-center text-foreground hover:bg-muted transition-colors z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </section>

    </div>
  );
}
