// import { LogOut, User } from "lucide-react";

export default function HeroHeader() {
  return (
    <section className="relative isolate">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-30"
        aria-hidden
      />

      {/* Gradient overlay for better readability */}
      <div
        className="absolute inset-0 bg-gradient-to-tr from-rose-900/70 via-rose-700/50 to-orange-600/60"
        aria-hidden
      />

      {/* Content */}
      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl text-white">
          <h1 className="text-3xl font-extrabold sm:text-4xl">
            Menu Management
          </h1>
          <p className="mt-2 text-sm sm:text-base text-rose-100/90">
            View and manage all your dishes, update availability, and keep your menu organized.
          </p>
        </div>
      </div>
    </section>
  );
}
