import HeroCarousel from "../../components/home/HeroCarousel";
import AboutSection from "../../components/home/AboutSection";
import RoomCardsSection from "../../components/home/RoomCardsSection";
import RoomsPlatformsSection from "../../components/home/RoomsPlatformsSection";
import HomeExperience from "../../components/home/HomeExperience";
import ActivitiesSection from "../../components/home/ActivitiesSection";
import ActivitiesTestimonials from "../../components/about/ActivitiesTestimonials";
import SectionNavigator from "../../components/home/SectionNavigator";
import AwardsSection from "../../components/home/AwardsSection";
import ContactCTA from "../../components/home/ContactCTA";
import LazySection from "../../components/home/LazySection";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <SectionNavigator />
      <HeroCarousel />
      <AboutSection />
      <LazySection sectionId="rooms" minHeight="520px">
        <RoomCardsSection />
      </LazySection>
      <LazySection sectionId="experience" minHeight="520px">
        <HomeExperience />
      </LazySection>
      <LazySection sectionId="activities" minHeight="680px">
        <ActivitiesSection />
      </LazySection>
      <LazySection sectionId="testimonials" minHeight="420px">
        <ActivitiesTestimonials />
      </LazySection>
      <LazySection sectionId="platforms" minHeight="420px">
        <RoomsPlatformsSection />
      </LazySection>
      <LazySection sectionId="amenities" minHeight="420px">
        <AwardsSection />
      </LazySection>
      <LazySection sectionId="contact" minHeight="360px">
        <ContactCTA />
      </LazySection>
    </div>
  )
}
