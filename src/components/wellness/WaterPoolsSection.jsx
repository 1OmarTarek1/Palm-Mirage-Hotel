import { Wifi, Waves, Wind, Droplets, RefreshCw, Cloud, Flame, Snowflake } from 'lucide-react';
import { Fade } from './WellnessFade';
import wellnessImg from '../../assets/wellness/pool.jpg'
const AMENITIES = [
  { label: 'Indoor Pool (29° C)', icon: 'wifi' },
  { label: "Children's Pool (34° C)", icon: 'pool' },
  { label: 'Open-Air-Pool (34° C)', icon: 'air' },
  { label: 'Salt Water Grotto (45° C)', icon: 'salt' },
  { label: 'Whirlpool (34° C)', icon: 'swirl' },
  { label: 'Steam Baths (45° C)', icon: 'steam' },
  { label: 'Finnish Sauna (90° C)', icon: 'sauna' },
  { label: 'Ice Fountain (12° C)', icon: 'ice' },
];

const POOL_HERO = wellnessImg;

function AmenityIcon({ type }) {
  const iconProps = {
    className: 'w-[18px] h-[18px] shrink-0 mt-[1px] text-accentGreen',
    strokeWidth: 1.6,
  };
  const icons = {
    wifi: <Wifi {...iconProps} />,
    pool: <Waves {...iconProps} />,
    air: <Wind {...iconProps} />,
    salt: <Droplets {...iconProps} />,
    swirl: <RefreshCw {...iconProps} />,
    steam: <Cloud {...iconProps} />,
    sauna: <Flame {...iconProps} />,
    ice: <Snowflake {...iconProps} />,
  };
  return icons[type] || <Wifi {...iconProps} />;
}

export default function WaterPoolsSection() {
  return (
    <section className="pb-[28px] rounded-[10px]">
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <Fade>
            <div className="bg-card rounded-[15px] p-[52px_48px] h-full box-border">
              <p className="text-[14px] tracking-wide uppercase text-muted-foreground mb-3">
                Water Pools
              </p>
              <h2 className="font-[family-name:var(--font-header)] text-[clamp(26px,2.5vw,36px)] font-bold text-foreground leading-[1.15] mb-[20px]">
                Wellness At Mountain Hotel
              </h2>
              <p className="text-[16px] text-muted-foreground leading-[1.8]">
                Step in and enjoy life with all your senses. In a fast paced
                world, the luxurious 2000m2 Kulm Spa St. Moritz presents itself
                as a haven and ideal hideaway for those seeking ultimate
                relaxation, comfort and harmony.
              </p>
              <h3 className="text-[20px] font-bold text-foreground mt-[36px] mb-[20px]">
                Amenities
              </h3>
              <div className="grid grid-cols-2 gap-y-[15px] gap-x-[12px]">
                {AMENITIES.map((a) => (
                  <div
                    key={a.label}
                    className="flex items-start gap-[9px] text-[15px] text-muted-foreground"
                  >
                    <AmenityIcon type={a.icon} />
                    {a.label}
                  </div>
                ))}
              </div>
            </div>
          </Fade>
          <Fade delay={0.14}>
            <div className="rounded-[8px] overflow-hidden h-full min-h-[500px]">
              <img
                src={POOL_HERO}
                alt="Pool"
                className="w-full h-full object-cover object-top block"
              />
            </div>
          </Fade>
        </div>
      </div>
    </section>
  );
}
