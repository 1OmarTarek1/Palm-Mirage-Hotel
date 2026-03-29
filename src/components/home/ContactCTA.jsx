import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

export default function ContactCTA() {
  return (
    <section id="contact" className="relative w-screen left-1/2 -translate-x-1/2 py-24 overflow-hidden mt-10 lg:h-screen">
      {/* Background Image with Parallax-like effect */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&q=80&w=2000"
          alt="Contact Us Background"
          className="w-full h-full object-cover brightness-[0.6]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(26,31,26,0.3)_40%,rgba(26,31,26,0.8)_80%,#1a1f1a)] pointer-events-none" />
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-4 lg:px-5 xl:px-2 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-secondary text-sm font-bold uppercase tracking-[0.3em] mb-4 block">
                  Get In Touch
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-header font-bold text-white leading-tight mb-6">
                  Ready to Experience <br />
                  <span className="text-secondary italic">Timeless Luxury?</span>
                </h2>
                <p className="text-white/70 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Whether you have questions about our rooms, dining, or local tours, 
                  our dedicated concierge team is ready to curate your perfect Luxor stay.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6"
              >
                <Button asChild variant="palmWhiteSecondary" className="text-md" size="lg">
                  <Link to="/contact">
                    Contact Us Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                
                <div className="flex items-center gap-4 text-white/80 hover:text-white transition-colors">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                    <Phone className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-widest opacity-60">Call Us</p>
                    <p className="font-bold">+20 95 123 4567</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Quick Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-8 md:p-10 shadow-2xl"
            >
              <h3 className="text-xl font-header font-bold text-white mb-8 border-b border-white/10 pb-4">
                Quick Contact
              </h3>
              <ul className="space-y-8">
                <li className="flex items-start gap-4 group">
                  <div className="mt-1 w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center shrink-0 group-hover:bg-secondary transition-colors">
                    <MapPin className="w-5 h-5 text-secondary group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-bold mb-1">Our Location</h4>
                    <p className="text-white/60 text-xs leading-relaxed">
                      Kornish Al Nile, Luxor City <br />
                      Luxor Governorate, Egypt
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4 group">
                  <div className="mt-1 w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center shrink-0 group-hover:bg-secondary transition-colors">
                    <Mail className="w-5 h-5 text-secondary group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-bold mb-1">Email Us</h4>
                    <p className="text-white/60 text-xs leading-relaxed">
                      reservations@palmhotel.com <br />
                      concierge@palmhotel.com
                    </p>
                  </div>
                </li>
              </ul>
              
              <div className="mt-10 pt-8 border-t border-white/10">
                <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">
                  Available 24/7 for our guests
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
