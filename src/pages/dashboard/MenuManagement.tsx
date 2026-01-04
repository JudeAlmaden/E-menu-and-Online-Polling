import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import HeroHeader from "../../components/dashboard/HeroHeader";
import MenuFilter from "../../components/dashboard/MenuFilter";
import MenuGrid from "../../components/dashboard/MenuGrid";
import ManageDishModal from "../../components/dashboard/ManageDishModal";
import type { MenuItem } from "../../components/dashboard/types";

export default function MenuManagement({
  menu,
  onMenuChange,
  isLoading = false,
  onRefetch,
}: {
  menu: MenuItem[];
  onMenuChange?: (updatedMenu: MenuItem[]) => void;
  isLoading?: boolean;
  onRefetch?: () => Promise<void>;
}) {
  const [localMenu, setLocalMenu] = useState<MenuItem[]>(menu);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [showDishModal, setShowDishModal] = useState<MenuItem | null>(null);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [searchQuery, setSearchQuery] = useState("");

  // Update localMenu when props.menu changes
  useEffect(() => {
    setLocalMenu(menu);
  }, [menu]);

  // Notify parent whenever localMenu changes
  useEffect(() => {
    if (onMenuChange) onMenuChange(localMenu);
  }, [localMenu]);

  const filteredMenu = localMenu
    .filter((item) => {
      if (selectedFilter === "All") return true;
      if (selectedFilter === "In Stock") return item.hasStock;
      if (selectedFilter === "Out of Stock") return !item.hasStock;
      return true;
    })
    .filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Handler when saving or editing a dish
  const handleSaveDish = async (updated: MenuItem) => {
    const isNewDish = !localMenu.find((d) => d.id === updated.id);

    setLocalMenu((prev) => {
      const exists = prev.find((d) => d.id === updated.id);
      if (exists) {
        return prev.map((d) => (d.id === updated.id ? updated : d));
      } else {
        return [...prev, updated];
      }
    });
    setShowDishModal(null);

    // Refetch menu from server if a new dish was added
    if (isNewDish && onRefetch) {
      await onRefetch();
    }
  };

  // Handler when deleting a dish
  const handleDeleteDish = (deleted: MenuItem) => {
    setLocalMenu((prev) => prev.filter((d) => d.id !== deleted.id));
    setShowDishModal(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-white rounded-full shadow-xl">
            <Loader2 className="w-8 h-8 text-rose-600 animate-spin" />
          </div>
          <p className="text-rose-600 font-medium text-lg animate-pulse">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <HeroHeader />

      <MenuFilter
        selectedFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
        onSearch={setSearchQuery}
        onAddDish={() =>
          setShowDishModal({
            id: Date.now(),
            name: "",
            description: "",
            price: 0,
            hasStock: true,
            availableDays: [],
            alwaysAvailable: false,
            availabilityRange: null,
            imageUrl: "",
          })
        }
      />

      <MenuGrid
        menu={filteredMenu}
        days={days}
        onEditDish={(dish) => setShowDishModal(dish)}
      />

      {showDishModal && (
        <ManageDishModal
          dish={showDishModal}
          days={days}
          onSave={handleSaveDish}
          onDelete={handleDeleteDish}
          onClose={() => setShowDishModal(null)}
        />
      )}
    </section>
  );
}
