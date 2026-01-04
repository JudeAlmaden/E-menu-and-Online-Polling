import { motion } from "framer-motion";

type Testimonial = {
  name: string;
  role: string;
  quote: string;
  avatar: string;
  time: string;
  color?: string;
};

export default function TestimonialsSection() {
  const testimonials: Testimonial[] = [
    {
      name: "Justine Jude Almaden",
      role: "BSIT-4A",
      quote: "Ang adik ko sa adobo dito, parang may magic sa bawat subo!",
      color: "from-rose-400 to-pink-300",
      time: "2h ago",
      avatar: "Almaden.jpg",
    },
    {
      name: "Jude Ivan Abrea",
      role: "BSIT-4A",
      quote: "Hindi ko alam kung anong sekreto nila, pero bawat ulam perfect ang timpla.",
      color: "from-orange-400 to-amber-300",
      time: "5h ago",
      avatar: "Abrea.jpg"
    },
    {
      name: "Ren Del Monte",
      role: "BSIT-4A",
      quote: "Parang home-cooked ang lasa ng bawat putahe — di mo alam kung saan magsisimula sa kakakain!",
      color: "from-blue-400 to-cyan-300",
      time: "1d ago",
      avatar: "Ren.jpg",
    },
    {
      name: "Mark Jovan Cananca",
      role: "BSIT-4A",
      quote: "Ang sinigang dito, tamang-tama ang asim — gusto mo pang uminom ng sabaw!",
      color: "from-green-400 to-teal-900",
      time: "3h ago",
      avatar: "https://i.pravatar.cc/150?img=50",
    },    
    {
      name: "John Zues Marte",
      role: "BSIT-4A",
      quote: "Parang lutong-bahay! Masarap, mura, at sulit sa bawat kain.",
      color: "from-violet-400 to-gray-800",
      time: "4h ago",
      avatar: "Marte.jpg",
    },
  ];
  
  return (
    <section id="testimonials" className="relative bg-white py-20">
      {/* Fun slogan header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          Hindi lang{" "}
          <span className="bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">
            pagkain
          </span>{" "}
          ang masarap —
          <br className="hidden sm:block" /> pati feedback!
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          Tignan ang masasabi ng aming mga suki!
        </p>
      </div>

    {/* Testimonials Grid with Offset */}
    <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 sm:grid-cols-2 gap-10 px-4">
      {testimonials.map((t, i) => (
        <motion.div
          key={i}
          className={`w-full ${i % 2 !== 0 ? 'mt-10' : 'mt-0'}`} // offset every second card
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.6 }}
        >
          <TestimonialCard testimonial={t} />
        </motion.div>
      ))}
    </div>

    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="relative flex flex-col h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition hover:shadow-lg hover:-translate-y-1 duration-300 px-6">
      {/* Gradient accent line */}
      <div
        className={`h-1 w-full bg-gradient-to-r ${testimonial.color ?? "from-rose-500 to-orange-400"}`}
      />

      <div className="p-6 flex flex-col justify-between h-full">
        <p className="text-gray-800 text-base leading-relaxed mb-6">
          “{testimonial.quote}”
        </p>

        <div className="flex items-center gap-4">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="h-12 w-12 rounded-full object-cover border border-gray-200"
          />
          <div>
            <h4 className="font-semibold text-gray-900 text-lg">
              {testimonial.name}
            </h4>
            <p className="text-sm text-gray-500">
              {testimonial.role} • {testimonial.time}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
