export default function Footer() {
  return (
    <footer className="relative mt-12 bg-black text-gray-200">
      <div className="relative mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3 md:grid-cols-6">
          {/* Brand / About */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-xl font-semibold text-white">Sisigan Ni Kuya Moy</div>
            <p className="max-w-sm text-gray-400">
              Para sa estudyanteng gutom pero tipid
            </p>
          </div>

          {/* Hours */}
          <div className="space-y-2">
            <div className="font-medium text-white">Hours</div>
            <ul className="space-y-1 text-gray-400">
              <li>Mon–Sat: 6:00 AM – 6:00 PM</li>
              <li>Sun: Closed</li>
            </ul>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <div className="font-medium text-white">Location</div>
            <ul className="space-y-1 text-gray-400">
              <li>DP Building Beside St. Anne College Lucena</li>
              <li>Lucena City, Quezon</li>
              <li>Philippines</li>
            </ul>
            <a
              href="#find-us"
              className="inline-block pt-1 text-white underline underline-offset-4 hover:text-gray-300 transition"
            >
              Get directions
            </a>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <div className="font-medium text-white">Contact</div>
            <ul className="space-y-1 text-gray-400">
              <li>Facebook: Sisigan Ni Kuya Moy</li>
            </ul>
          </div>

          {/* Links */}
          <div className="space-y-2">
            <div className="font-medium text-white">Links</div>
            <ul className="space-y-1 text-gray-400">
              <li><a className="hover:text-white transition" href="#menu">Menu</a></li>
              <li><a className="hover:text-white transition" href="#vote">Vote</a></li>
              <li><a className="hover:text-white transition" href="#find-us">Find us</a></li>
              <li><a className="hover:text-white transition" href="#">Testimonials</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-gray-700 pt-6 text-xs text-gray-400">
          <div>© {new Date().getFullYear()} . All rights reserved.</div>
          <div className="space-x-4">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
