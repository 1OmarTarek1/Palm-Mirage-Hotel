import { NavLink, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    id: 1,
    image:
      "https://sailing.thimpress.com/demo-mountain-hotel/wp-content/uploads/sites/27/2025/06/berry-cake-with-milk-cream-blueberry-jam-blue-ceramic-plate-isolated-white-background-1.png",
    imageAlt: "Image food",
    title: "Salted Caramel Tart",
    desc: "Salted caramel custard tart, vanilla ice-cream.",
    price: "$16",
  },
  {
    id: 2,
    image:
      "https://sailing.thimpress.com/demo-mountain-hotel/wp-content/uploads/sites/27/2025/06/berry-cake-with-milk-cream-blueberry-jam-blue-ceramic-plate-isolated-white-background-1-1.png",
    imageAlt: "Image food",
    title: "Salted Caramel Tart",
    desc: "Salted caramel custard tart, vanilla ice-cream.",
    price: "$16",
  },
  {
    id: 3,
    image:
      "https://sailing.thimpress.com/demo-mountain-hotel/wp-content/uploads/sites/27/2025/06/berry-cake-with-milk-cream-blueberry-jam-blue-ceramic-plate-isolated-white-background-1-2.png",
    imageAlt: "Image food",
    title: "Salted Caramel Tart",
    desc: "Salted caramel custard tart, vanilla ice-cream.",
    price: "$16",
  },
  {
    id: 4,
    image:
      "https://sailing.thimpress.com/demo-mountain-hotel/wp-content/uploads/sites/27/2025/06/berry-cake-with-milk-cream-blueberry-jam-blue-ceramic-plate-isolated-white-background-1-3.png",
    imageAlt: "Image food",
    title: "Salted Caramel Tart",
    desc: "Salted caramel custard tart, vanilla ice-cream.",
    price: "$16",
  },
  {
    id: 5,
    image:
      "https://sailing.thimpress.com/demo-mountain-hotel/wp-content/uploads/sites/27/2025/06/berry-cake-with-milk-cream-blueberry-jam-blue-ceramic-plate-isolated-white-background-1.png",
    imageAlt: "Image food",
    title: "Salted Caramel Tart",
    desc: "Salted caramel custard tart, vanilla ice-cream.",
    price: "$16",
  },
];

const slides = [
  {
    id: 1,
    image: "https://sailing.thimpress.com/demo-mountain-hotel/wp-content/uploads/sites/27/2025/06/Page-title.png",
    imageAlt: "Image food",
    subtitle: "",
  },
  {
    id: 2,
    image: "https://sailing.thimpress.com/demo-mountain-hotel/wp-content/uploads/sites/27/2025/06/Curious.png",
    imageAlt: "Image food",
  },
  {
    id: 3,
    image:
      "https://sailing.thimpress.com/demo-mountain-hotel/wp-content/uploads/sites/27/2025/06/surfer-rides-wave-blue-wave-2.png",
    imageAlt: "Image food",
  },
  {
    id: 4,
    image:
      "https://sailing.thimpress.com/demo-mountain-hotel/wp-content/uploads/sites/27/2025/06/surfer-rides-wave-blue-wave-1.png",
    imageAlt: "Image food",
  },
  {
    id: 5,
    image: "https://sailing.thimpress.com/demo-mountain-hotel/wp-content/uploads/sites/27/2025/06/Desserts.png",
    imageAlt: "Image food",
  },
  {
    id: 6,
    image: "https://sailing.thimpress.com/demo-mountain-hotel/wp-content/uploads/sites/27/2025/06/Main-menu.png",
    imageAlt: "Image food",
  },
  {
    id: 7,
    image: "https://sailing.thimpress.com/demo-mountain-hotel/wp-content/uploads/sites/27/2025/06/Drinks.png",
    imageAlt: "Image food",
  },
  {
    id: 8,
    image: "https://sailing.thimpress.com/demo-mountain-hotel/wp-content/uploads/sites/27/2025/06/Dining.png",
    imageAlt: "Image food",
  },
];

