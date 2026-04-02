import { Trash2, Plus, Minus, BedDouble } from "lucide-react";

export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden flex flex-col sm:flex-row hover:shadow-md dark:hover:shadow-black/30 transition-shadow">

      <div className="sm:w-44 w-full h-44 sm:h-auto flex-shrink-0 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#f0f3ef] dark:bg-[#1e2b1e] flex items-center justify-center">
            <BedDouble className="w-10 h-10 text-[#8c9e8d]" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 p-5 flex flex-col justify-between gap-4">
        {/* Top Row: name + delete */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c9e8d] bg-[#f0f3ef] dark:bg-[#1e2b1e] px-2 py-0.5 rounded mb-2 inline-block">
              {item.category}
            </span>
            <h3 className="text-base font-bold text-[#1a1a1a] dark:text-white">
              {item.name}
            </h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
              ${item.price.toFixed(2)} / night
            </p>
          </div>

          <button
            onClick={() => onRemove(item.id)}
            className="text-gray-300 dark:text-gray-600 hover:text-red-400 dark:hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Row: quantity + subtotal */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onDecrease(item.id)}
              className="w-8 h-8 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-[#8c9e8d] hover:text-[#8c9e8d] dark:hover:border-[#8c9e8d] dark:hover:text-[#8c9e8d] transition-colors"
              aria-label="Decrease"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center font-bold text-[#1a1a1a] dark:text-white text-sm">
              {item.quantity}
            </span>
            <button
              onClick={() => onIncrease(item.id)}
              className="w-8 h-8 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-[#8c9e8d] hover:text-[#8c9e8d] dark:hover:border-[#8c9e8d] dark:hover:text-[#8c9e8d] transition-colors"
              aria-label="Increase"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Subtotal */}
          <div className="text-right">
            <span className="text-[11px] text-gray-400 dark:text-gray-500 block">
              Subtotal
            </span>
            <span className="text-lg font-bold text-[#1a1a1a] dark:text-white">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}