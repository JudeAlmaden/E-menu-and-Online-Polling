import type { MenuItem } from "../components/dashboard/types";
import Footer from "../components/landing/Footer"
import { ArrowLeft } from "lucide-react";
import { useEffect, useState, useMemo} from "react";
import VisitLogger from '../components/utils/VisitLogger';

export default function Menu() {
  const now = new Date();
  const [isFetching, setIsFetching] = useState(false);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const placeholderImage = "https://thvnext.bing.com/th/id/OIP.ZKYGG7ccI7cReRSZOjG2ZgHaE8?w=286&h=191&c=7&r=0&o=7&cb=12&pid=1.7&rm=3";

  const fetchMenu = async () => {
    try {
      const res = await fetch(
        "https://bnvlaiftxamrudncnygx.supabase.co/functions/v1/dishes",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "apikey": "sb_publishable_7xyKnxSy20mJHEpjA55Q4Q_aTsqVVXU",
          },
        }
      );
      

      const json = await res.json();
      console.log(json);
      const transformedMenu: MenuItem[] = json.map((item: any) => {
        return {
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          hasStock: item.hasStock,
          availableDays: item.availableDays || [],
          alwaysAvailable: item.alwaysAvailable || false,
          availabilityRange: item.availabilityRange || null,
          imageUrl: item.image_url || placeholderImage,
        };
      });

      setIsFetching(false);
      setMenu(transformedMenu);
    } catch (err) {
      console.error("Error fetching menu:", err);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if(isFetching){
      return
    }
    setIsFetching(true)
    fetchMenu().then(() => {
      setIsFetching(false);
    });
  }, []);

  // --- Filters ---
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 9999]);
  const [dayFilter, setDayFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  // --- Filtered list ---
  const filteredMenu = useMemo(() => {
    return menu.filter((it) => {
      // Search
      if (search && !it.name.toLowerCase().includes(search.toLowerCase()))
        return false;

      // Price
      if (it.price < priceRange[0] || it.price > priceRange[1]) return false;

      // Availability
      const rank = getAvailabilityRank(it);
      if (
        availabilityFilter !== "all" &&
        rankName(rank).toLowerCase() !== availabilityFilter
      )
        return false;

      // Day filter
      if (dayFilter !== "all" && !it.availableDays.includes(dayFilter))
        return false;

      return true;
    });
  }, [menu, search, priceRange, availabilityFilter, dayFilter]);


  return (
    <div className="relative overflow-hidden">
      {/* Subtle pattern background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/white-wall-3.png')] opacity-10" />
      <div className="relative z-10">
        {/* Hero Section */}

        <section className="relative isolate overflow-hidden">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2000&auto=format&fit=crop')",
            }}
          />

          {/* Dark overlay for contrast */}
          <div className="absolute inset-0 bg-black/50" aria-hidden="true" />

          {/* Back button - pinned top-left */}
          <a
            href="/"
            className="absolute top-6 left-6 flex items-center justify-center rounded-md bg-white/10 w-14 h-14 text-white backdrop-blur-sm hover:bg-white/20 transition"
          >
            <ArrowLeft className="w-8 h-8" />
          </a>


          {/* Main content */}
          <div className="relative mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
                All Menu
              </h1>
              <div className="mt-3 h-1 w-20 bg-gradient-to-r from-rose-500 to-orange-400 rounded-full" />
              <p className="mt-4 text-base text-rose-100/90 drop-shadow-sm">
                Browse every dish we offer — filter by price, availability, or day.
              </p>
            </div>
          </div>

          {/* Bottom fade for smooth transition */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
        </section>



        {/* Filters + Grid */}
        <section className="relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/food.png')]">
          {/* Pattern background spans entire width */}
          <div className="absolute inset-0 -z-10 opacity-10" />

          <div className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Explore</h2>
                <p className="text-sm text-gray-600">
                  Refine the dishes by schedule, day, or price.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 rounded-md border px-3 text-sm"
                  placeholder="Search dishes..."
                />
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="h-9 rounded-md border px-2 text-sm"
                >
                  <option value="all">All availability</option>
                  <option value="available">Available now</option>
                  <option value="unavailable">Out of stock</option>
                </select>
                <select
                  value={dayFilter}
                  onChange={(e) => setDayFilter(e.target.value)}
                  className="h-9 rounded-md border px-2 text-sm"
                >
                  <option value="all">All days</option>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <select
                  value={`${priceRange[0]}-${priceRange[1]}`}
                  onChange={(e) => {
                    const [min, max] = e.target.value.split("-").map(Number);
                    setPriceRange([min, max]);
                  }}
                  className="h-9 rounded-md border px-2 text-sm"
                >
                  <option value="0-9999">All prices</option>
                  <option value="0-100">₱0 - ₱100</option>
                  <option value="100-200">₱100 - ₱200</option>
                  <option value="200-500">₱200 - ₱500</option>
                </select>
              </div>
            </header>

            {/* Dish Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {filteredMenu.length > 0 ? (
                filteredMenu
                  .slice()
                  .sort((a, b) => {
                    const rankA = getAvailabilityRank(a);
                    const rankB = getAvailabilityRank(b);
                    if (rankA !== rankB) return rankA - rankB;
                    const aStart = new Date(a.availabilityRange?.start ?? now);
                    const bStart = new Date(b.availabilityRange?.start ?? now);
                    return aStart.getTime() - bStart.getTime();
                  })
                  .map((it) => (
                    <article
                      key={it.id}
                      className="group overflow-hidden rounded-2xl border bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300"
                    >
                      <div className="relative">
                        <img
                          src={it.imageUrl}
                          alt={it.name}
                          className="h-40 w-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = fallbackImage;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent" />
                        <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-gray-800">
                          {renderAvailabilityChip(it)}
                        </div>
                        {!it.hasStock && (
                          <div className="absolute inset-0 grid place-items-center bg-white/60 text-xs font-semibold text-gray-800">
                            Out of stock
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-base font-semibold">{it.name}</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {it.description}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="text-sm font-medium">₱{it.price.toFixed(2)}</div>
                          {it.availableDays && (
                            <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs text-rose-700">
                              {formatDays(it.availableDays)}
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  ))
              ) : (
                <p className="col-span-full text-center text-sm text-gray-600">
                  No dishes match your filters.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>

      <Footer/>
      <VisitLogger/>
    </div>
  );
}


const fallbackImage =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop";


function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function renderAvailabilityChip(it: MenuItem) {
  const now = new Date();
  const start = it.availabilityRange
    ? new Date(it.availabilityRange.start)
    : now;
  const end = it.availabilityRange ? new Date(it.availabilityRange.end) : now;
  const fmt = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  });

  if (!it.hasStock) {
    return (
      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">
        Unavailable
      </span>
    );
  }

  if (isSameDay(start, now)) {
    return (
      <span className="rounded-full bg-green-100 px-2 py-0.5 text-green-800">
        Available today
      </span>
    );
  }

  if (start > now) {
    return (
      <span className="rounded-full bg-orange-100 px-2 py-0.5 text-orange-800">
        Available {fmt.format(start)}
      </span>
    );
  }

  if (end && end < now) {
    return (
      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">
        Ended {fmt.format(end)}
      </span>
    );
  }

  return (
    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-rose-800">
      Limited
    </span>
  );
}

function formatDays(days: string[]) {
  return days.join(", ");
}

function isAvailableNow(it: MenuItem) {
  const now = new Date();
  const start = new Date(it.availabilityRange?.start ?? now);
  const end = new Date(it.availabilityRange?.end ?? now);
  return it.hasStock && start <= now && (!end || end >= now);
}

// Return a name for rank (for filters)
function rankName(rank: number): string {
  switch (rank) {
    case 0:
      return "available";
    case 1:
      return "upcoming";
    case 2:
      return "limited";
    case 3:
      return "ended";
    case 4:
      return "unavailable";
    default:
      return "other";
  }
}

// Ranking logic used for sorting & filtering
function getAvailabilityRank(it: MenuItem) {
  const now = new Date();
  const start = new Date(it.availabilityRange?.start ?? now);
  const end = new Date(it.availabilityRange?.end ?? now);

  if (!it.hasStock) return 4; // Unavailable
  if (start > now) return 1; // Upcoming
  if (end && end < now) return 3; // Ended
  if (isAvailableNow(it)) return 0; // Available now
  return 2; // Limited
}
