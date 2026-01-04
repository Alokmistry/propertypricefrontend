import { Link } from "react-router-dom";
import { Building2, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <Building2 className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="font-heading text-xl font-semibold">
                PropValue<span className="text-accent">AI</span>
              </span>
            </Link>
            <p className="text-primary-foreground/70 font-body text-sm leading-relaxed">
              AI-powered real estate price prediction platform helping you make smarter property decisions with accurate market insights.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-3 font-body text-sm">
              <li>
                <Link to="/" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  Predict Price
                </Link>
              </li>
              <li>
                <Link to="/#features" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold">Legal</h4>
            <ul className="space-y-3 font-body text-sm">
              <li>
                <Link to="/privacy" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold">Contact Us</h4>
            <ul className="space-y-3 font-body text-sm">
              <li className="flex items-center gap-3 text-primary-foreground/70">
                <Mail className="w-4 h-4 text-accent" />
                contact@propvalueai.com
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/70">
                <Phone className="w-4 h-4 text-accent" />
                +91 00000 00000
              </li>
              <li className="flex items-start gap-3 text-primary-foreground/70">
                <MapPin className="w-4 h-4 text-accent mt-0.5" />
                Mumbai, Maharashtra, India
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 space-y-6">
          {/* Disclaimer */}
          <p className="text-primary-foreground/50 text-xs font-body text-center leading-relaxed max-w-4xl mx-auto">
            Disclaimer: The predicted property prices are generated using a machine learning model trained on historical real estate data. The results are indicative estimates and should not be considered as official valuations.
          </p>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/60 text-sm font-body">
              © 2024 PropValueAI. All rights reserved.
            </p>
            <p className="text-primary-foreground/60 text-sm font-body">
              Powered by Machine Learning & Real Market Data
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
