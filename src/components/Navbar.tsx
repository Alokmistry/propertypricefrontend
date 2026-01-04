import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, Menu, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // ---------------- SCROLL EFFECT ----------------
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ---------------- SUPABASE AUTH STATE (IMPORTANT) ----------------
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // ---------------- LOGOUT ----------------
  const handleLogout = async () => {
    await supabase.auth.signOut();

    setIsMobileMenuOpen(false);

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });

    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Predict Price" },
    { path: "/#features", label: "Features" },
    { path: "/#how-it-works", label: "How It Works" },
  ];

  const handleNavClick = (path: string) => {
    setIsMobileMenuOpen(false);

    if (path.includes("#")) {
      const element = document.getElementById(path.split("#")[1]);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-elegant border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* ---------------- LOGO ---------------- */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shadow-gold transition-transform duration-300 group-hover:scale-105">
              <Building2 className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="font-heading text-xl font-semibold text-foreground">
              PropValue<span className="text-accent">AI</span>
            </span>
          </Link>

          {/* ---------------- DESKTOP NAV ---------------- */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`font-body text-sm font-medium transition-colors duration-200 hover:text-accent ${
                  isActive(link.path)
                    ? "text-accent"
                    : "text-foreground/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ---------------- AUTH BUTTONS (GOOGLE STYLE) ---------------- */}
          <div className="hidden md:flex items-center gap-3 min-w-[180px] justify-end">
            {!isLoggedIn ? (
              <>
                <Link to="/signin">
                  <Button variant="nav-outline" size="sm">
                    Sign In
                  </Button>
                </Link>

                <Link to="/signup">
                  <Button variant="gold" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <Button variant="nav-outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            )}
          </div>

          {/* ---------------- MOBILE MENU BUTTON ---------------- */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* ---------------- MOBILE MENU ---------------- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-border"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`font-body text-base font-medium py-2 ${
                    isActive(link.path)
                      ? "text-accent"
                      : "text-foreground/80"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="flex flex-col gap-3 pt-4 border-t border-border">
                {!isLoggedIn ? (
                  <>
                    <Link
                      to="/signin"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button variant="nav-outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>

                    <Link
                      to="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button variant="gold" className="w-full">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Button
                    variant="nav-outline"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
