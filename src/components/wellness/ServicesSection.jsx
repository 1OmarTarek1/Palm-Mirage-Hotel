import { Fade } from './WellnessFade';
import spaImg from "../../assets/wellness/spa.jpg";
import trainingImg from "../../assets/wellness/training.jpg";
import steamImg from "../../assets/wellness/steam.jpg";
const SERVICES = [
  {
    tag: 'SOOTHE YOUR SOUL',
    title: 'Spa Treatment',
    desc: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa penatibus et...',
    hours: '10 am – 8 pm',
    img: spaImg,
    },
  {
    tag: 'KEEP UP YOUR HEALTHY ROUTINE',
    title: 'Personal Training',
    desc: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa penatibus et...',
    hours: '10 am – 8 pm',
    img: trainingImg,
  },
  {
    tag: 'SOOTHE YOUR SOUL',
    title: 'Steam Baths',
    desc: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa penatibus et...',
    hours: '10 am – 8 pm',
    img: steamImg,
  },
];

export default function ServicesSection() {
  return (
    <section className="pt-10 pb-24">
      <div className="">
        <Fade>
          <div className="text-center mb-[52px]">
            <p className="text-[12px] tracking-[0.18em] uppercase text-accentGreen mb-[14px] leading-none">
              Enjoy Your Wellness Journey
            </p>
            <h2 className="font-[family-name:var(--font-header)] text-[clamp(28px,3vw,44px)] font-bold text-foreground leading-[1.12]">
              Enjoy Your Wellness Journey
            </h2>
          </div>
        </Fade>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 items-start">
          {SERVICES.map((s, i) => (
            <Fade key={s.title} delay={i * 0.1}>
              <div className='bg-card rounded-[8px] overflow-hidden'>
                <div className="h-[290px] group">
                  <img
                    src={s.img}
                    alt={s.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="text-[11px] tracking-[0.18em] uppercase text-accentGreen mb-2">
                    {s.tag}
                  </p>
                  <h3 className="font-[family-name:var(--font-header)] text-[clamp(22px,1.9vw,28px)] font-bold text-foreground leading-[1.15] mb-3">
                    {s.title}
                  </h3>
                  <p className="text-[15px] text-muted-foreground leading-[1.78] mb-[14px]">{s.desc}</p>
                  <p className="text-[15px] text-muted-foreground mb-[18px]">
                    Opening hours: {s.hours}
                  </p>
                  <a
                    href="#"
                    className="text-[15px] font-semibold text-accentGreen no-underline border-b border-transparent inline-block transition-all duration-200 hover:border-accentGreen hover:text-secondary"
                  >
                    Request Information
                  </a>
                </div>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}
