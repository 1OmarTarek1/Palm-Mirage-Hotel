
import WaterPoolsSection from '@/components/wellness/WaterPoolsSection';
import GalleryHoursSection from '@/components/wellness/GalleryHoursSection';
import WellnessJourneySection from '@/components/wellness/WellnessJourneySection';
import ServicesSection from '@/components/wellness/ServicesSection';
export default function WellnessSpa() {
  return (
    <div className="text-foreground antialiased overflow-x-hidden transition-colors duration-300">
      <main className="">
        <WaterPoolsSection />
        <GalleryHoursSection />
        <WellnessJourneySection />
        <ServicesSection />
      </main>
    </div>
  );
}
