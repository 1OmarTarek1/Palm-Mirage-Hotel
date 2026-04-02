import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
      <div className="w-24 h-24 rounded-full bg-[#f0f3ef] dark:bg-[#1e2b1e] flex items-center justify-center">
        <ShoppingCart className="w-10 h-10 text-[#8c9e8d]" />
      </div>

      <div>
        <h2 className="text-xl font-bold text-[#1a1a1a] dark:text-white mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-400 dark:text-gray-500 text-sm">
          Browse our rooms and add your favourite ones here.
        </p>
      </div>

      <Link to="/rooms">
        <Button className="bg-[#8c9e8d] hover:bg-[#7a8c7b] text-white rounded-full px-8 h-11 font-bold">
          Browse Rooms
        </Button>
      </Link>
    </div>
  );
}