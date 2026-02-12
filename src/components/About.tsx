import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import ceoImage from "@/assets/tawseeg-bro-pic.jpeg";

const stats = [
  { value: "250+", label: "Projects Completed" },
  { value: "10+", label: "Years Experience" },
  { value: "98%", label: "Client Satisfaction" },
];

const strengths = [
  "Licensed & insured civil engineers",
  "On-time, on-budget delivery",
  "Sustainable building practices",
  "Full project management",
];

const team = [
  { name: "Er. Tawseef Wani", role: "CEO & Founder", image: ceoImage },
];

const About = () => {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* CEO & Leadership */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto mb-20"
        >
          <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-3 text-center">
            Leadership
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
            Meet Our Founder
          </h2>
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-primary shadow-lg mb-6">
              <img
                src={team[0].image}
                alt={team[0].name}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground">
              {team[0].name}
            </h3>
            <p className="text-primary font-semibold mt-1">{team[0].role}</p>
            <p className="text-muted-foreground text-center max-w-lg mt-3 leading-relaxed">
              With over 10 years of experience in architecture and civil engineering,
              Er. Tawseef Wani leads M-Square Architects and Designers with a vision for innovative,
              sustainable design that transforms spaces and communities.
            </p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-3">
              About Us
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Trusted Engineering Excellence Since 2016
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We are a team of passionate civil engineers dedicated to delivering exceptional
              construction, reconstruction, and renovation projects. Every structure we build
              reflects our commitment to quality, safety, and innovative design.
            </p>
            <div className="grid grid-cols-3 gap-6 mb-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-2xl md:text-3xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            {strengths.map((item) => (
              <div
                key={item}
                className="flex items-start gap-4 bg-card p-5 rounded-lg border border-border"
              >
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-foreground font-medium">{item}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
