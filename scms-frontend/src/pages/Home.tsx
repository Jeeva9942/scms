import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Chatbot from "@/components/ui/chatbot";
import { 
  Leaf, 
  BarChart3, 
  Camera, 
  ShoppingBag, 
  Droplets, 
  Sun, 
  TrendingUp,
  Shield,
  Users,
  CheckCircle2,
  ArrowRight,
  Zap,
  Sparkles,
  Award,
  Target,
  Globe,
  Wifi,
  Settings,
} from "lucide-react";

import { useLanguage } from "../contexts/LanguageContext";
import { Link } from "react-router-dom";

import heroImage from "../assets/hero-farm.png";
import dashboardPreview from "../assets/dashboard-preview.jpg";
import diseaseDetection from "../assets/disease-detection.jpg";
import cropVariety from "../assets/crop-variety.jpg";



export default function Home() {
  const { t, language, setLanguage } = useLanguage();

  const featureIcons = [BarChart3, Camera, Leaf, ShoppingBag];

  return (
    <div className="min-h-screen bg-background pt-10">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Agri Sense" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-emerald-dark/90" />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-accent/30 rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: -10,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{ 
                y: window.innerHeight + 10,
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block"
            >
              <div className="bg-accent/20 backdrop-blur-sm border border-accent/30 rounded-full px-6 py-2 inline-flex items-center gap-2 mb-6">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-primary-foreground font-medium">{t?.hero?.aiPowered || "AI-Powered Agriculture"}</span>
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-primary-foreground leading-tight">
              {(t?.hero?.title || "Default Title").split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  className="inline-block mr-4"
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto"
            >
              {t?.hero?.subtitle || "Default Subtitle"}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex justify-center items-center pt-8"
            >
              <Link to="/dashboard">
                <Button 
                  size="lg" 
                  className="bg-accent hover:bg-accent/90 text-foreground font-bold px-10 py-7 text-lg rounded-full shadow-large hover:shadow-xl transition-all hover:scale-105 group"
                >
                  <Sparkles className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                  {t?.hero?.cta || "Get Started"}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Quick Access Features */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {[
              { 
                title: t?.quickAccess?.monitorFarm?.title || "Monitor Farm", 
                desc: t?.quickAccess?.monitorFarm?.desc || "Real-time sensor data at your fingertips",
                icon: BarChart3,
                color: "from-blue-500 to-cyan-500",
                path: "/dashboard"
              },
              { 
                title: t?.quickAccess?.detectDisease?.title || "Detect Disease", 
                desc: t?.quickAccess?.detectDisease?.desc || "AI-powered instant diagnosis",
                icon: Camera,
                color: "from-purple-500 to-pink-500",
                path: "/disease-detection"
              },
              { 
                title: t?.quickAccess?.getCropTips?.title || "Get Crop Tips", 
                desc: t?.quickAccess?.getCropTips?.desc || "Personalized recommendations",
                icon: Leaf,
                color: "from-green-500 to-emerald-500",
                path: "/crop-recommendations"
              },
            ].map((feature, i) => (
              <Link key={i} to={feature.path}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/20 rounded-2xl p-8 relative overflow-hidden group cursor-pointer text-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity" style={{ backgroundImage: `linear-gradient(to bottom right, var(--accent), transparent)` }} />
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg mx-auto`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-primary-foreground mb-2">{feature.title}</h3>
                  <p className="text-primary-foreground/80 text-sm">{feature.desc}</p>
                  <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all" />
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-accent rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t?.features?.title || "Features"}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(t?.features?.items || []).map((feature, i) => {
              const Icon = featureIcons[i];
              const paths = ["/dashboard", "/disease-detection", "/crop-recommendations", "/suppliers"];
              return (
                <Link key={i} to={paths[i] || "/"}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    whileHover={{ y: -10 }}
                  >
                    <Card className="h-full border-0 shadow-medium hover:shadow-large transition-all bg-card overflow-hidden group cursor-pointer">
                      <CardContent className="p-8 space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <h3 className="text-xl font-bold text-card-foreground">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {feature.desc}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Showcase Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          {/* Dashboard Feature */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-2 gap-12 items-center mb-24"
          >
            <div className="space-y-6">
              <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full font-semibold text-sm">
                <BarChart3 className="inline w-4 h-4 mr-2" />
                {t?.features?.realTimeMonitoring || "Real-time Monitoring"}
              </div>
              <h3 className="text-4xl font-bold text-foreground">
                {t?.features?.items?.[0]?.title || "Dashboard"}
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t?.features?.items?.[0]?.desc || "Real-time insights into your farm's performance with advanced analytics and monitoring."}
              </p>
              <div className="space-y-4 pt-4">
                {[
                  { icon: Droplets, text: t?.features?.tracking?.soilMoisture || "Soil moisture tracking" },
                  { icon: Sun, text: t?.features?.tracking?.temperature || "Temperature monitoring" },
                  { icon: TrendingUp, text: t?.features?.tracking?.growth || "Growth analytics" },
                  { icon: Settings, text: t?.features?.tracking?.irrigation || "Automated irrigation control" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-accent" />
                    </div>
                    <span className="text-foreground font-medium text-lg">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <img 
                src={dashboardPreview} 
                alt="Dashboard" 
                className="rounded-2xl shadow-large w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl" />
            </motion.div>
          </motion.div>

          {/* Disease Detection Feature */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative order-2 md:order-1"
            >
              <img 
                src={diseaseDetection} 
                alt="Disease Detection" 
                className="rounded-2xl shadow-large w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-tl from-accent/20 to-transparent rounded-2xl" />
            </motion.div>
            <div className="space-y-6 order-1 md:order-2">
              <div className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full font-semibold text-sm">
                <Camera className="inline w-4 h-4 mr-2" />
                {t?.features?.aiPoweredDetection || "AI-Powered Detection"}
              </div>
              <h3 className="text-4xl font-bold text-foreground">
                {t?.features?.items?.[1]?.title || "Disease Detection"}
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t?.features?.items?.[1]?.desc || "AI-powered plant disease detection using image recognition technology."}
              </p>
              <div className="space-y-4 pt-4">
                {[
                  t?.features?.diseaseDetection?.instantAnalysis || "Instant analysis and diagnosis",
                  t?.features?.diseaseDetection?.treatmentRecommendations || "Treatment recommendations",
                  t?.features?.diseaseDetection?.preventiveMeasures || "Preventive measures",
                  t?.features?.diseaseDetection?.yieldProtection || "Yield protection strategies",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <CheckCircle2 className="w-7 h-7 text-primary flex-shrink-0" />
                    <span className="text-foreground font-medium text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary to-emerald-dark text-primary-foreground">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t?.benefits?.title || "Benefits"}
            </h2>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              {t?.benefits?.desc || "Empowering farmers with AI-driven insights for sustainable agriculture and better yields."}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {(t?.benefits?.items || []).map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-2xl p-6 flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-foreground" />
                </div>
                <div className="text-lg font-semibold pt-2">{benefit}</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-16"
          >
            <p className="text-xl font-semibold mb-8 max-w-2xl mx-auto">
              {t?.intro?.highlight || "Join thousands of farmers transforming their practices with Agri Sense"}
            </p>
            <Link to="/dashboard">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-foreground font-bold px-10 py-6 text-lg rounded-full shadow-large hover:scale-105 transition-all"
              >
                {t?.hero?.cta || "Get Started"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center"
          >
            {[Shield, Users, CheckCircle2, Leaf].map((Icon, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center gap-3 text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {[
                    t?.trust?.secureData || "Secure Data",
                    t?.trust?.trustedUsers || "Trusted Users",
                    t?.trust?.verifiedResults || "Verified Results",
                    t?.trust?.ecoFriendly || "Eco-Friendly"
                  ][i]}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Leaf className="w-8 h-8 text-accent" />
                <span className="text-2xl font-bold">{t?.appName || "Agri Sense"}</span>
              </Link>
              <p className="text-background/70 text-sm">
                {t?.intro?.desc?.split(".")?.[0] || "Empowering farmers with AI-driven insights for sustainable agriculture"}.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t?.footer?.quickLinks || "Quick Links"}</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li>
                  <Link to="/" className="hover:text-accent transition">{t?.nav?.home || "Home"}</Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-accent transition">{t?.nav?.dashboard || "Dashboard"}</Link>
                </li>
                <li>
                  <Link to="/disease-detection" className="hover:text-accent transition">{t?.nav?.diseaseDetection || "Disease Detection"}</Link>
                </li>
                <li>
                  <Link to="/crop-recommendations" className="hover:text-accent transition">{t?.nav?.cropSuggestions || "Crop Suggestions"}</Link>
                </li>
                <li>
                  <Link to="/suppliers" className="hover:text-accent transition">{t?.nav?.suppliers || "Suppliers"}</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t?.footer?.features || "Features"}</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li>
                  <Link to="/dashboard" className="hover:text-accent transition cursor-pointer">
                    {t?.features?.items?.[0]?.title || "Real-time Monitoring"}
                  </Link>
                </li>
                <li>
                  <Link to="/disease-detection" className="hover:text-accent transition cursor-pointer">
                    {t?.features?.items?.[1]?.title || "Disease Detection"}
                  </Link>
                </li>
                <li>
                  <Link to="/crop-recommendations" className="hover:text-accent transition cursor-pointer">
                    {t?.features?.items?.[2]?.title || "Crop Recommendations"}
                  </Link>
                </li>
                <li>
                  <Link to="/suppliers" className="hover:text-accent transition cursor-pointer">
                    {t?.features?.items?.[3]?.title || "Supplier Network"}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t?.footer?.contact || "Contact"}</h4>
              <div className="space-y-2 text-sm text-background/70">
                <p>{t?.footer?.contactEmail || "support@agrisense.com"}</p>
                <p>{t?.footer?.contactPhone || "+91 1800 123 4567"}</p>
                <div className="flex gap-4 pt-4">
                  {/* Social media icons would go here */}
                </div>
              </div>
            </div>
          </div>
         
        </div>
      </footer>
      <Chatbot/>
    </div>
  );
}
