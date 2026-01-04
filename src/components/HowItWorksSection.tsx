import { motion } from "framer-motion";
import { ClipboardList, Cpu, IndianRupee } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Enter Property Details",
    description:
      "Fill in your property specifications including location, size, amenities, and other key features.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Model Analyzes Features",
    description:
      "Our advanced machine learning model processes your inputs against thousands of market data points.",
  },
  {
    icon: IndianRupee,
    step: "03",
    title: "Get Instant Price Prediction",
    description:
      "Receive an accurate property valuation instantly, powered by real market trends and AI analysis.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-body text-sm font-medium mb-4">
            Simple Process
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            How It Works
          </h2>
          <p className="font-body text-lg text-muted-foreground">
            Get your property valuation in three simple steps. Our streamlined process makes it easy for anyone to use.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[calc(50%+60px)] w-[calc(100%-120px)] h-0.5 bg-gradient-to-r from-accent to-accent/30" />
              )}

              <div className="text-center relative">
                {/* Step Number */}
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-secondary border-4 border-accent/20 mb-8 relative">
                  <item.icon className="w-12 h-12 text-accent" />
                  <span className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-accent text-accent-foreground font-heading text-lg font-bold flex items-center justify-center shadow-gold">
                    {item.step}
                  </span>
                </div>

                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
                  {item.title}
                </h3>
                <p className="font-body text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
