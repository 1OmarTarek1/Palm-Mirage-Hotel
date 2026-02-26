import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

import FormInputField from "@/components/auth/FormInputField";
import { contactSchema } from "@/features/contact/contactSchema";

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
      <section className="container bg-background text-center">
        {/* Header */}
        {/* <div className="flex flex-col items-center mb-16 justify-center">
          <h1 className="text-5xl font-header text-foreground font-medium mb-6">
            Contact Us
          </h1>
        </div> */}

        {/* Map */}
        <div className="relative w-screen left-1/2 -translate-x-1/2 h-screen overflow-hidden">
          <div className="absolute inset-0 grayscale invert opacity-80 contrast-125">
            <iframe
              src="https://www.google.com/maps/embed?pb=..."
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
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
                  <p>USA, New York – 1060</p>
                  <p>Str. First Avenue 1</p>
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
                      className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer"
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
            <div className="static lg:absolute lg:-bottom-70 left-0 w-full bg-[#f9fbfb] p-6 md:p-12 rounded-2xl shadow-sm border border-gray-50">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <h2 className="text-3xl py-3 font-header">Get in touch</h2>

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
                  laceholder="Enter your email"
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
                  laceholder="Enter your Subject"
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
                  <label className="text-sm font-semibold text-gray-700">Message</label>
                  <textarea
                    rows="4"
                    placeholder="Enter your message"
                    {...register("message")}
                    className={`w-full p-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${
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
