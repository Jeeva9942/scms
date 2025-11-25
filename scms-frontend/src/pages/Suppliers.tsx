import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Star, Package, Sprout, Truck, Search, Loader2, Navigation } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Chatbot from "@/components/ui/chatbot";

// Haversine Distance
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Icons
const getTypeIcon = (type: string) => {
  switch (type) {
    case "Seeds": return <Sprout className="h-5 w-5" />;
    case "Fertilizers": return <Package className="h-5 w-5" />;
    case "Equipment": return <Truck className="h-5 w-5" />;
    default: return <Package className="h-5 w-5" />;
  }
};

// Colors
const getTypeColor = (type: string) => {
  switch (type) {
    case "Seeds": return "bg-growth/10 text-growth border-growth";
    case "Fertilizers": return "bg-harvest/10 text-harvest border-harvest";
    case "Equipment": return "bg-primary/10 text-primary border-primary";
    default: return "bg-muted";
  }
};

const Suppliers = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [locationData, setLocationData] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Set to true initially to show loading
  const [supplierData, setSupplierData] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(true); // Set to true since we're showing data automatically

  // -------------------------------------------------------------
  // ⭐ FULLY FAKE PINCODE LOOKUP (ONLY 642002 WORKS)
  // -------------------------------------------------------------
  // Modified to automatically load data for 642002
  useEffect(() => {
    const loadSuppliersFor642002 = async () => {
      setLoading(true);
      
      const fakeLocation = {
        city: "Pollachi",
        district: "Coimbatore",
        state: "Tamil Nadu",
        lat: 10.6583,
        lng: 77.0082
      };

      setLocationData(fakeLocation);

      await updateSupplierLocations(
        fakeLocation.lat,
        fakeLocation.lng,
        fakeLocation.city,
        fakeLocation.state,
        "642002"
      );
    };

    loadSuppliersFor642002();
  }, []);

  // -------------------------------------------------------------
  // ⭐ FULLY FAKE SUPPLIERS FOR 642002
  // -------------------------------------------------------------
  const generateLocationSpecificSuppliers = async (
    userLat: number,
    userLng: number,
    city: string,
    state: string,
    pin: string
  ) => {
    const fakeSuppliers = [
      {
        name: "Pollachi Agro Center",
        type: "Seeds",
        address: "Near Market Road, Pollachi - 642002",
        phone: "+91 98941 12345",
        products: ["Coconut Seeds", "Banana Seeds", "Vegetable Seeds"],
        lat: 10.658,
        lng: 77.009
      },
      {
        name: "GreenLeaf Fertilizers",
        type: "Fertilizers",
        address: "Meenakshi Road, Pollachi - 642002",
        phone: "+91 80123 98765",
        products: ["NPK", "Urea", "Organic Compost"],
        lat: 10.659,
        lng: 77.006
      },
      {
        name: "AgriTech Equipments Pollachi",
        type: "Equipment",
        address: "Mahalingapuram, Pollachi - 642002",
        phone: "+91 97876 54321",
        products: ["Sprayers", "Irrigation Pumps", "Hand Tools"],
        lat: 10.656,
        lng: 77.012
      },
      {
        name: "Kumar Agro Service",
        type: "Seeds",
        address: "Town Bus Stand Area, Pollachi - 642002",
        phone: "+91 82209 33445",
        products: ["Hybrid Seeds", "Paddy Seeds", "Pulses"],
        lat: 10.661,
        lng: 77.015
      },
      {
        name: "Sri Amman Fertilizers",
        type: "Fertilizers",
        address: "Sundarapuram Road, Pollachi - 642002",
        phone: "+91 90927 77881",
        products: ["Bio Fertilizers", "Soil Conditioners", "Organic Mix"],
        lat: 10.662,
        lng: 77.004
      },
      {
        name: "FarmPro Tools",
        type: "Equipment",
        address: "Near Railway Gate, Pollachi - 642002",
        phone: "+91 96006 22288",
        products: ["Coconut Climbers", "Harvest Tools", "Trimmer Machines"],
        lat: 10.654,
        lng: 77.011
      }
    ];

    const processed = fakeSuppliers.map((s: any) => {
      const dist = calculateDistance(userLat, userLng, s.lat, s.lng);
      const d = Math.round(dist * 10) / 10;

      return {
        ...s,
        rating: 4.4 + Math.random() * 0.3,
        verified: true,
        email: `contact@${s.name.toLowerCase().replace(/\s+/g, "")}.com`,
        priceInfo:
          s.type === "Seeds" ? "Starting from ₹500/kg" :
          s.type === "Fertilizers" ? "Starting from ₹800/bag" :
          "Contact for pricing",
        priceRange:
          s.type === "Seeds" ? "₹₹" :
          s.type === "Fertilizers" ? "₹₹₹" :
          "₹₹₹₹",
        openingHours: "Mon–Sat: 9 AM – 7 PM",
        location: `${city}, ${d} km away`,
        distance: d
      };
    });

    processed.sort((a, b) => a.distance - b.distance);
    setSupplierData(processed);
    setLoading(false);
  };

  // -------------------------------------------------------------
  // Update supplier data based on pincode (ONLY 642002 WORKS)
  // -------------------------------------------------------------
  const updateSupplierLocations = async (lat: number, lng: number, city: string, state: string, pin: string) => {
    if (pin === "642002") {
      await generateLocationSpecificSuppliers(lat, lng, city, state, pin);
    } else {
      setSupplierData([]);
      setLoading(false);
    }
  };

  const openGoogleMaps = (lat: number, lng: number, name: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(name)}`;
    window.open(url, "_blank");
  };

  const handlePhoneCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const filteredSuppliers = supplierData.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.products.some((p: string) => p.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = !selectedType || s.type === selectedType;
    return matchesSearch && matchesType;
  });

  // --------------------------------------------------------------------------
  // RETURN + UI (MODIFIED)
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-hero pt-24">
      <div className="container py-8">

        <div className="mb-8">
          <h1 className="text-4xl font-bold">{t.reliableSuppliers}</h1>
          <p className="text-lg text-muted-foreground">{t.reliableSuppliersDesc}</p>
        </div>

        {/* PINCODE INFO - Now just displays fixed info */}
        <Card className="shadow-medium mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="text-sm font-medium mb-2 block">Suppliers in Pollachi (642002)</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <div className="pl-10 pr-4 py-2 bg-muted rounded-md">
                      642002 - Pollachi, Tamil Nadu
                    </div>
                  </div>
                  <Button disabled>
                    <Search className="h-4 w-4 mr-2" />Fixed Location
                  </Button>
                </div>

                {locationData && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>Showing suppliers near <b>{locationData.city}</b>, {locationData.state}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEARCH + FILTERS */}
        <Card className="shadow-medium mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Input placeholder={t.searchSuppliers} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1" />

              <div className="flex gap-2">
                <Button variant={selectedType === null ? "default" : "outline"} onClick={() => setSelectedType(null)}>
                  {t.all}
                </Button>
                <Button variant={selectedType === "Seeds" ? "default" : "outline"} onClick={() => setSelectedType("Seeds")}>
                  <Sprout className="h-4 w-4 mr-2" />{t.seeds}
                </Button>
                <Button variant={selectedType === "Fertilizers" ? "default" : "outline"} onClick={() => setSelectedType("Fertilizers")}>
                  <Package className="h-4 w-4 mr-2" />{t.fertilizers}
                </Button>
                <Button variant={selectedType === "Equipment" ? "default" : "outline"} onClick={() => setSelectedType("Equipment")}>
                  <Truck className="h-4 w-4 mr-2" />{t.equipment}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* LOADING */}
        {loading && (
          <Card className="shadow-soft mb-6">
            <CardContent className="text-center py-12">
              <Loader2 className="h-16 w-16 mx-auto mb-4 animate-spin text-primary" />
              <p className="text-lg font-medium mb-2">Loading suppliers...</p>
              <p className="text-muted-foreground">Finding agricultural suppliers in Pollachi</p>
            </CardContent>
          </Card>
        )}

        {/* SUPPLIER GRID */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.map((supplier, index) => (
              <Card key={index} className="shadow-soft hover:shadow-medium transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${getTypeColor(supplier.type)}`}>
                        {getTypeIcon(supplier.type)}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{supplier.name}</CardTitle>
                        {supplier.verified && (
                          <Badge variant="outline" className="mt-1 border-growth text-growth">
                            ✓ {t.verified}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-harvest fill-harvest" />
                    <span className="font-semibold">{supplier.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground ml-1">{t.rating}</span>
                  </CardDescription>
                  <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{supplier.location}</span>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">

                    {/* Address */}
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold">Address</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{supplier.address}</p>
                    </div>

                    {/* Products */}
                    <div>
                      <p className="text-sm font-semibold mb-2">{t.availableProducts}</p>
                      <div className="flex flex-wrap gap-2">
                        {supplier.products.map((p: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {p}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">{t.price}:</span>
                        <span className="text-sm font-bold text-primary">{supplier.priceInfo}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Price Range:</span>
                        <Badge className={getTypeColor(supplier.type)}>{supplier.priceRange}</Badge>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="border-t pt-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary" />
                        <a
                          href={`tel:${supplier.phone}`}
                          className="text-sm text-primary hover:underline font-medium"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePhoneCall(supplier.phone);
                          }}
                        >
                          {supplier.phone}
                        </a>
                      </div>
                      <div className="text-xs text-muted-foreground">{supplier.openingHours}</div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t">
                      <Button className="flex-1 bg-gradient-primary" onClick={() => handlePhoneCall(supplier.phone)}>
                        <Phone className="h-4 w-4 mr-2" />{t.contact}
                      </Button>
                      <Button variant="outline" className="flex-1"
                        onClick={() => openGoogleMaps(supplier.lat, supplier.lng, supplier.name)}
                      >
                        <Navigation className="h-4 w-4 mr-2" />Get Directions
                      </Button>
                    </div>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {hasSearched && filteredSuppliers.length === 0 && (
          <Card className="shadow-soft">
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg font-medium mb-2">{t.noSuppliersFound}</p>
              <p className="text-muted-foreground">{t.adjustSearch}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Chatbot />
    </div>
  );
};

export default Suppliers;