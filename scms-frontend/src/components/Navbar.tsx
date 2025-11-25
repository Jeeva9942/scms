import { useState, useEffect } from "react";
import {
  Leaf,
  Menu,
  X,
  Home,
  BarChart3,
  Camera,
  Sprout,
  ShoppingCart,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/lib/translations";
import { Link, useLocation } from "react-router-dom";
import Mobsms from "@/sms/mobsms.tsx";

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const userSelectedLanguage = language;
  console.log("🌐 User selected language:", userSelectedLanguage);

  const navLinks = [
    { key: "home", label: t.nav.home, icon: Home, path: "/" },
    { key: "dashboard", label: t.nav.dashboard, icon: BarChart3, path: "/dashboard" },
    { key: "diseaseDetection", label: t.nav.diseaseDetection, icon: Camera, path: "/disease-detection" },
    { key: "cropSuggestions", label: t.nav.cropSuggestions, icon: Sprout, path: "/crop-recommendations" },
    { key: "suppliers", label: t.nav.suppliers, icon: ShoppingCart, path: "/suppliers" },
    { key: "yourFarm", label: t.nav.yourFarm, icon: Leaf, path: "/your-farm" },
  ];

  const languageOptions = [
    { code: "en" as Language, label: "ENGLISH", flag: "EN" },
    { code: "ta" as Language, label: "TAMIL", flag: "TM" },
    { code: "ml" as Language, label: "MALAYALAM", flag: "ML" },
  ];

  const currentLanguage = languageOptions.find((lang) => lang.code === language);

  // ✅ Font size logic for each language
  const navItemClass =
    userSelectedLanguage === "en"
      ? "text-[18px] md:text-[19px]" // bigger for English
      : userSelectedLanguage === "ml"
      ? "text-[13px] md:text-[14px]" // smaller for Malayalam
      : "text-[15px] md:text-[16px]"; // normal for Tamil or others

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-green-600/95 backdrop-blur-md shadow-lg border-b border-green-500/30 transition-all duration-300 h-20`}
    >
      <div className="w-full h-full">
        <div className="flex items-center justify-between h-20">
          {/* Brand */}
          <div className="flex items-center gap-2 sm:gap-3 flex-none pl-4">
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-accent rounded-xl flex items-center justify-center shadow-lg transition-transform">
              <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
            </div>
            <h1 className="text-[20px] md:text-[22px] font-bold text-white">
              {t.appName}
            </h1>
          </div>
            
          {/* Center Navigation */}
          <div className="flex-1 min-w-0">
            <Mobsms />
            <nav className="hidden lg:flex items-center justify-center gap-3 text-sm leading-none whitespace-nowrap">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.key}
                    to={link.path}
                    className={`relative flex items-center gap-2 h-10 px-3 rounded-lg font-medium leading-none transition-colors duration-200 shrink-0 border-b-2 ${navItemClass} ${
                      isActive
                        ? "text-white border-white/60"
                        : "text-white/80 border-transparent hover:text-white"
                    }`}
                  >
                    <link.icon className="w-4 h-4 shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 sm:gap-4 justify-end flex-none pr-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border border-white/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm shadow-md group w-[92px] md:w-[140px] justify-between h-10"
                >
                  <span className="text-base">{currentLanguage?.flag}</span>
                  <span className="hidden md:inline ml-2 font-medium text-sm">
                    {currentLanguage?.label}
                  </span>
                  <ChevronDown className="w-3 h-3 ml-1 group-hover:translate-y-0.5 transition-transform" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-card/95 backdrop-blur-lg border-border shadow-xl"
              >
                {languageOptions.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`cursor-pointer transition-colors ${
                      language === lang.code
                        ? "bg-accent/20 text-accent-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <span className="mr-3 text-lg">{lang.flag}</span>
                    <span className="font-medium">{lang.label}</span>
                    {language === lang.code && (
                      <CheckCircle2 className="w-4 h-4 ml-auto text-accent" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 animate-fade-in">
            <div className="space-y-1">
              {navLinks.map((link, index) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.key}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 py-3 px-4 rounded-lg font-medium transition-colors ${navItemClass} ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <link.icon className="w-5 h-5 shrink-0" />
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
