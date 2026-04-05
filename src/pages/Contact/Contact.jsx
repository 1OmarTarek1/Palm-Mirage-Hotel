import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

import FormInputField from "@/components/auth/FormInputField";
import { contactSchema } from "@/features/contact/contactSchema";
import { cn } from "@/lib/utils";

/** Approx. east-bank Luxor (Corniche area) — fictional hotel pin for the map embed */
const HOTEL_MAP_LAT = 25.6912;
const HOTEL_MAP_LON = 32.6368;
const MAP_ZOOM_PADDING = 0.018;
const osmEmbedSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${HOTEL_MAP_LON - MAP_ZOOM_PADDING}%2C${HOTEL_MAP_LAT - MAP_ZOOM_PADDING}%2C${HOTEL_MAP_LON + MAP_ZOOM_PADDING}%2C${HOTEL_MAP_LAT + MAP_ZOOM_PADDING}&layer=mapnik&marker=${HOTEL_MAP_LAT}%2C${HOTEL_MAP_LON}`;
const osmExternalHref = `https://www.openstreetmap.org/?mlat=${HOTEL_MAP_LAT}&mlon=${HOTEL_MAP_LON}#map=16/${HOTEL_MAP_LAT}/${HOTEL_MAP_LON}`;

export default function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: { name: "", email: "", subject: "", message: "" },
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    try {
      // TODO: connect to API
      console.log("Contact form data:", data);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <section className="container text-center my-10">
        {/* Header */}
        {/* <div className="flex flex-col items-center mb-16 justify-center">
          <h1 className="text-5xl font-header text-foreground font-medium mb-6">
            Contact Us
          </h1>
        </div> */}

        {/* Map — Luxor (preview location for Palm Mirage) */}
        <div className="relative w-screen left-1/2 -translate-x-1/2 min-h-[380px] h-[min(72vh,760px)] overflow-hidden rounded-none border-y border-border/60 bg-muted/30 dark:bg-muted/20">
          <div
            className={cn(
              "absolute inset-0 min-h-[380px]",
              /* OSM tiles are light-only; invert + hue-rotate gives a dark basemap in .dark */
              "dark:[&_iframe]:[filter:invert(1)_hue-rotate(180deg)_brightness(0.78)_contrast(1.08)_saturate(0.72)]",
            )}
          >
            <iframe
              title="Palm Mirage Hotel — Luxor map location"
              src={osmEmbedSrc}
              width="100%"
              height="100%"
              className="absolute inset-0 h-full w-full min-h-[380px]"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 sm:left-auto sm:right-4 sm:max-w-md">
            <p className="pointer-events-auto rounded-xl border border-border/60 bg-background/90 px-3 py-2 text-left text-xs text-muted-foreground shadow-sm backdrop-blur-sm">
              <span className="font-semibold text-foreground">Palm Mirage · Luxor</span>
              <span className="mx-1.5 text-border">·</span>
              Map preview (Corniche area).{" "}
              <a
                href={osmExternalHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-2 hover:underline"
              >
                Open in OpenStreetMap
              </a>
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="md:pt-10 text-left flex flex-col lg:flex-row justify-center items-center gap-10 lg:gap-16">
          {/* Left — Info */}
          <div className="w-full lg:w-1/2">
            <div className="space-y-4">
              <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Get in touch</p>
              <h2 className="text-3xl md:text-5xl leading-tight text-foreground font-header">
                We Are Always Ready To Help You And Answer Your Questions
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-lg">
                Pacific hake false trevally queen parrotfish black prickleback mosshead warbonnet sweeper! Greenling
                sleeper.
              </p>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-4 mt-10">
              {/* Hotline */}
              <div className="space-y-3">
                <h3 className="text-xl  leading-tight text-foreground font-header">Hotline</h3>
                <div className="text-muted-foreground space-y-1">
                  <p>+ (123) 1800 234 5678</p>
                  <p>+ (123) 1800 666 6789</p>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-3">
                <h3 className="text-xl  font-header text-foreground">Location</h3>
                <div className="text-muted-foreground space-y-1">
                  <p>Luxor, Luxor Governorate, Egypt</p>
                  <p>Nile Corniche — East Bank (map preview)</p>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-3">
                <h3 className="text-xl  font-header text-foreground">Email</h3>
                <p className="text-muted-foreground">moutain.sailing@gmail.com</p>
              </div>

              {/* Social Network */}
              <div className="space-y-3">
                <h3 className="text-xl  font-header text-foreground">Social Network</h3>
                <div className="flex gap-4">
                  {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
                    <div
                      key={index}
                      className="w-10 h-10 rounded-full bg-card border border-border text-foreground flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer"
                    >
                      <Icon size={18} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="w-full lg:w-1/2 relative">
            <div className="static lg:absolute lg:-bottom-70 left-0 w-full bg-card p-6 md:p-12 rounded-2xl shadow-sm border border-border">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <h2 className="text-3xl py-3 font-header text-foreground">Get in touch</h2>

                {/* Name */}
                <FormInputField
                  id="name"
                  label="Name"
                  placeholder="Enter your name"
                  error={errors.name}
                  {...register("name")}
                  className={`w-full p-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.name
                      ? "border-red-400 focus:ring-red-200"
                      : "border-gray-200 focus:ring-[#8da399]/20 focus:border-[#8da399]"
                  }`}
                />

                {/* Email */}
                <FormInputField
                  id="email"
                  label="Email"
                  placeholder="Enter your email"
                  {...register("email")}
                  error={errors.email}
                  className={`w-full p-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.name
                      ? "border-red-400 focus:ring-red-200"
                      : "border-gray-200 focus:ring-[#8da399]/20 focus:border-[#8da399]"
                  }`}
                />

                {/* Subject */}
                <FormInputField
                  id="subject"
                  label="Subject"
                  placeholder="Enter your Subject"
                  {...register("subject")}
                  error={errors.subject}
                  className={`w-full p-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.name
                      ? "border-red-400 focus:ring-red-200"
                      : "border-gray-200 focus:ring-[#8da399]/20 focus:border-[#8da399]"
                  }`}
                />

                {/* Message */}
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Message</label>
                  <textarea
                    rows="4"
                    placeholder="Enter your message"
                    {...register("message")}
                    className={`w-full mt-3 placeholder:text-gray-400  p-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${
                      errors.message
                        ? "border-red-400 focus:ring-red-200"
                        : "border-gray-200 focus:ring-[#8da399]/20 focus:border-[#8da399]"
                    }`}
                  />
                  {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#8da399] text-white px-12 py-4 rounded-full font-bold hover:bg-[#768b82] transition-all transform hover:-translate-y-1 shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? "Sending..." : "Send A Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