export default function Restaurant() {
  const heroSlide = slides.find((s) => s.id === 1);
  const secondSlideImg1 = slides.find((s) => s.id === 2);
  const secondSlideImg2 = slides.find((s) => s.id === 3);
  const secondSlideImg3 = slides.find((s) => s.id === 4);
  const therdSlideImg4 = slides.find((s) => s.id === 5);
  const therdSlideImg5 = slides.find((s) => s.id === 6);
  const therdSlideImg6 = slides.find((s) => s.id === 7);
  const therdSlideImg7 = slides.find((s) => s.id === 8);

  return (
    <>
      <section className="container">
        <div className="">
          {/* ── section-1 : Hero Image  ── */}
          <div className="section-1 w-full mb-10">
            <div className="relative w-full   left-1/2 -translate-x-1/2">
              <img src={heroSlide.image} alt={heroSlide.imageAlt} className="w-full object-cover" />
            </div>
          </div>

          {/* ── section-2 : About  ── */}
          <div className="container mx-auto px-3">
            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {/* Column 1: Image + Title */}
              <div className="flex flex-col gap-6">
                <div className="rounded-3xl overflow-hidden shadow-xl border border-border/10">
                  <img
                    src={secondSlideImg1.image}
                    alt={secondSlideImg1.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h1 className="text-3xl md:text-5xl font-header leading-tight text-foreground font-bold">
                  Curious About Surfing? Discover Our San Diego Surf Lessons
                </h1>
              </div>

              {/* Column 2: Center (Image + Info + Buttons) */}
              <div className="flex flex-col gap-8">
                {/* Middle Image */}
                <div className="rounded-3xl overflow-hidden ">
                  <img
                    src={secondSlideImg2.image}
                    alt={secondSlideImg2.imageAlt}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Contact Info with Lucide Icons */}
                <div className="space-y-5 text-muted-foreground">
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <Phone className="w-5 h-5" />
                    </div>
                    <p className="text-sm md:text-base font-medium">+1 2345 6789</p>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <Mail className="w-5 h-5" />
                    </div>
                    <p className="text-sm md:text-base font-medium">mountain.hotel@gmail.com</p>
                  </div>
                  <div className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-white shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <p className="text-sm md:text-base leading-relaxed font-medium">
                      Location: 269 Southwark Park Rd., London SE16 3TP, UK
                    </p>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <Clock className="w-5 h-5" />
                    </div>
                    <p className="text-sm md:text-base font-medium">Everyday: 0:30pm - 10:00pm</p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-4 text-center mt-4">
                  <Button asChild variant="palmPrimary">
                    <NavLink to="/contact">Book A Table</NavLink>
                  </Button>
                  <Button asChild variant="palmSecondary">
                    <NavLink to="/services/menu">Browse Menus</NavLink>
                  </Button>
                </div>
              </div>

              {/* Column 3: Tall Side Image */}
              <div className="h-full">
                <div className="rounded-[40px] overflow-hidden  md:h-full ">
                  <img
                    src={secondSlideImg3.image}
                    alt={secondSlideImg3.imageAlt}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── section-3 : menus ── */}
          <div className="w-full mx-auto my-10 ">
            {/* part one  */}
            <div className="w-full flex flex-col lg:flex-row items-center py-4">
              {/* left part photo*/}
              <div className="    relative m-2 ">
                {/*slide number*/}
                <div className="absolute top-0 right-0 rounded-bl-3xl p-6 text-right bg-card/90 backdrop-blur-md border-b border-l border-border/20 z-10 shadow-xl">
                  <span className="text-[80px] md:text-[120px] font-header leading-none text-primary/10 block font-bold">
                    01
                  </span>
                  <h2 className="text-3xl md:text-5xl font-header text-foreground font-bold -mt-4">Desserts</h2>
                </div>

                {/*main img*/}
                <div className="  shadow-2xl">
                  <img src={therdSlideImg4.image} alt={therdSlideImg4.imageAlt} className="w-full object-cover" />
                </div>
              </div>

              {/*part right menue */}
              <div className=" px-4 flex flex-col m-2">
                {/* frist section  */}
                <div className="w-full py-3">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-center gap-4 md:gap-4 p-4 border-b border-border/50 last:border-0 transition-all hover:bg-primary/2 rounded-xl"
                    >
                      {/* food img*/}
                      <div className="shrink-0 rounded-full overflow-hidden border-2 border-border/20 group-hover:border-primary transition-all w-16 h-16 md:w-20 md:h-20 shadow-sm">
                        <img
                          src={item.image}
                          alt={item.imageAlt}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      {/* desc*/}
                      <div className="grow">
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="text-xl md:text-2xl font-header text-foreground group-hover:text-primary transition-colors font-bold">
                            {item.title}
                          </h3>
                          <span className="text-lg md:text-xl font-header text-primary font-bold">{item.price}</span>
                        </div>
                        <p className="text-muted-foreground text-sm md:text-base italic leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* button*/}
                <div className="mt-8 flex justify-center lg:justify-start">
                  <Button asChild variant="palmSecondary" size="lg">
                    <NavLink to="/contact">Reserve Now</NavLink>
                  </Button>
                </div>
              </div>
            </div>

            {/* part two */}
            <div className="w-full flex flex-col lg:flex-row items-center py-4">
              {/*left part  menue */}
              <div className=" px-4 flex flex-col m-2">
                {/* frist section  */}
                <div className="w-full py-3">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-center gap-4 md:gap-4 p-4 border-b border-border/50 last:border-0 transition-all hover:bg-primary/2 rounded-xl"
                    >
                      {/* food img*/}
                      <div className="shrink-0 rounded-full overflow-hidden border-2 border-border/20 group-hover:border-primary transition-all w-16 h-16 md:w-20 md:h-20 shadow-sm">
                        <img
                          src={item.image}
                          alt={item.imageAlt}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      {/* desc*/}
                      <div className="grow">
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="text-xl md:text-2xl font-header text-foreground group-hover:text-primary transition-colors font-bold">
                            {item.title}
                          </h3>
                          <span className="text-lg md:text-xl font-header text-primary font-bold">{item.price}</span>
                        </div>
                        <p className="text-muted-foreground text-sm md:text-base italic leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* button*/}
                <div className="mt-8 flex justify-center lg:justify-start">
                  <Button asChild variant="palmSecondary" size="lg">
                    <NavLink to="/contact">Reserve Now</NavLink>
                  </Button>
                </div>
              </div>

              {/* right part photo*/}
              <div className="    relative m-2 ">
                {/*slide number*/}
                <div className="absolute top-0 right-0 rounded-bl-3xl p-6 text-right bg-card/90 backdrop-blur-md border-b border-l border-border/20 z-10 shadow-xl">
                  <span className="text-[80px] md:text-[120px] font-header leading-none text-primary/10 block font-bold">
                    02
                  </span>
                  <h2 className="text-3xl md:text-5xl font-header text-foreground font-bold -mt-4">Main Course</h2>
                </div>

                {/*main img*/}
                <div className="  shadow-2xl">
                  <img src={therdSlideImg5.image} alt={therdSlideImg5.imageAlt} className="w-full object-cover" />
                </div>
              </div>
            </div>

            {/* part three */}

            <div className="w-full flex flex-col lg:flex-row items-center py-4">
              {/* left part photo*/}
              <div className="    relative m-2 ">
                {/*slide number*/}
                <div className="absolute top-0 right-0 rounded-bl-3xl p-6 text-right bg-card/90 backdrop-blur-md border-b border-l border-border/20 z-10 shadow-xl">
                  <span className="text-[80px] md:text-[120px] font-header leading-none text-primary/10 block font-bold">
                    03
                  </span>
                  <h2 className="text-3xl md:text-5xl font-header text-foreground font-bold -mt-4">Drinks</h2>
                </div>

                {/*main img*/}
                <div className="  shadow-2xl">
                  <img src={therdSlideImg6.image} alt={therdSlideImg6.imageAlt} className="w-full object-cover" />
                </div>
              </div>

              {/*part right menue */}
              <div className=" px-4 flex flex-col m-2">
                {/* frist section  */}
                <div className="w-full py-3">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-center gap-4 md:gap-4 p-4 border-b border-border/50 last:border-0 transition-all hover:bg-primary/2 rounded-xl"
                    >
                      {/* food img*/}
                      <div className="shrink-0 rounded-full overflow-hidden border-2 border-border/20 group-hover:border-primary transition-all w-16 h-16 md:w-20 md:h-20 shadow-sm">
                        <img
                          src={item.image}
                          alt={item.imageAlt}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      {/* desc*/}
                      <div className="grow">
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="text-xl md:text-2xl font-header text-foreground group-hover:text-primary transition-colors font-bold">
                            {item.title}
                          </h3>
                          <span className="text-lg md:text-xl font-header text-primary font-bold">{item.price}</span>
                        </div>
                        <p className="text-muted-foreground text-sm md:text-base italic leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* button*/}
                <div className="mt-8 flex justify-center lg:justify-start">
                  <Button asChild variant="palmSecondary" size="lg">
                    <NavLink to="/contact">Reserve Now</NavLink>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* section-4  */}
          <div className="section-4 p-5 relative w-full h-dvh left-1/2 -translate-x-1/2 overflow-hidden group">
            <img
              src={therdSlideImg7.image}
              alt={therdSlideImg7.imageAlt}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10" />
            {/* Glassmorphism Card */}
            <div className="container mx-auto h-full flex items-center px-6 relative z-10">
              <div className="w-full max-w-xl bg-card/40 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[40px] text-foreground shadow-2xl">
                <span className="block text-sm md:text-base tracking-[0.2em] uppercase mb-4 text-primary font-bold">
                  Dedicated Room Service
                </span>
                <h1 className="text-4xl md:text-6xl font-header mb-8 leading-tight font-bold">In-Room Dining</h1>
                <div className=" py-8">
                  <p className="text-muted-foreground text-sm md:text-lg leading-relaxed">
                    Refuel on your own schedule with seasonal, locally fresh items delivered to your door.
                  </p>

                  {/*Lucide Icons */}
                  <ul className="px-4 py-4 space-y-3 text-muted-foreground">
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                      <p className="text-sm md:text-base">
                        <span className="font-bold text-foreground">Serves:</span> Breakfast, Lunch, Dinner, Snacks
                      </p>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                      <p className="text-sm md:text-base">
                        <span className="font-bold text-foreground">Phone:</span> +41 22 345 66 77
                      </p>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                      <p className="text-sm md:text-base">
                        <span className="font-bold text-foreground">Hours:</span> 10:00 am - 10:00 pm
                      </p>
                    </li>
                  </ul>
                </div>
                {/* زر الحجز الملون */}
                <Button
                  asChild
                  variant="palmPrimary"
                  className="w-full"
                >
                  <Link to="/contact">Reserve Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
