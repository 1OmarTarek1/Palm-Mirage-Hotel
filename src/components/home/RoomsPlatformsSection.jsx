import { motion } from "framer-motion";

// Import platform logos
import logo1 from "../../assets/rooms/image-1-2.webp";
import logo2 from "../../assets/rooms/image-2-1.webp";
import logo3 from "../../assets/rooms/image-3.webp";
import logo4 from "../../assets/rooms/image-4.png";
import logo5 from "../../assets/rooms/image-5.webp";
import logo6 from "../../assets/rooms/image-6.webp";
import logo7 from "../../assets/rooms/image-7.webp";
import logo8 from "../../assets/rooms/image-8.webp";
import logo9 from "../../assets/rooms/image-9.webp";

const platforms = [
  { name: "Booking.com", logo: logo4 },
  { name: "Hotels.com", logo: logo2 },
  { name: "trivago", logo: logo3 },
  { name: "traveloka", logo: logo5 },
  { name: "Trip.com", logo: logo1 },
  { name: "airbnb", logo: logo6 },
  { name: "agoda", logo: logo7 },
  { name: "HOSTELWORLD", logo: logo8 },
  { name: "Expedia", logo: logo9 },
];

export default function RoomsPlatformsSection() {
  return (
    <section id="platforms" className="py-10 mb-20 overflow-hidden">
      <div className="">
        <div className="pt-15 ">
          <h2 className="text-3xl md:text-4xl font-header text-foreground text-center mb-16 font-bold">
            Book Rooms On Our Affiliate Platforms
          </h2>
          
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-12 md:gap-x-20 md:gap-y-16 transition-all duration-500">
            {platforms.map((platform, index) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex items-center justify-center w-[120px] md:w-[160px] h-8 md:h-12"
              >
                <img
                  src={platform.logo}
                  alt={platform.name}
                  className="max-w-full max-h-full object-contain"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
