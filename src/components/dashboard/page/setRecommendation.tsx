import { useState } from "react";
import type { MenuItem } from "../types";
import ManageDishModal from "../ManageDishModal";
import { supabase } from "../../../lib/client";

type Props = {
  menu: MenuItem[];
  onSave: (selected: MenuItem[]) => void;
  onClose: () => void;
  onNewDish?: (dish: MenuItem) => void;
};

export default function SetRecommendations({ menu, onSave, onClose, onNewDish }: Props) {
  const [localMenu, setLocalMenu] = useState<MenuItem[]>(menu);
  const [selected, setSelected] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount] = useState(50);
  const [showAddDishModal, setShowAddDishModal] = useState(false);

  const toggleDish = (dish: MenuItem) => {
    setSelected((prev) =>
      prev.find((d) => d.id === dish.id)
        ? prev.filter((d) => d.id !== dish.id)
        : [...prev, dish]
    );
  };

  const filteredMenu = localMenu.filter((dish) =>
    dish.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewDishSave = (dish: MenuItem) => {
    setLocalMenu((prev) => [...prev, dish]);
    setSelected((prev) => [...prev, dish]);
    setShowAddDishModal(false);

    if (onNewDish) {
      onNewDish(dish); // ✅ now will notify parent
    }
  };


  const handleSave = async () => {
    if (selected.length === 0) {
      alert("Please select at least one menu item.");
      return;
    }

    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      const token = data.session?.access_token;

      if (!token) {
        alert("You must be logged in to save recommendations.");
        return;
      }

      const res = await fetch(
        "https://bnvlaiftxamrudncnygx.supabase.co/functions/v1/set-recommendations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            recommendedDishIds: selected.map((d) => d.id),
          }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to save recommendations: ${text}`);
      }

      alert("Recommendations saved successfully!");
      onSave(selected);
      onClose();
    } catch (err: any) {
      console.error("Error saving recommendations:", err);
      alert("Error saving recommendations: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-5 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Set Recommendations
        </h2>

        {/* Search + Add */}
        <div className="flex justify-between items-center mb-3 gap-2">
          <input
            type="text"
            placeholder="Search menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border rounded-md p-2 text-sm placeholder-gray-400 text-gray-900"
          />
          <button
            onClick={() => setShowAddDishModal(true)}
            className="px-3 py-1 text-sm rounded-md bg-rose-100 text-rose-700 hover:bg-rose-200 transition"
          >
            + Add Dish
          </button>
        </div>

        {/* Dish Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-y-auto border rounded-md p-3">
          {filteredMenu.slice(0, visibleCount).map((dish) => (
            <div
              key={dish.id}
              onClick={() => toggleDish(dish)}
              className={`relative cursor-pointer rounded-lg overflow-hidden shadow-sm group transition transform hover:scale-[1.02] ${selected.find((d) => d.id === dish.id)
                ? "ring-2 ring-rose-500"
                : "ring-1 ring-gray-200"
                }`}
            >
              <div
                className="h-28 bg-cover bg-center flex items-end justify-center text-white text-sm font-semibold"
                style={{
                  backgroundImage: `url(${dish.imageUrl || ""})`,
                }}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition" />
                <span className="relative z-10 text-center px-2 drop-shadow-sm">
                  {dish.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 text-sm font-semibold"
          >
            Save Recommendations
          </button>
        </div>
      </div>

      {/* Add Dish Modal */}
      {showAddDishModal && (
        <ManageDishModal
          dish={{
            id: Date.now(),
            name: "",
            description: "",
            price: 0,
            imageUrl: "",
            hasStock: true,
            availableDays: [],
            alwaysAvailable: true,
          }}
          days={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
          onSave={handleNewDishSave}
          onClose={() => setShowAddDishModal(false)}
        />
      )}
    </div>
  );
}
