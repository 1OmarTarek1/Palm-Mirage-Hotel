import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

export default function CartHeader({ totalItems, hasItems, onClearAll }) {
  return (
    <div className="mb-10">
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-2 text-sm font-main">
          <Link
            to="/"
            className="text-[#6b7280] hover:text-[#018058] transition-colors"
          >
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-[#018058] font-medium">Shop Cart</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-7 h-7 text-[#8c9e8d]" />
          <h1 className="text-3xl font-bold text-[#1a1a1a] dark:text-white font-header">
            Your Cart
          </h1>
          {totalItems > 0 && (
            <span className="ml-1 bg-[#8c9e8d] text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {totalItems}
            </span>
          )}
        </div>

        {hasItems && (
          <button
            onClick={onClearAll}
            className="text-sm text-red-400 hover:text-red-500 dark:hover:text-red-300 transition-colors font-medium"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}
