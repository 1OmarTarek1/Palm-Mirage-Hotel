import HeroCarousel from "../../components/home/HeroCarousel";
import AboutSection from "../../components/home/AboutSection";
import RoomCardsSection from "../../components/home/RoomCardsSection";
import RoomsPlatformsSection from "../../components/home/RoomsPlatformsSection";
import HomeExperience from "../../components/home/HomeExperience";
import ActivitiesSection from "../../components/home/ActivitiesSection";
import ActivitiesTestimonials from "../../components/about/ActivitiesTestimonials";
import SectionNavigator from "../../components/home/SectionNavigator";
import AwardsSection from "../../components/home/AwardsSection";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <SectionNavigator />
      <HeroCarousel />
      <AboutSection />
      <RoomCardsSection />
      <HomeExperience />
      <ActivitiesSection />
      <ActivitiesTestimonials />
      <RoomsPlatformsSection />
      <AwardsSection />
    </div>
  )
}
