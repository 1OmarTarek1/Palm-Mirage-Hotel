import { useState, useEffect } from "react";
// import MenuHeader from "../../components/menu/MenuHeader";
import MenuTabs from "../../components/menu/MenuTabs";
import MenuGrid from "../../components/menu/MenuGrid";
import MenuReservationHero from "../../components/menu/MenuReservationHero";
import { Loader2 } from "lucide-react";
import menuApi from "../../services/menuApi";

export default function MenuPage() {
  const [activeIndex, setActiveIndex] = useState(0); 
  const [categories, setCategories] = useState([]);
  const [groupedItems, setGroupedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the menu data grouped by category directly from your endpoint
        const rawData = await menuApi.getGroupedMenu();
        
        const dataPayload = rawData?.data || {};
        
        // Ensure valid fallback arrays
        setCategories(dataPayload.categories || []);
        setGroupedItems(dataPayload.categoryMenuItems || {});

      } catch (err) {
        console.error("API error fetching grouped menu:", err);
        setError(err?.response?.data?.message || err.message || "Failed to fetch menu items from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Determine current active category and its items
  const activeCategory = categories[activeIndex] || null;
  const currentCategoryLabel = activeCategory?.label || "";
  const currentCategoryItems = activeCategory ? (groupedItems[currentCategoryLabel] || []) : [];

  return (
    <div className="w-full transition-colors duration-300 min-h-[50vh]">
      {/* <MenuHeader /> */}
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Loading delicious menu...</p>
        </div>
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