
export default function Hero() {
  return (
    <section
      className="relative isolate"
      aria-label="Hero"
      style={{
        backgroundImage:
          "url('Banner1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative mx-auto flex w-full max-w-6xl items-start justify-between gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <a href="/menu" className="sr-only">
          Skip to menu
        </a>
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-10 pt-24 sm:px-6 sm:pt-28 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-7xl">
            Sisigan Ni Kuya Moy
          </h1>
          <div className="mt-4 flex text-2xl justify-center font-bold text-orange-400 mb-32">
            Para sa estudyanteng gutom pero tipid
          </div>
        </div>
      </div>
    </section>
  );
}
