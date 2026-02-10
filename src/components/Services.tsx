import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Hammer,
  PaintBucket,
  Ruler,
  HardHat,
  Lightbulb,
  ChevronDown,
} from "lucide-react";

const services = [
  {
    icon: Building2,
    title: "New Construction",
    description:
      "From foundation to finish, we build custom homes with structural excellence and attention to every detail.",
    highlights: ["Custom Floor Plans", "Premium Materials", "Quality Assurance"],
    color: "from-primary/20 to-primary/5",
  },
  {
    icon: Hammer,
    title: "Reconstruction",
    description:
      "Restoring and rebuilding structures with modern engineering standards while preserving architectural character.",
    highlights: ["Structural Assessment", "Heritage Preservation", "Modern Upgrades"],
    color: "from-primary/15 to-primary/5",
  },
  {
    icon: PaintBucket,
    title: "Renovation",
    description:
      "Transforming interiors and exteriors with contemporary designs, premium materials, and expert craftsmanship.",
    highlights: ["Interior Design", "Exterior Makeover", "Space Optimization"],
    color: "from-primary/10 to-primary/5",
  },
  {
    icon: Ruler,
    title: "Architectural Planning",
    description:
      "Precise blueprints and 3D designs that bring your vision to life before construction begins.",
    highlights: ["3D Visualization", "Site Analysis", "Permit Assistance"],
    color: "from-primary/20 to-primary/5",
  },
  {
    icon: HardHat,
    title: "Project Management",
    description:
      "End-to-end oversight ensuring timelines, budgets, and quality standards are met on every project.",
    highlights: ["Timeline Tracking", "Budget Control", "Safety Compliance"],
    color: "from-primary/15 to-primary/5",
  },
  {
    icon: Lightbulb,
    title: "Consulting",
    description:
      "Expert guidance on materials, regulations, and design to make informed decisions for your project.",
    highlights: ["Material Selection", "Code Compliance", "Cost Estimation"],
    color: "from-primary/10 to-primary/5",
  },
];

const VISIBLE_COUNT = 3;

const Services = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleServices = services.slice(currentIndex, currentIndex + VISIBLE_COUNT);
  const remaining = services.length - currentIndex - VISIBLE_COUNT;

  const advance = () => {
    if (currentIndex + VISIBLE_COUNT < services.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <section id="services" className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-3">
            What We Do
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
            Our Services
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto text-sm">
            Comprehensive construction and design solutions tailored to bring your vision to reality
          </p>
        </motion.div>

        {/* Stacked Queue */}
        <div className="relative max-w-5xl mx-auto">
          {/* Background stacked cards hint */}
          {remaining > 0 && (
            <>
              <div className="absolute -bottom-3 left-4 right-4 h-16 bg-card/60 rounded-lg border border-border/40 blur-[1px] z-0" />
              <div className="absolute -bottom-1.5 left-2 right-2 h-16 bg-card/80 rounded-lg border border-border/60 z-[1]" />
            </>
          )}

          <div className="relative z-10 grid md:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {visibleServices.map((service, i) => (
                <motion.div
                  key={service.title}
                  layout
                  initial={{ opacity: 0, y: 60, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { delay: i * 0.1, duration: 0.5, type: "spring", stiffness: 100 },
                  }}
                  exit={{
                    opacity: 0,
                    y: -40,
                    scale: 0.95,
                    transition: { duration: 0.3 },
                  }}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                  className="bg-card rounded-xl p-7 border border-border hover:border-primary/50 transition-colors group cursor-default"
                >
                  <div
                    className={`w-14 h-14 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <service.icon className="w-7 h-7 text-primary" />
                  </div>

                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm mb-5">
                    {service.description}
                  </p>

                  {/* Highlights */}
                  <ul className="space-y-2">
                    {service.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Navigate / cycle button */}
          {services.length > VISIBLE_COUNT && (
            <motion.button
              onClick={advance}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mx-auto mt-10 flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              {remaining > 0
                ? `Show more services (${remaining} remaining)`
                : "Back to start"}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${remaining <= 0 ? "rotate-180" : ""}`}
              />
            </motion.button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Services;
