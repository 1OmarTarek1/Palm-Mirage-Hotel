import sauna from '../../assets/wellness/saunas.jpg'
import poolImage from '../../assets/wellness/poolImage.jpg'
const HOURS = [
  { label: 'Pool & Fitness', time: '07.00 – 20.00 h' },
  { label: 'Earlier upon request', time: '5:00h' },
  { label: 'Treatments in Summer', time: '850m' },
  { label: 'Treatments in Winter', time: '08.00 – 20.00 h' },
  { label: 'Saunas', time: '16.00 – 20.00 h' },
];

const WATERFALL = poolImage
const POOL_STAIRS = sauna

export default function GalleryHoursSection() {
  return (
    <section className="pb-0">
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[30px] items-stretch">
          <div className="rounded-lg overflow-hidden min-h-[300px]">
            <img
              src={WATERFALL}
              alt="Waterfall"
              className="w-full h-full object-cover block"
            />
          </div>
          <div className="rounded-lg overflow-hidden min-h-[300px]">
            <img
              src={POOL_STAIRS}
              alt="Pool stairs"
              className="w-full h-full object-cover block"
            />
          </div>
          <div className="bg-cardBeige rounded-lg p-9">
            <h3 className="font-[family-name:var(--font-header)] text-2xl font-bold mb-7 text-primaryDark">
              Opening Hours
            </h3>
            {HOURS.map((h, i) => (
              <div
                key={h.label}
                className={`flex justify-between py-[14px] ${
                  i < HOURS.length - 1 ? 'border-b border-[#e0d9ce]' : ''
                }`}
              >
                <span className="text-sm text-gray-600">{h.label}</span>
                <span className="text-sm font-semibold text-primaryDark">{h.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
