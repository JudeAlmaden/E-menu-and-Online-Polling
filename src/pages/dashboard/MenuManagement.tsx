import { useState, useEffect } from "react";
import HeroHeader from "../../components/dashboard/HeroHeader";
import MenuFilter from "../../components/dashboard/MenuFilter";
import MenuGrid from "../../components/dashboard/MenuGrid";
import ManageDishModal from "../../components/dashboard/ManageDishModal";
import type { MenuItem } from "../../components/dashboard/types";

export default function MenuManagement({
  menu,
  onMenuChange,
}: {
  menu: MenuItem[];
  onMenuChange?: (updatedMenu: MenuItem[]) => void;
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
  const handleSaveDish = (updated: MenuItem) => {
    setLocalMenu((prev) => {
      const exists = prev.find((d) => d.id === updated.id);
      if (exists) {
        return prev.map((d) => (d.id === updated.id ? updated : d));
      } else {
        return [...prev, updated];
      }
    });
    setShowDishModal(null);
  };

  // Handler when deleting a dish
  const handleDeleteDish = (deleted: MenuItem) => {
    setLocalMenu((prev) => prev.filter((d) => d.id !== deleted.id));
    setShowDishModal(null);
  };

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
