import { motion } from "framer-motion";
import {
  Building2,
  Hammer,
  PaintBucket,
  Ruler,
  HardHat,
  Lightbulb,
} from "lucide-react";
import ScrollStack, { ScrollStackItem } from "./ScrollStack";

const services = [
  {
    icon: Building2,
    title: "New Construction",
    description:
      "From foundation to finish, we build custom homes with structural excellence and attention to every detail.",
    highlights: ["Custom Floor Plans", "Premium Materials", "Quality Assurance"],
    color: "from-primary/20 to-primary/5",
    accent: "bg-primary/10",
  },
  {
    icon: Hammer,
    title: "Reconstruction",
    description:
      "Restoring and rebuilding structures with modern engineering standards while preserving architectural character.",
    highlights: ["Structural Assessment", "Heritage Preservation", "Modern Upgrades"],
    color: "from-primary/15 to-primary/5",
    accent: "bg-primary/8",
  },
  {
    icon: PaintBucket,
    title: "Renovation",
    description:
      "Transforming interiors and exteriors with contemporary designs, premium materials, and expert craftsmanship.",
    highlights: ["Interior Design", "Exterior Makeover", "Space Optimization"],
    color: "from-primary/10 to-primary/5",
    accent: "bg-primary/6",
  },
  {
    icon: Ruler,
    title: "Architectural Planning",
    description:
      "Precise blueprints and 3D designs that bring your vision to life before construction begins.",
    highlights: ["3D Visualization", "Site Analysis", "Permit Assistance"],
    color: "from-primary/20 to-primary/5",
    accent: "bg-primary/10",
  },
  {
    icon: HardHat,
    title: "Project Management",
    description:
      "End-to-end oversight ensuring timelines, budgets, and quality standards are met on every project.",
    highlights: ["Timeline Tracking", "Budget Control", "Safety Compliance"],
    color: "from-primary/15 to-primary/5",
    accent: "bg-primary/8",
  },
  {
    icon: Lightbulb,
    title: "Consulting",
    description:
      "Expert guidance on materials, regulations, and design to make informed decisions for your project.",
    highlights: ["Material Selection", "Code Compliance", "Cost Estimation"],
    color: "from-primary/10 to-primary/5",
    accent: "bg-primary/6",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-background">
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

        <div className="max-w-3xl mx-auto">
          <ScrollStack>
            {services.map((service, i) => (
              <ScrollStackItem key={service.title}>
                <div className="bg-card border border-border p-8 md:p-10 rounded-xl">
                  <div className="flex items-start gap-6">
                    <div
                      className={`w-16 h-16 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center shrink-0`}
                    >
                      <service.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground font-medium tracking-wider uppercase">
                        0{i + 1} / 0{services.length}
                      </span>
                      <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground mt-1 mb-3">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-5">
                        {service.description}
                      </p>
                      <ul className="flex flex-wrap gap-2">
                        {service.highlights.map((h) => (
                          <li
                            key={h}
                            className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
                          >
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </div>
      </div>
    </section>
  );
};

export default Services;
