import MenuItemCard from "./MenuItemCard";
import type { MenuItem } from "./types";

export default function MenuGrid({
  menu,
  days,
  onEditDish,
}: {
  menu: MenuItem[];
  days: string[];
  onEditDish: (dish: MenuItem) => void;
}) {

  return (
    <div className="space-y-6 w-full p-5">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {menu.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-10 border rounded-xl bg-gray-50">
            No dishes found...
          </div>
        ) : (
          menu.map((item) => (
            <div
              key={item.id}
              className="transition-transform hover:-translate-y-1"
            >
              <MenuItemCard
                item={item}
                days={days}
                onEdit={onEditDish}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
