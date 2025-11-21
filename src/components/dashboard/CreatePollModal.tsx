import type { MenuItem } from "./types";
import type { Poll } from "./types";
import { useState } from "react";
import ManageDishModal from "./ManageDishModal";
import { supabase } from "../../lib/client";
import { createPortal } from "react-dom";
// import Menu from "../../pages/Menu";

export default function CreatePollModal({
  menu,
  onSave,
  onClose,
  onDishAdded
}: {
  menu: MenuItem[];
  onSave: (poll: Poll) => void;
  onClose: () => void;
  onDishAdded?: (newDish: MenuItem) => void;
}) {
  const [localMenu, setLocalMenu] = useState<MenuItem[]>(menu);
  const [selected, setSelected] = useState<MenuItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const visibleCount = 6;

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];

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

  // Disable button if title, description, dates or no dishes selected
  const isCreateDisabled =
    !title || !description || !startDate || !endDate || selected.length === 0;

  // Saving the poll
  const handleSave = async () => {
    if (isCreateDisabled) return;

    setIsSaving(true);
    setErrorMsg(null);

    const newPoll: Poll = {
      id: Date.now(),
      title,
      description,
      startDate,
      endDate,
      candidates: selected,
      userHasVoted: null,
      isActive: true,
    };

    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("No user session found");

      const res = await fetch(
        "https://bnvlaiftxamrudncnygx.supabase.co/functions/v1/create_poll",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newPoll),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error (${res.status}): ${text}`);
      }

      await res.json();
      onSave(newPoll);
    } catch (error: any) {
      console.error("Error creating poll:", error);
      setErrorMsg(error.message || "Failed to create poll. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Saving a new dish
  const handleNewDishSave = (dish: MenuItem) => {
    setLocalMenu((prev) => [...prev, dish]);
    setSelected((prev) => [...prev, dish]);
    if(onDishAdded)onDishAdded(dish);
    setShowAddDishModal(false);
  };

  const modalContent = (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-5 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800">Create New Poll</h2>

        <div className="mt-4 space-y-3">
          <input
            type="text"
            placeholder="Poll title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border px-3 py-1.5 text-sm text-black"
            required
          />
          <textarea
            placeholder="Poll description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border px-3 py-1.5 text-sm text-black"
            required
          />

          <div className="grid grid-cols-2 gap-2 text-black">
            <input
              title="from"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded-md px-2 py-1.5 text-sm"
              min={today}        
              required
            />

            <input
              title="until"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded-md px-2 py-1.5 text-sm"
              min={startDate}         
              required
            />
          </div>


          {/* Dish selection */}
          <div>
            <p className="font-medium text-sm text-black">Select Dishes:</p>
            <div className="flex justify-between items-center mb-2 gap-6">
              <input
                type="text"
                placeholder="Search dish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-50 border rounded-md p-2 text-sm text-black"
              />
              <button
                onClick={() => setShowAddDishModal(true)}
                className="text-xs px-2 py-1 h-full rounded-md bg-rose-100 text-rose-700 hover:bg-rose-200 transition"
              >
                + Add New Dish
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto border rounded-md p-3">
              {filteredMenu.slice(0, visibleCount).map((dish) => (
                <div
                  key={dish.id}
                  onClick={() => toggleDish(dish)}
                  className={`relative cursor-pointer rounded-lg overflow-hidden shadow-sm group transition transform hover:scale-[1.02] ${
                    selected.find((d) => d.id === dish.id)
                      ? "ring-2 ring-rose-500"
                      : "ring-1 ring-gray-200"
                  }`}
                >
                  <div
                    className="h-28 bg-cover bg-center flex items-end justify-center text-white text-sm font-semibold"
                    style={{ backgroundImage: `url(${dish.imageUrl})` }}
                  >
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition" />
                    <span className="relative z-10 text-center px-2 drop-shadow-sm">
                      {dish.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {errorMsg && <p className="text-sm text-red-600 mt-3 text-center">{errorMsg}</p>}

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || isCreateDisabled}
            className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Create Poll"}
          </button>
        </div>
      </div>

      {showAddDishModal && (
        <ManageDishModal
          dish={{
            id: Date.now(),
            name: "",
            description: "",
            price: 0,
            hasStock: true,
            availableDays: [],
            alwaysAvailable: false,
            availabilityRange: null,
            imageUrl: "",
          }}
          days={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
          onSave={handleNewDishSave}
          onClose={() => setShowAddDishModal(false)}
          onDelete={(deleted: MenuItem) =>
            setLocalMenu(prev => prev.filter(d => d.id !== deleted.id))
          }
        />
      )}
    </div>
  );

  return createPortal(modalContent, document.body);
}
