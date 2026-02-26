import { NavLink } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const menuItems = [
  {
    id: 1,
    image: "https://sailing.thimpress.com/demo-mountain-hotel/…lue-ceramic-plate-isolated-white-background-1.png",
    imageAlt: "Image food",
    title: "Salted Caramel Tart",
    desc: "Salted caramel custard tart, vanilla ice-cream.",
    price: "$16",
  },
  {
    id: 2,
    image: "https://sailing.thimpress.com/demo-mountain-hotel/…e-ceramic-plate-isolated-white-background-1-1.png",
    imageAlt: "Image food",
    title: "Salted Caramel Tart",
    desc: "Salted caramel custard tart, vanilla ice-cream.",
    price: "$16",
  },
  {
    id: 3,
    image: "https://sailing.thimpress.com/demo-mountain-hotel/…e-ceramic-plate-isolated-white-background-1-2.png",
    imageAlt: "Image food",
    title: "Salted Caramel Tart",
    desc: "Salted caramel custard tart, vanilla ice-cream.",
    price: "$16",
  },
  {
    id: 4,
    image: "https://sailing.thimpress.com/demo-mountain-hotel/…e-ceramic-plate-isolated-white-background-1-3.png",
    imageAlt: "Image food",
    title: "Salted Caramel Tart",
    desc: "Salted caramel custard tart, vanilla ice-cream.",
    price: "$16",
  },
  {
    id: 5,
    image: "https://sailing.thimpress.com/demo-mountain-hotel/…lue-ceramic-plate-isolated-white-background-1.png",
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
    imageAlt: "",
  },
  {
    id: 3,
    image: "https://sailing.thimpress.com/demo-mountain-hotel/…ites/27/2025/06/surfer-rides-wave-blue-wave-2.png",
    imageAlt: "",
  },
  {
    id: 4,
    image: "https://sailing.thimpress.com/demo-mountain-hotel/…ites/27/2025/06/surfer-rides-wave-blue-wave-1.png",
    imageAlt: "",
  },
  {
    id: 5,
    image: "https://sailing.thimpress.com/demo-mountain-hotel/wp-content/uploads/sites/27/2025/06/Desserts.png",
    imageAlt: "",
  },
  {
    id: 6,
    image: "https://sailing.thimpress.com/demo-mountain-hotel/wp-content/uploads/sites/27/2025/06/Main-menu.png",
    imageAlt: "",
  },
  {
    id: 7,
    image: "https://sailing.thimpress.com/demo-mountain-hotel/wp-content/uploads/sites/27/2025/06/Drinks.png",
    imageAlt: "",
  },
  {
    id: 8,
    image: "https://sailing.thimpress.com/demo-mountain-hotel/wp-content/uploads/sites/27/2025/06/Dining.png",
    imageAlt: "",
  },
];

export default function Restaurant() {
  const heroSlide = slides.find((s) => s.id === 1);

  return (
    <>
      <section>
        <div>
          {/* ── section-1 : Hero Image + Title + Breadcrumb ── */}
          <div className="section-1">
            <div className="relative w-full h-screen overflow-hidden">
              <img src={heroSlide.image} alt={heroSlide.imageAlt} className="w-full   object-cover" />
              {/* dark overlay */}
              <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Title +  Breadcrumb on white background below the image */}
            <div className="relative">
              <div className=" absolute bottom-0 left-0 right-0 mx-6 rounded-t-2xl bg-white border-b border-gray-200">
                <div className="flex flex-col items-center py-10 justify-center w-full ">
                  <h1 className="text-5xl font-header text-foreground font-medium mb-6">Restaurant</h1>

                  <Breadcrumb>
                    <BreadcrumbList className="text-lg">
                      <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                          <NavLink
                            to="/"
                            className={({ isActive }) =>
                              isActive ? "text-primary" : "text-muted-foreground hover:text-primary transition-colors"
                            }
                          >
                            Home
                          </NavLink>
                        </BreadcrumbLink>
                      </BreadcrumbItem>

                      <BreadcrumbSeparator />

                      <BreadcrumbItem>
                        <BreadcrumbPage className="font-medium text-foreground">Restaurant</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </div>
            </div>
          </div>

          {/* section-2  */}
          <div className="section-2">
          <div className="container">
            <div className=""></div>
            <div className=""></div>
            <div className=""></div>

          </div>
          </div>
          {/* section-3  */}
          <div className="section-3"></div>
          {/* section-4  */}
          <div className="section-4"></div>
        </div>
      </section>
    </>
  );
}
