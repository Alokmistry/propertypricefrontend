import { API_BASE_URL } from "@/lib/config";
import { useState } from "react";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";

import { 
  Building2, 
  MapPin, 
  Home, 
  IndianRupee, 
  RotateCcw,
  Sparkles,
  TrendingUp,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet-async";


interface PredictionResult {
  price: number;
  confidence: string;
}

const CITY_AREA_MAP: Record<string, string[]> = {
  Agartala: ["Banamalipur"],

  

  Gurgaon: ["Gurgaon Sector"],

  Hyderabad: [
    "Shaheen Nagar",
    "Venkatapuram-Balapuram",
    "Vijay Nagar",
  ],

  Kalyan: [
    "Dombivli East",
    "Kalyan East",
    "Kalyan West",
    "Tisgaon Naka",
  ],

  Mumbai: [
  "Andheri East",
  "Andheri West",
  "Bandra East",
  "Bandra West",
  "Oshiwara",
  "Jogeshwari East",
  "Jogeshwari West",
  "Dadar East",
  "Dadar West",
  "Chembur East",
  "Chembur West",
  "Goregaon East",
  "Goregaon West",
  "Kandivali West",
  "Kandivali East",
  "Borivali West",
  "Borivali East",
],


  Nagpur: [
    "Nagpur City",
    "Somalwada",
    "Sadar",
    "pratap Nagar",
    "Hingna",
  ],

  Palghar: [
    "Virar East",
    "Virar West",
    "Vasai East",
    "Vasai West",
  ],

  Thane: [
    "Balkum Naka",
    "Brahmand",
    "Hiranandani Estate",
    "Majiwada",
    "Vartak Nagar",
    "Thane West",
    "Bhiwandi"
  ],
};

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);

useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    if (!data.session) {
      navigate("/signin");
    }
  });
}, [navigate]);

  // Form state
  const [formData, setFormData] = useState({
    carpetArea: "",
    coveredArea: "",
    pricePerSqFt: "",
    bedrooms: "",
    bathrooms: "",
    balconies: "",
    floorNumber: "",
    totalFloors: "",
    propertyType: "",
    isCommercial: false,
    isLuxury: false,
    city: "",
    areaName: "",
    isPrimeLocation: false,
    furnishingType: "",
    hasParking: false,
    isReraApproved: false,
  });


  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFormData({
      carpetArea: "",
      coveredArea: "",
      pricePerSqFt: "",
      bedrooms: "",
      bathrooms: "",
      balconies: "",
      floorNumber: "",
      totalFloors: "",
      propertyType: "",
      isCommercial: false,
      isLuxury: false,
      city: "",
      areaName: "",
      isPrimeLocation: false,
      furnishingType: "",
      hasParking: false,
      isReraApproved: false,
    });
    setPrediction(null);
  };

  const handleLogout = async () => {
  await supabase.auth.signOut();
  navigate("/signin");
};


  const handlePredict = async () => {
    // Validation
    if (!formData.carpetArea || !formData.bedrooms || !formData.city || !formData.propertyType || !formData.areaName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);



    try {

      // Prepare request body exactly as specified
      const requestBody = {
       latitude: 19.1197,
       longitude: 72.8468,

       area_sqft:
         Number(formData.coveredArea) ||
         Number(formData.carpetArea) ||
         0,

       sqft_price: Number(formData.pricePerSqFt),

       bedrooms: Number(formData.bedrooms),
       bathrooms: Number(formData.bathrooms) || 1,
       balconies: Number(formData.balconies) || 0,

       floor_no: Number(formData.floorNumber) || 1,
       floors: Number(formData.totalFloors) || 1,

       type_of_property: formData.propertyType,
       commercial: Boolean(formData.isCommercial),
       luxury_flat: Boolean(formData.isLuxury),

       city: formData.city,
       area_name: formData.areaName,

       isprimelocationproperty: Boolean(formData.isPrimeLocation),
       furnished_type: formData.furnishingType || "Unfurnished",

       parking: Boolean(formData.hasParking),
       rera: Boolean(formData.isReraApproved),
  };




      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        toast({
          title: "Session Expired",
          description: "Session expired. Please login again.",
          variant: "destructive",
        });
        navigate("/signin");
        setIsLoading(false);
        return;
      }

      if (response.status === 400 || response.status === 500) {
        toast({
          title: "Prediction Failed",
          description: "Unable to predict price. Please check inputs or try again later.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Unexpected error occurred");
      }

      const data = await response.json();
      
      setPrediction({
        price: data.predicted_price,
        confidence: "High",
      });

      const { 
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
         await supabase.from("predictions").insert({
         user_id:user.id,
         input: formData,
         predicted_price: data.predicted_price,
         });
      }
      
      toast({
        title: "Prediction Complete",
        description: "Your property valuation is ready!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to predict price. Please check inputs or try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹ ${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹ ${(price / 100000).toFixed(2)} L`;
    }
    return `₹ ${price.toLocaleString("en-IN")}`;
  };

  return (
    <>
      <Helmet>
        <title>Predict Property Price | PropValueAI</title>
        <meta
          name="description"
          content="Get instant AI-powered property price predictions. Enter your property details and receive accurate valuations based on real market data."
        />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-body text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                AI-Powered Valuation
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Property Price Prediction
              </h1>
              <p className="font-body text-lg text-muted-foreground">
                Enter your property details below to get an instant AI-powered valuation
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <Card className="border-border shadow-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="w-5 h-5 text-accent" />
                      Property Details
                    </CardTitle>
                    <CardDescription>
                      Fill in the property specifications for accurate prediction
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {/* Property Dimensions */}
                    <div className="space-y-4">
                      <h3 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-accent" />
                        Property Dimensions
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label className="font-body">Carpet Area (sq ft) *</Label>
                          <Input
                            type="number"
                            placeholder="e.g., 1200"
                            value={formData.carpetArea}
                            onChange={(e) => handleInputChange("carpetArea", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="font-body">Covered Area (sq ft)</Label>
                          <Input
                            type="number"
                            placeholder="e.g., 1400"
                            value={formData.coveredArea}
                            onChange={(e) => handleInputChange("coveredArea", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="font-body">Price per Sq Ft</Label>
                          <Input
                            type="number"
                            placeholder="e.g., 8500"
                            value={formData.pricePerSqFt}
                            onChange={(e) => handleInputChange("pricePerSqFt", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="font-body">Bedrooms (BHK) *</Label>
                          <Select
                            value={formData.bedrooms}
                            onValueChange={(value) => handleInputChange("bedrooms", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} BHK
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label className="font-body">Bathrooms</Label>
                          <Select
                            value={formData.bathrooms}
                            onValueChange={(value) => handleInputChange("bathrooms", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="font-body">Balconies</Label>
                          <Select
                            value={formData.balconies}
                            onValueChange={(value) => handleInputChange("balconies", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {[0, 1, 2, 3, 4].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="font-body">Floor Number</Label>
                          <Input
                            type="number"
                            placeholder="e.g., 5"
                            value={formData.floorNumber}
                            onChange={(e) => handleInputChange("floorNumber", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="font-body">Total Floors</Label>
                          <Input
                            type="number"
                            placeholder="e.g., 15"
                            value={formData.totalFloors}
                            onChange={(e) => handleInputChange("totalFloors", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Property Type */}
                    <div className="space-y-4">
                      <h3 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
                        <Home className="w-5 h-5 text-accent" />
                        Property Type
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="font-body">Type of Property *</Label>
                          <Select
                            value={formData.propertyType}
                            onValueChange={(value) => handleInputChange("propertyType", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Apartment">Apartment</SelectItem>
                              <SelectItem value="Villa">Villa</SelectItem>
                              <SelectItem value="Independent-house">Independent House</SelectItem>
                              <SelectItem value="Commercial">Commercial</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/30">
                          <Label className="font-body">Commercial Property</Label>
                          <Switch
                            checked={formData.isCommercial}
                            onCheckedChange={(checked) => handleInputChange("isCommercial", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/30">
                          <Label className="font-body">Luxury Property</Label>
                          <Switch
                            checked={formData.isLuxury}
                            onCheckedChange={(checked) => handleInputChange("isLuxury", checked)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Location Details */}
                    <div className="space-y-4">
                      <h3 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-accent" />
                        Location Details
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="font-body">City *</Label>
                          <Select
                            value={formData.city}
                            onValueChange={(value) => setFormData({ ...formData, city: value, areaName: ""})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select city" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(CITY_AREA_MAP).map((city) => (
                                <SelectItem key={city} value={city}>
                                  {city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="font-body">Area Name</Label>
                          <Select
                            value={formData.areaName}
                            onValueChange={(value) => handleInputChange("areaName", value)}
                            disabled={!formData.city}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select area" />
                            </SelectTrigger>
                            <SelectContent>     
                              {formData.city &&
                                CITY_AREA_MAP[formData.city]?.map((area,index) => (
                                <SelectItem key={`${area}-${index}`} value={area}>
                                  {area}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/30">
                          <Label className="font-body">Prime Location</Label>
                          <Switch
                            checked={formData.isPrimeLocation}
                            onCheckedChange={(checked) => handleInputChange("isPrimeLocation", checked)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="space-y-4">
                      <h3 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
                        <Info className="w-5 h-5 text-accent" />
                        Additional Details
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="font-body">Furnishing Type</Label>
                          <Select
                            value={formData.furnishingType}
                            onValueChange={(value) => setFormData({  ...formData, furnishingType: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unfurnished">Unfurnished</SelectItem>
                              <SelectItem value="semi-furnished">Semi-Furnished</SelectItem>
                              <SelectItem value="fully-furnished">Fully Furnished</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/30">
                          <Label className="font-body">Parking Available</Label>
                          <Switch
                            checked={formData.hasParking}
                            onCheckedChange={(checked) => handleInputChange("hasParking", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/30">
                          <Label className="font-body">RERA Approved</Label>
                          <Switch
                            checked={formData.isReraApproved}
                            onCheckedChange={(checked) => handleInputChange("isReraApproved", checked)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Button
                        variant="gold"
                        size="xl"
                        className="flex-1"
                        onClick={handlePredict}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                            Predicting...
                          </>
                        ) : (
                          <>
                            <TrendingUp className="w-5 h-5" />
                            Predict Price
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="xl"
                        onClick={handleReset}
                        className="sm:w-auto"
                      >
                        <RotateCcw className="w-5 h-5" />
                        Reset Form
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Result Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lg:col-span-1"
              >
                <div className="sticky top-28 space-y-6">
                  {/* Prediction Result Card */}
                  <AnimatePresence mode="wait">
                    {prediction ? (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                      >
                        <Card className="border-accent/30 shadow-gold overflow-hidden">
                          <div className="bg-gradient-to-r from-accent to-gold-dark p-6">
                            <div className="flex items-center gap-2 text-accent-foreground/80 mb-2">
                              <Sparkles className="w-5 h-5" />
                              <span className="font-body text-sm font-medium">AI Prediction</span>
                            </div>
                            <h3 className="font-heading text-lg text-accent-foreground mb-1">
                              Estimated Property Value
                            </h3>
                          </div>
                          <CardContent className="p-6">
                            <div className="text-center py-4">
                              <div className="font-heading text-4xl font-bold text-foreground mb-2">
                                {formatPrice(prediction.price)}
                              </div>
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-body">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                {prediction.confidence} Confidence
                              </div>
                            </div>
                            <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border">
                              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                                <strong>Note:</strong> This price is an AI-generated estimate based on market trends and the property details you provided. Actual prices may vary.
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Card className="border-dashed border-2 border-border bg-secondary/20">
                          <CardContent className="p-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                              <IndianRupee className="w-8 h-8 text-accent" />
                            </div>
                            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                              Your Prediction
                            </h3>
                            <p className="font-body text-sm text-muted-foreground">
                              Fill in the property details and click "Predict Price" to see the estimated value
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Info Card */}
                  <Card className="border-border bg-primary/5">
                    <CardContent className="p-6">
                      <h4 className="font-heading font-semibold text-foreground mb-3">
                        How it works
                      </h4>
                      <ul className="space-y-3 font-body text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                          Enter accurate property details
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                          Our ML model analyzes 50+ features
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                          Get instant, accurate predictions
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Dashboard;  
