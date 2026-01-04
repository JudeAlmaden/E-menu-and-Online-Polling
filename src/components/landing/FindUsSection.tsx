// import SectionHeader from "./SectionHeader";
import { MapPin, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  lat?: number;
  lng?: number;
  address?: string;
  zoom?: number;
  photos?: string[];
};

export default function FindUsSection({
  lat=13.9611,
  lng=121.6108,
  address="We are located just in front of St. Anne College Lucena. Come by and give us a visit sometime <3",
  zoom = 16,
  // photos = [
  //      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop",
  //      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop",
  //      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop",

  //     ],
}: Props) {
  const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&hl=en`;
  const embedUrl = `${mapsUrl}&output=embed`;

  return (
    <section id="find-us" className="relative py-20 bg-white px-6 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl text-center mb-12">
        <h1 className="text-3xl flex flex-row flex-wrap sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            <span className="bg-gradient-to-r w-full from-rose-600 to-orange-500 bg-clip-text text-transparent">
             Handa ka na ba Kumain?      
            </span>
            <span className="bg-gradient-to-r w-full from-rose-600 to-orange-500 bg-clip-text text-transparent">
             Find us at   
            </span>
        </h1>
      </div>

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-5">
        {/* Map Section */}
        <div className="relative col-span-3 overflow-hidden rounded-3xl border bg-gray-50 shadow-lg">
          <iframe
            title="Location map"
            src={embedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="relative z-10 h-[400px] w-full rounded-3xl border-0"
            allowFullScreen
          />
          <div className="absolute inset-0 rounded-3xl ring-1 ring-white/70" />
        </div>

        {/* Info Section */}
        <div className="col-span-2 flex justify-center h-full">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative w-full max-w-md rounded-3xl bg-white/80 backdrop-blur-md border border-rose-200 p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            {/* Gradient Glow Background */}
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-rose-100/40 via-white/30 to-orange-50 blur-3xl" />

            {/* Header */}
            <div className="flex items-center gap-3 text-rose-600">
              <MapPin className="h-6 w-6" />
              <h3 className="text-2xl font-bold">Our Location</h3>
            </div>

            {/* Address */}
            <p className="mt-4 text-gray-700 leading-relaxed">{address}</p>

            {/* Buttons & Coordinates */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105 hover:bg-rose-700"
              >
                <ExternalLink className="h-4 w-4 transition-transform group-hover:rotate-12" />
                Open in Google Maps
              </a>
              <div className="text-xs text-gray-500">
                📍 {lat.toFixed(5)}, {lng.toFixed(5)}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 border-t border-gray-200 pt-3 text-sm text-gray-500">
              🕒 We’re open daily from <span className="font-medium">10:00 AM</span> to{" "}
              <span className="font-medium">5:00 PM</span>. Drop by anytime!
            </div>
          </motion.div>
        </div>
      </div>

      {/* Photo Gallery */}
      {/* <div className="mx-auto mt-16 max-w-6xl">
        <div className="mb-4 flex items-center gap-2 text-rose-600 font-medium">
          <Camera className="h-5 w-5" />
          <span>Photos</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((src, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl group shadow-lg"
            >
              <img
                src={src}
                alt={`Canteen photo ${idx + 1}`}
                className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
            </div>
          ))}
        </div>
      </div> */}
    </section>
  );
}
