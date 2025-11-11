import type { MenuItem } from "./types";

interface MenuItemCardProps {
  item: MenuItem;
  days: string[];
  onEdit: (item: MenuItem) => void; // triggers ManageDishModal
}

export default function MenuItemCard({
  item,
  days,
  onEdit,
}: MenuItemCardProps) {

  
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white transition-transform hover:-translate-y-1">
      {/* Image */}
      <img
        src={item.imageUrl || "/placeholder.png"}
        alt={item.name}
        className="w-full h-40 object-cover"
      />

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title & Price */}
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-gray-800">{item.name}</h2>
          <span className="text-sm text-gray-500 font-medium">
            ₱{item.price.toFixed(2)}
          </span>
        </div>

        {/* Available Days */}
        <div className="flex flex-wrap gap-2">
          {days.map((day) => (
            <button
              key={day}
              className={`text-xs px-2 py-1 rounded-md font-medium transition ${
                item.availableDays.includes(day)
                  ? "bg-rose-100 text-rose-700"
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          {/* Stock toggle */}
          <button
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
              item.hasStock
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {item.hasStock ? "In Stock" : "Out of Stock"}
          </button>

          {/* Edit button */}
          <button
            onClick={() => onEdit(item)}
            className="px-3 py-1.5 rounded-md text-sm border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
