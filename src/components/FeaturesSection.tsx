import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  BarChart3,
  Shield,
  Building2,
  Gem,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Driven Price Prediction",
    description:
      "Advanced machine learning models analyze thousands of data points to deliver precise property valuations.",
  },
  {
    icon: BarChart3,
    title: "Uses Real Market Data",
    description:
      "Our models are trained on actual market transactions, ensuring predictions reflect current market trends.",
  },
  {
    icon: Shield,
    title: "Accurate & Reliable Estimates",
    description:
      "Industry-leading accuracy rates backed by rigorous testing and continuous model improvements.",
  },
  {
    icon: Building2,
    title: "Residential & Commercial",
    description:
      "Comprehensive support for all property types including apartments, villas, commercial spaces, and more.",
  },
  {
    icon: Gem,
    title: "Luxury Property Evaluation",
    description:
      "Specialized algorithms for high-value luxury properties with premium amenities consideration.",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description:
      "Your data is encrypted and never shared. We prioritize your privacy and security at every step.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent font-body text-sm font-medium mb-4">
            Why Choose Us
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Why Choose Our Platform?
          </h2>
          <p className="font-body text-lg text-muted-foreground">
            Experience the future of real estate valuation with our cutting-edge AI technology and comprehensive market analysis.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 bg-card border-border">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                    <feature.icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="font-body text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
