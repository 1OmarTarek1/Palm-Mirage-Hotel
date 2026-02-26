import { useState } from "react";
// import MenuHeader from "../../components/menu/MenuHeader";
import MenuTabs from "../../components/menu/MenuTabs";
import MenuGrid from "../../components/menu/MenuGrid";
import MenuReservationHero from "../../components/menu/MenuReservationHero";
import { categories, categoryMenuItems } from "../../components/menu/menuData";

export default function MenuPage() {
  const [activeIndex, setActiveIndex] = useState(3);
  const activeCategory = categories[activeIndex];
  const items = categoryMenuItems[activeCategory.label];

  return (
    <div className="bg-background w-full font-main transition-colors duration-300">
      {/* <MenuHeader /> */}
      <MenuTabs activeIndex={activeIndex} onSelect={setActiveIndex} />
      <MenuGrid
        activeIndex={activeIndex}
        categoryLabel={activeCategory.label}
        items={items}
      />
      <MenuReservationHero activeCategory={activeCategory} />
    </div>
  );
}