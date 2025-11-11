export default function AboutUs() {
  return (
    <section
      id="about"
      className="relative py-20 sm:py-28 bg-gradient-to-b from-[#3a1f1d] via-[#4b2b2a] to-[#2a1615] text-gray-100"
      aria-label="About Us"
    >
      {/* Subtle overlay glow */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/food.png')] opacity-10" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Image */}
          <div className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-rose-900/20">
            <img
              src="https://foodkudos.com/wp-content/uploads/2024/11/sizzling-pork-sisig-manila-main.jpg"
              alt="Tres Marias Karinderya"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              About Us
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-gray-200">
              Welcome to{" "}
              <span className="font-semibold text-rose-400">
                Sisigan Ni Kuya Moy
              </span>
              — your friendly canteen just around the campus where every meal feels like
              home. Here, we serve freshly cooked Filipino favorites that bring comfort and
              good memories to your college life — from savory adobo and hearty sinigang to other classic dishes
              you’ll surely love.  
              <br /><br />
              Each meal is made with care, using fresh local ingredients and a touch of
              home-style cooking that reminds you of family meals and laughter with
              friends. Whether you’re taking a quick lunch break or hanging out after
              class,{" "}
              <span className="font-semibold text-rose-400">
                Sisigan Ni Kuya Moy
              </span>{" "}
              is always here to serve good food, good vibes, and good company.
            </p>
            <div className="mt-10">
              <a
                href="/menu"
                className="inline-flex items-center rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-800/40 transition-all hover:bg-rose-700 hover:shadow-rose-900/60"
              >
                Explore Our Menu
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
