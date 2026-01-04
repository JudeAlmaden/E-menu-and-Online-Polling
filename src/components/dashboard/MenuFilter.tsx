import { useState } from "react";
import { Search, Plus, Menu, X } from "lucide-react";

interface MenuFilterProps {
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
  onAddDish: () => void;
  onSearch: (query: string) => void;
}

export default function MenuFilter({
  selectedFilter,
  onSelectFilter,
  onAddDish,
  onSearch,
}: MenuFilterProps) {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const filters = ["All", "In Stock", "Out of Stock"];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onSearch(value);
  };

  const handleFilterSelect = (filter: string) => {
    onSelectFilter(filter);
    setShowFilters(false);
  };

  return (
    <div className="w-full rounded-2xl p-6 my-2">
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search dishes by name..."
            className="w-full rounded-xl border-2 border-gray-300 pl-12 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all"
          />
        </div>

        {/* Filter Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`rounded-xl px-4 py-3 text-sm font-semibold border-2 transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
              showFilters
                ? "bg-rose-50 text-rose-700 border-rose-300"
                : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-rose-300"
            }`}
          >
            <Menu className="w-5 h-5" />
            <span className="hidden sm:inline">Filters</span>
            <span className="sm:hidden">{selectedFilter === "All" ? "" : "•"}</span>
          </button>

          {/* Dropdown Menu */}
          {showFilters && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-10"
                onClick={() => setShowFilters(false)}
              />
              
              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 py-2 z-20 animate-[slideDown_0.2s_ease-out]">
                <div className="px-4 py-2 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900">Filter Options</span>
                    <button
                      title="filters"
                      onClick={() => setShowFilters(false)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="py-2">
                  {filters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => handleFilterSelect(filter)}
                      className={`w-full text-left px-4 py-3 text-sm font-semibold transition-all ${
                        selectedFilter === filter
                          ? "bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 border-l-4 border-rose-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{filter}</span>
                        {selectedFilter === filter && (
                          <div className="w-2 h-2 rounded-full bg-rose-600"></div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Add New Dish Button */}
        <button
          onClick={onAddDish}
          className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-bold px-6 py-3 hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Add New Dish</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}