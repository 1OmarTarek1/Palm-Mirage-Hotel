import { useState } from "react";
// import MenuHeader from "../../components/menu/MenuHeader";
import MenuTabs from "../../components/menu/MenuTabs";
import MenuGrid from "../../components/menu/MenuGrid";
import MenuReservationHero from "../../components/menu/MenuReservationHero";
import { MenuPageSkeleton } from "@/components/common/loading/WebsiteSkeletons";
import { useMenuGroupedQuery } from "@/hooks/useCatalogQueries";

export default function MenuPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { data, isLoading: loading, error: queryError } = useMenuGroupedQuery();
  const categories = data?.categories ?? [];
  const groupedItems = data?.groupedItems ?? {};
  const error = queryError
    ? queryError.message || "Failed to fetch menu items from server."
    : null;

  // Determine current active category and its items
  const activeCategory = categories[activeIndex] || null;
  const currentCategoryLabel = activeCategory?.label || "";
  const currentCategoryItems = activeCategory ? (groupedItems[currentCategoryLabel] || []) : [];

  return (
    <div className="w-full transition-colors duration-300 min-h-[50vh]">
      {/* <MenuHeader /> */}
      
      {loading ? (
        <MenuPageSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-red-500 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg shadow hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-muted-foreground font-medium">No menu data available. Please add items in the admin panel.</p>
        </div>
      ) : (
        <>
          <MenuTabs 
            categories={categories} 
            activeIndex={activeIndex} 
            onSelect={setActiveIndex} 
          />
          <MenuGrid
            activeIndex={activeIndex}
            categoryLabel={currentCategoryLabel}
            items={currentCategoryItems}
          />
          <MenuReservationHero 
            activeCategory={activeCategory} 
            items={currentCategoryItems} 
          />
        </>
      )}
    </div>
  );
}
