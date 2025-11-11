import { useEffect, useState } from "react";
import { Utensils, ChevronRight, Sparkles } from "lucide-react";

type Dish = {
  id: number;
  name: string;
  price: number;
  image_url: string;
};

export default function MenusSection() {
  const [items, setItems] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommended = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://bnvlaiftxamrudncnygx.supabase.co/functions/v1/get-recommendations"
        );
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const json = await res.json();
        setItems(json.recommendedDishes || []);
        setError(null);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, []);

  if (!loading && !error && items.length === 0) {
    return (
      <section id="menu" className="bg-gradient-to-br from-rose-50 via-orange-50 to-rose-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-rose-500 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg animate-pulse">
                <Utensils className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                  Explore Our Menu
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Discover our full collection of delicious dishes, carefully crafted with fresh ingredients and served with love.
              </p>
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-4 border-2 border-rose-200">
                  <p className="text-3xl font-bold text-rose-600 mb-1">Freshly</p>
                  <p className="text-sm text-gray-600 font-semibold">Dishes</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 border-2 border-orange-200">
                  <p className="text-3xl font-bold text-orange-600 mb-1">Affordable</p>
                  <p className="text-sm text-gray-600 font-semibold">Prices</p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-4 border-2 border-red-200">
                  <p className="text-3xl font-bold text-red-600 mb-1">100%</p>
                  <p className="text-sm text-gray-600 font-semibold">Quality</p>
                </div>
              </div>
              <a
                href="/menu"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-rose-600 to-orange-600 text-white text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
              >
                <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                View Full Menu
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="bg-white py-20">
      <div className="text-center mb-10">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
          Best <span className="text-rose-600">Sellers</span>
        </h2>
        <div className="mx-auto mt-3 h-1 w-24 bg-gradient-to-r from-rose-500 to-orange-400 rounded-full" />
        <p className="mt-4 text-gray-600 text-lg">
          Our crowd favorites — made with love and served fresh daily.
        </p>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 mt-4">Loading recommendations...</p>
        </div>
      )}

      {error && (
        <div className="max-w-md mx-auto text-center py-8">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="mx-auto flex flex-wrap justify-center gap-8 px-6 max-w-6xl">
          {items.map((it) => (
            <Card key={it.id} title={it.name} price={`₱${it.price}`} img={it.image_url} />
          ))}
          <SeeAllCard />
        </div>
      )}
    </section>
  );
}

type CardProps = { title: string; price: string; img: string };
function Card({ title, price, img }: CardProps) {
  return (
    <article className="group relative h-64 w-64 overflow-hidden rounded-3xl shadow-md transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
      <img
        src={img}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90" />
      <div className="relative z-10 flex h-full flex-col justify-end p-6">
        <h3 className="text-xl font-bold text-white drop-shadow-lg">{title}</h3>
        <p className="mt-1 text-lg font-semibold text-rose-200 drop-shadow-sm">{price}</p>
      </div>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-t from-rose-600/30 via-orange-500/10 to-transparent" />
    </article>
  );
}

function SeeAllCard() {
  return (
    <a
      href="/menu"
      className="group relative flex h-64 w-64 flex-col items-center justify-center overflow-hidden rounded-3xl border border-rose-200 bg-gradient-to-br from-rose-50 via-orange-50 to-rose-100 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10 text-center space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-600 text-white shadow-md group-hover:scale-110 transition-transform duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h18M3 16h18M4 12h16" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-rose-700">Explore the Full Menu</h3>
        <p className="text-sm text-gray-600">Discover all our delicious dishes.</p>
        <span className="inline-flex items-center text-sm font-medium text-rose-600 group-hover:underline">
          See all
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-4 w-4">
            <path fillRule="evenodd" d="M3.75 12a.75.75 0 0 1 .75-.75h13.19l-3.22-3.22a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H4.5A.75.75 0 0 1 3.75 12Z" clipRule="evenodd" />
          </svg>
        </span>
      </div>
    </a>
  );
}
