import { useState, useEffect, useMemo, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowDownRight, Clock, Mail, MapPin, Phone, Sparkles, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import RestaurantBooking from "@/components/restaurant/RestaurantBooking";
import menuApi from "@/services/menuApi";
import { MenuPageSkeleton } from "@/components/common/loading/WebsiteSkeletons";
import { CarouselCard, SectionCarousel } from "@/components/profile/ProfileSectionParts";

const SECTION_META = {
  appetizer: { title: "Appetizers", navLabel: "Starters", kicker: "To start" },
  restaurant: { title: "Mains", navLabel: "Mains", kicker: "From the pass" },
  desserts: { title: "Desserts", navLabel: "Desserts", kicker: "Sweet finish" },
  drinks: { title: "Bar & cellar", navLabel: "Bar", kicker: "Pour & pairing" },
};

const FOOD_FALLBACK_IMG =
  "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400&h=320&fit=crop";

function formatPrice(price) {
  if (typeof price === "number") return `$${price.toFixed(0)}`;
  return String(price);
}

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

function smoothScrollToHash(hash, event) {
  const id = hash.replace(/^#/, "");
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;
  event?.preventDefault();
  const reduceMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  try {
    window.history.replaceState(null, "", hash);
  } catch {
    /* ignore */
  }
}

export default function Restaurant() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [groupedItems, setGroupedItems] = useState({});
  const [pageImages, setPageImages] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [menuRes, pageRes] = await Promise.all([
          menuApi.getGroupedMenu(),
          menuApi.getRestaurantPage(),
        ]);
        if (cancelled) return;
        const menuPayload = menuRes?.data ?? {};
        setCategories(menuPayload.categories || []);
        setGroupedItems(menuPayload.categoryMenuItems || {});
        setPageImages(pageRes?.data?.images ?? null);
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError(err?.response?.data?.message || err.message || "Failed to load restaurant content.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onInPageNavClick = useCallback((e, hash) => {
    smoothScrollToHash(hash, e);
  }, []);

  const navLinks = useMemo(() => {
    const story = { href: "#story", label: "Story" };
    const tail = [
      { href: "#room-service", label: "In-room" },
      { href: "#in-table", label: "In-table" },
      { href: "#table-booking", label: "Reserve" },
    ];
    const mid = categories.map((c) => {
      const sid = c.sectionId || c.label?.toLowerCase() || "section";
      const meta = SECTION_META[sid];
      return { href: `#${sid}`, label: meta?.navLabel ?? c.label };
    });
    return [story, ...mid, ...tail];
  }, [categories]);

  const galleryImages = useMemo(() => {
    const imgs = [];
    if (pageImages?.hero) imgs.push(pageImages.hero);
    categories.forEach((c) => {
      if (c.heroImg) imgs.push(c.heroImg);
    });
    if (pageImages?.interior) imgs.push(pageImages.interior);
    if (pageImages?.detailA) imgs.push(pageImages.detailA);
    return [...new Set(imgs)].slice(0, 8);
  }, [pageImages, categories]);

  const heroSrc = pageImages?.hero;
  const interiorSrc = pageImages?.interior;
  const detailASrc = pageImages?.detailA;
  const detailBSrc = pageImages?.detailB;
  const diningSrc = pageImages?.dining;

  if (loading) {
    return (
      <div className="text-foreground antialiased overflow-x-hidden px-4 py-10">
        <MenuPageSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <p className="text-destructive font-medium mb-4">{error}</p>
        <Button type="button" variant="palmPrimary" onClick={() => window.location.reload()}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="text-foreground antialiased overflow-x-hidden">
      <header className="min-h-[100dvh] lg:min-h-0 lg:h-[min(100dvh,900px)] grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-4 lg:gap-6 mb-10">
        <div className="relative flex flex-col justify-between rounded-2xl border border-border/60 px-6 sm:px-10 lg:px-12 py-10 lg:py-12 shadow-sm order-2 lg:order-1">
          <div className="absolute inset-0 rounded-2xl opacity-[0.06] pointer-events-none" />
          <div className="relative">
            <p className="text-primary text-[11px] sm:text-xs font-semibold tracking-[0.4em] uppercase mb-6">Palm Mirage</p>
            <h1 className="font-header text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] font-bold tracking-tight text-foreground">
              <span className="block">The</span>
              <span className="block text-primary mt-1">Restaurant</span>
            </h1>
            <p className="mt-8 text-muted-foreground text-sm sm:text-base max-w-md leading-relaxed">
              A calm dining room, seasonal cooking, and wine chosen to match the coast. Open to hotel guests and
              visitors.
            </p>
          </div>
          <div className="relative flex flex-col sm:flex-row gap-3 sm:gap-4 mt-10 lg:mt-0">
            <Button asChild variant="palmPrimary" className="text-xs uppercase tracking-[0.15em]">
              <a href="#table-booking" onClick={(e) => onInPageNavClick(e, "#table-booking")}>
                Reserve
              </a>
            </Button>
            <Button asChild variant="palmSecondary" className="text-xs uppercase tracking-[0.15em]">
              <NavLink to="/services/menu">Menus</NavLink>
            </Button>
          </div>
          <a
            href="#story"
            onClick={(e) => onInPageNavClick(e, "#story")}
            className="relative hidden lg:flex items-center gap-2 text-[11px] uppercase tracking-[0.35em] text-muted-foreground hover:text-primary transition-colors mt-8"
          >
            Scroll
            <ArrowDownRight className="w-4 h-4" strokeWidth={1.25} />
          </a>
        </div>
        <div className="relative min-h-[52vh] lg:min-h-0 order-1 lg:order-2 rounded-2xl overflow-hidden border border-border/60 shadow-sm bg-muted/30">
          {heroSrc ? (
            <img
              src={heroSrc}
              alt="The Mirage Restaurant"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = FOOD_FALLBACK_IMG;
              }}
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-transparent to-transparent lg:bg-gradient-to-l lg:from-background/70 lg:via-transparent lg:to-transparent pointer-events-none" />
          <div className="absolute bottom-6 left-6 right-6 lg:left-auto lg:right-8 lg:bottom-8 lg:max-w-xs rounded-xl border border-border/40 px-4 py-3 shadow-sm backdrop-blur-sm bg-background/80">
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-semibold">Tonight</p>
            <p className="text-foreground text-sm mt-1 font-medium leading-snug">Chef’s tasting · optional wine flight</p>
          </div>
        </div>
      </header>

      <nav
        className="restaurant-page-nav relative sticky top-0 z-50 overflow-hidden border-0 bg-transparent"
        aria-label="Restaurant page sections"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-border/45 to-transparent"
          aria-hidden="true"
        />
        <div className="restaurant-marquee-mask-x w-full overflow-hidden">
          <div className="restaurant-nav-marquee-track flex w-max py-3">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="flex shrink-0 items-center gap-10 px-6 text-xs font-semibold uppercase tracking-[0.35em] text-primary/80 whitespace-nowrap sm:gap-12 sm:px-10"
              aria-hidden={copy === 1 ? true : undefined}
            >
              {navLinks.map(({ href, label }, index) => [
                index > 0 ? (
                  <span
                    key={`${copy}-sep-${index}`}
                    className="text-primary/35 select-none"
                    aria-hidden="true"
                  >
                    ·
                  </span>
                ) : null,
                <a
                  key={`${copy}-link-${href}`}
                  href={href}
                  tabIndex={copy === 1 ? -1 : undefined}
                  onClick={(e) => onInPageNavClick(e, href)}
                  className="shrink-0 transition-colors hover:text-primary"
                >
                  {label}
                </a>,
              ])}
            </div>
          ))}
          </div>
        </div>
      </nav>

      <div className="restaurant-tagline-marquee relative overflow-hidden border-0 py-3">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-border/45 to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-px bg-gradient-to-r from-transparent via-border/45 to-transparent"
          aria-hidden="true"
        />
        <div className="restaurant-marquee-mask-x w-full overflow-hidden">
          <div className="flex w-max animate-[restaurant-marquee_32s_linear_infinite]">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="flex shrink-0 items-center gap-10 sm:gap-12 px-6 text-xs font-semibold uppercase tracking-[0.35em] text-primary/80 whitespace-nowrap"
              aria-hidden={copy === 1}
            >
              <span>Seasonal menu</span>
              <span className="text-primary/35">·</span>
              <span>Wine pairing</span>
              <span className="text-primary/35">·</span>
              <span>Private dining</span>
              <span className="text-primary/35">·</span>
              <span>Coastal ingredients</span>
              <span className="text-primary/35">·</span>
              <span>Evening service</span>
              <span className="text-primary/35">·</span>
            </div>
          ))}
          </div>
        </div>
      </div>

      <style>{`
        /* Edge fade via mask only — no overlay; page background shows through transparent regions */
        .restaurant-marquee-mask-x {
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
        }
        /* Softer / wider edge fade for the image carousel only */
        .restaurant-gallery-marquee-mask-x {
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 24%, black 76%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 24%, black 76%, transparent 100%);
          -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
        }
        @keyframes restaurant-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes restaurant-gallery-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        /* Opposite direction to gallery / lower marquee (scrolls rightward) */
        @keyframes restaurant-nav-marquee {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        .restaurant-gallery-track {
          animation: restaurant-gallery-marquee 55s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
        }
        .restaurant-nav-marquee-track {
          animation: restaurant-nav-marquee 110s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
        }
        @media (prefers-reduced-motion: reduce) {
          .restaurant-gallery-track {
            animation: none;
          }
          .restaurant-nav-marquee-track {
            animation: none;
          }
          .restaurant-gallery-wrap {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          .restaurant-page-nav {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          .restaurant-page-nav .restaurant-nav-marquee-track > div:nth-child(2) {
            display: none;
          }
          .restaurant-page-nav .restaurant-nav-marquee-track {
            width: max-content;
            max-width: none;
            margin-inline: auto;
          }
        }
      `}</style>

      <section id="story" className="scroll-mt-24 max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <motion.div {...fadeUp} className="lg:col-span-5 space-y-6">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md border border-border/50 bg-muted/20">
              {interiorSrc ? (
                <>
                  <img
                    src={interiorSrc}
                    alt="Dining room"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = FOOD_FALLBACK_IMG;
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent rounded-b-2xl" />
                  <p className="absolute bottom-5 left-5 right-5 text-white text-sm leading-relaxed drop-shadow-sm">
                    Light, texture, and quiet service—built around the way you want to eat.
                  </p>
                </>
              ) : null}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-border/50 shadow-sm bg-muted/20">
                {detailASrc ? (
                  <img
                    src={detailASrc}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = FOOD_FALLBACK_IMG;
                    }}
                  />
                ) : null}
              </div>
              <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-border/50 shadow-sm mt-8 bg-muted/20">
                {detailBSrc ? (
                  <img
                    src={detailBSrc}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = FOOD_FALLBACK_IMG;
                    }}
                  />
                ) : null}
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="lg:col-span-7 lg:pt-6">
            <span className="inline-flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-[0.25em]">
              <Sparkles className="w-4 h-4" strokeWidth={1.5} />
              The room
            </span>
            <h2 className="font-header text-4xl md:text-5xl lg:text-6xl font-bold mt-4 leading-[1.05] text-foreground">
              Tables set
              <br />
              <span className="text-primary">for the evening</span>
            </h2>
            <p className="mt-8 text-muted-foreground leading-relaxed text-base max-w-xl border-l-2 border-primary/40 pl-6">
              We keep the menu tight so every plate leaves the kitchen with intention. Ask our team for pairings—or
              choose from the cellar list on your own time.
            </p>

            <div className="mt-12 grid sm:grid-cols-2 gap-4">
              {[
                { Icon: Phone, t: "Call", v: "+1 2345 6789" },
                { Icon: Mail, t: "Email", v: "mountain.hotel@gmail.com" },
                { Icon: MapPin, t: "Find us", v: "269 Southwark Park Rd., London SE16 3TP" },
                { Icon: Clock, t: "Hours", v: "Daily · 12:30 pm – 10:00 pm" },
              ].map(({ Icon, t, v }) => (
                <div
                  key={t}
                  className="group flex gap-4 p-5 rounded-2xl border border-border/60 hover:border-primary/30 transition-colors"
                >
                  <Icon className="w-5 h-5 text-primary shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">{t}</p>
                    <p className="text-sm font-medium mt-1 leading-snug text-foreground">{v}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {galleryImages.length > 0 ? (
        <section className="py-10" aria-label="Restaurant image gallery">
          <div className="restaurant-gallery-wrap restaurant-gallery-marquee-mask-x hide-scrollbar w-full overflow-hidden cursor-default">
            <div className="restaurant-gallery-track flex w-max gap-4 px-4 sm:px-6">
              {galleryImages.map((src, i) => (
                <div
                  key={`g-a-${i}-${src}`}
                  className="shrink-0 w-[min(72vw,280px)] sm:w-[min(50vw,320px)] aspect-[4/5] rounded-2xl overflow-hidden border border-border/50 shadow-md bg-muted/20"
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = FOOD_FALLBACK_IMG;
                    }}
                  />
                </div>
              ))}
              {galleryImages.map((src, i) => (
                <div
                  key={`g-b-${i}-${src}`}
                  className="shrink-0 w-[min(72vw,280px)] sm:w-[min(50vw,320px)] aspect-[4/5] rounded-2xl overflow-hidden border border-border/50 shadow-md bg-muted/20"
                  aria-hidden="true"
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = FOOD_FALLBACK_IMG;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {categories.length === 0 ? (
        <div className="max-w-6xl mx-auto px-4 py-16 text-center text-muted-foreground">
          No menu categories yet. Add items in the dashboard or run the seed script.
        </div>
      ) : (
        categories.map((cat, idx) => {
          const sid = cat.sectionId || cat.label?.toLowerCase() || `cat-${idx}`;
          const meta = SECTION_META[sid] ?? { title: cat.label, kicker: cat.label };
          const dishes = groupedItems[cat.label] || [];
          return (
            <section key={sid} id={sid} className="scroll-mt-24 py-20 md:py-28">
              <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <motion.div {...fadeUp} className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-14 md:mb-20">
                  <div className={`lg:col-span-5 ${idx % 2 === 1 ? "lg:order-2" : ""}`}>
                    <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-md aspect-[4/5] max-h-[520px] mx-auto lg:mx-0 bg-muted/20">
                      {cat.heroImg ? (
                        <img
                          src={cat.heroImg}
                          alt={meta.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = FOOD_FALLBACK_IMG;
                          }}
                        />
                      ) : null}
                    </div>
                  </div>
                  <div className={`lg:col-span-7 ${idx % 2 === 1 ? "lg:order-1" : ""}`}>
                    <p className="text-xs font-bold uppercase tracking-[0.35em] text-primary">{meta.kicker}</p>
                    <h2 className="font-header text-4xl md:text-5xl font-bold mt-3 text-foreground">{meta.title}</h2>
                    <div className="mt-8 h-px w-16 bg-primary" />
                  </div>
                </motion.div>

                {dishes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No dishes in this section yet.</p>
                ) : (
                  <SectionCarousel
                    items={dishes}
                    getItemKey={(d) => String(d.id)}
                    renderItem={(d) => (
                      <CarouselCard className="group h-full overflow-hidden p-0 transition-colors hover:border-primary/35">
                        <div className="relative aspect-[4/3] overflow-hidden border-b border-border/40 bg-muted/30">
                          <img
                            src={d.image}
                            alt=""
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                            onError={(e) => {
                              e.target.src = FOOD_FALLBACK_IMG;
                            }}
                          />
                          <span className="absolute left-4 top-4 rounded-full bg-card/90 px-3 py-1 font-header text-sm font-bold tabular-nums text-primary shadow-sm backdrop-blur-sm">
                            {formatPrice(d.price)}
                          </span>
                        </div>
                        <div className="flex flex-1 flex-col p-5">
                          <h3 className="font-header text-lg font-bold leading-tight text-foreground">{d.name}</h3>
                          <p className="mt-3 line-clamp-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                            {d.description}
                          </p>
                          <div className="mt-5 border-t border-border/40 pt-4">
                            <a
                              href="#table-booking"
                              onClick={(e) => onInPageNavClick(e, "#table-booking")}
                              className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary underline-offset-4 hover:underline"
                            >
                              Add to evening
                            </a>
                          </div>
                        </div>
                      </CarouselCard>
                    )}
                  />
                )}
              </div>
            </section>
          );
        })
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex justify-center">
        <Button asChild variant="palmSecondary" className="text-xs uppercase tracking-[0.15em]">
          <NavLink to="/services/menu">Full menu</NavLink>
        </Button>
      </div>

      <section id="room-service" className="scroll-mt-24 max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <motion.div {...fadeUp} className="relative aspect-[4/3] lg:aspect-[5/6] rounded-2xl overflow-hidden border border-border/50 shadow-md bg-muted/20">
            {diningSrc ? (
              <img
                src={diningSrc}
                alt="In-room dining"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = FOOD_FALLBACK_IMG;
                }}
              />
            ) : null}
          </motion.div>
          <motion.div {...fadeUp}>
            <p className="text-primary text-xs font-bold uppercase tracking-[0.35em]">Room service</p>
            <h2 className="font-header text-4xl md:text-5xl font-bold text-foreground mt-4 leading-[1.05]">
              In-room dining
            </h2>
            <p className="mt-8 text-muted-foreground leading-relaxed">
              The same kitchen, delivered quietly to your suite—breakfast through late night.
            </p>
            <ul className="mt-10 space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="w-px bg-primary shrink-0 rounded-full" />
                <span>
                  <strong className="text-foreground">Serves:</strong> Breakfast, lunch, dinner, snacks
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-px bg-primary shrink-0 rounded-full" />
                <span>
                  <strong className="text-foreground">Phone:</strong> +41 22 345 66 77
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-px bg-primary shrink-0 rounded-full" />
                <span>
                  <strong className="text-foreground">Hours:</strong> 10:00 am – 10:00 pm
                </span>
              </li>
            </ul>
            <Button asChild variant="palmPrimary" className="mt-12 text-xs uppercase tracking-[0.15em]">
              <a href="#table-booking" onClick={(e) => onInPageNavClick(e, "#table-booking")}>
                Order to room
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      <section id="in-table" className="scroll-mt-24 max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28 border-t border-border/30">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <motion.div {...fadeUp} className="lg:order-1">
            <span className="inline-flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-[0.25em]">
              <UtensilsCrossed className="w-4 h-4" strokeWidth={1.5} />
              In the dining room
            </span>
            <h2 className="font-header text-4xl md:text-5xl font-bold text-foreground mt-4 leading-[1.05]">
              In-table
              <br />
              <span className="text-primary">dining</span>
            </h2>
            <p className="mt-8 text-muted-foreground leading-relaxed">
              Take a seat in the main room or a quieter corner—same menu, full service, and our team on the floor for
              wine and pacing. Perfect when you want the full restaurant atmosphere, not just a quick bite.
            </p>
            <ul className="mt-10 space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="w-px bg-primary shrink-0 rounded-full" />
                <span>
                  <strong className="text-foreground">Tables:</strong> Two to eight guests; larger parties on request
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-px bg-primary shrink-0 rounded-full" />
                <span>
                  <strong className="text-foreground">Evenings:</strong> Walk-ins welcome when space allows—booking
                  recommended
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-px bg-primary shrink-0 rounded-full" />
                <span>
                  <strong className="text-foreground">Dress:</strong> Smart casual; we keep the room relaxed
                </span>
              </li>
            </ul>
            <Button asChild variant="palmPrimary" className="mt-12 text-xs uppercase tracking-[0.15em]">
              <a href="#table-booking" onClick={(e) => onInPageNavClick(e, "#table-booking")}>
                Reserve a table
              </a>
            </Button>
          </motion.div>
          <motion.div
            {...fadeUp}
            className="relative aspect-[4/3] lg:aspect-[5/6] rounded-2xl overflow-hidden border border-border/50 shadow-md bg-muted/20 lg:order-2"
          >
            {(detailBSrc || interiorSrc || heroSrc) ? (
              <img
                src={detailBSrc || interiorSrc || heroSrc}
                alt="In-table dining at Palm Mirage"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = FOOD_FALLBACK_IMG;
                }}
              />
            ) : null}
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <RestaurantBooking />
      </div>
    </div>
  );
}
