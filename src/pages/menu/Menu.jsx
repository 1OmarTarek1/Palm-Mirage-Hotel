import { useState, useEffect } from "react";
// import MenuHeader from "../../components/menu/MenuHeader";
import MenuTabs from "../../components/menu/MenuTabs";
import MenuGrid from "../../components/menu/MenuGrid";
import MenuReservationHero from "../../components/menu/MenuReservationHero";
import { categories } from "../../components/menu/menuData";
import { Loader2 } from "lucide-react";
import menuApi from "../../services/menuApi";

export default function MenuPage() {
  const [activeIndex, setActiveIndex] = useState(3);
  const activeCategory = categories[activeIndex];
  
  // State for data lifecycle
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real menu data when the component mounts
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // This will trigger the Axios HTTP request to your Express endpoint (e.g. /api/menu)
        const rawData = await menuApi.getAllMenuItems();
        
        // The backend `getAllMenuItems` returns an object: { message: "Done", data: { items: [], pagination: {} } }
        // We need to specifically map to the `items` array directly.
        let itemsArray = rawData?.data?.items;
        
        // Fallbacks in case the API structure changes
        if (!itemsArray) {
          itemsArray = Array.isArray(rawData?.data) ? rawData.data : (Array.isArray(rawData) ? rawData : []);
        }
        
        setMenuItems(itemsArray);
      } catch (err) {
        console.error("API error fetching menu:", err);
        setError(err?.response?.data?.message || "Failed to fetch menu items from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Filter fetched items by matching the DB document's `category` with the active Tab's label
  const currentCategoryItems = menuItems.filter(
    (item) => item.category?.toLowerCase() === activeCategory.label.toLowerCase()
  );

  return (
    <div className="w-full transition-colors duration-300 min-h-[50vh]">
      {/* <MenuHeader /> */}
      <MenuTabs activeIndex={activeIndex} onSelect={setActiveIndex} />
      
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
      ) : (
        <MenuGrid
          activeIndex={activeIndex}
          categoryLabel={activeCategory.label}
          items={currentCategoryItems}
        />
      )}
      
      <MenuReservationHero activeCategory={activeCategory} items={currentCategoryItems} />
    </div>
  );
}