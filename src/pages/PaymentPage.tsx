import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Property } from "@/data/properties";
import { PropertyService } from "@/services/propertyService";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowLeft,
  CreditCard,
  DollarSign,
  CheckCircle,
  Home,
  MapPin,
  Calendar,
  Video,
  Eye,
  FileText,
  Mail,
  AlertCircle,
  Plus,
  Minus,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ALaCarteOption {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export default function PaymentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fixed fee for representation
  const FIXED_REPRESENTATION_FEE = 299;

  // A la carte options
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const aLaCarteOptions: ALaCarteOption[] = [
    {
      id: "property_walkthrough",
      name: "Property Walkthrough",
      description:
        "Professional property walkthrough with detailed inspection and video documentation",
      price: 199,
      category: "Inspection",
    },
    {
      id: "agent_walkthrough_video",
      name: "Agent Video Walkthrough",
      description:
        "Personal agent walkthrough with live video call and recorded session",
      price: 149,
      category: "Inspection",
    },
    {
      id: "seller_concessions_90_10",
      name: "Seller Concessions (90/10 Split)",
      description:
        "Request 90/10 split of seller concessions (disbursed through escrow upon closing)",
      price: 99,
      category: "Negotiation",
    },
    {
      id: "additional_features",
      name: "Additional Custom Features",
      description: "Custom requests that require manual agent processing",
      price: 0,
      category: "Custom",
    },
  ];

  // Load property data
  useEffect(() => {
    const loadProperty = async () => {
      if (!id) {
        setError("Property ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const propertyData = await PropertyService.getPropertyById(id);

        if (propertyData) {
          setProperty(propertyData);
        } else {
          setError("Property not found");
        }
      } catch (err) {
        console.error("Error loading property:", err);
        setError("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions((prev) => {
      if (prev.includes(optionId)) {
        return prev.filter((id) => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  const calculateTotal = () => {
    const optionTotal = aLaCarteOptions
      .filter((option) => selectedOptions.includes(option.id))
      .reduce((sum, option) => sum + option.price, 0);

    return FIXED_REPRESENTATION_FEE + optionTotal;
  };

  const handlePayment = async () => {
    if (selectedOptions.length === 0) {
      toast({
        title: "Select Services",
        description: "Please select at least one service to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // In a real app, this would integrate with payment processor (Stripe, PayPal, etc.)
      console.log("Payment processing:", {
        propertyId: property?.id,
        userId: user?.id,
        fixedFee: FIXED_REPRESENTATION_FEE,
        selectedOptions,
        total: calculateTotal(),
      });

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      toast({
        title: "Payment Successful",
        description:
          "Your payment has been processed successfully. Redirecting to confirmation...",
      });

      // Redirect to confirmation page
      navigate(`/property/${property?.id}/confirmation`);
    } catch (error) {
      toast({
        title: "Payment Failed",
        description:
          "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment options...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={64} className="mx-auto text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Property Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The property you are looking for does not exist."}
          </p>
          <Button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() =>
                  navigate(`/property/${property.id}/representation`)
                }
                className="mr-2"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Form
              </Button>
              <div className="flex items-center">
                <CreditCard className="h-6 w-6 text-blue-600 mr-2" />
                <span className="text-xl font-bold text-gray-900">
                  Payment & Services
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home size={20} className="mr-2 text-blue-600" />
                  Property Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {property.address}
                    </h3>
                    <div className="flex items-center mt-1">
                      <MapPin size={16} className="mr-1 text-gray-400" />
                      <span className="text-gray-600">
                        {property.city}, {property.state} {property.zipCode}
                      </span>
                    </div>
                    <div className="flex items-center mt-2">
                      <span className="text-sm text-gray-600">
                        {property.beds} beds • {property.baths} baths •{" "}
                        {property.sqft.toLocaleString()} sqft
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {formatPrice(property.price)}
                    </div>
                    <p className="text-sm text-gray-600 capitalize">
                      {property.type}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fixed Fee */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle size={20} className="mr-2 text-green-600" />
                  Representation Fee (Required)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Buyer Representation Service
                    </h4>
                    <p className="text-sm text-gray-600">
                      Complete buyer representation including contract review,
                      negotiation support, and closing assistance
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">
                      {formatPrice(FIXED_REPRESENTATION_FEE)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* A La Carte Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus size={20} className="mr-2 text-blue-600" />
                  Additional Services (Optional)
                </CardTitle>
                <p className="text-gray-600">
                  Select any additional services you'd like to include with your
                  purchase
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aLaCarteOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        selectedOptions.includes(option.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleOptionToggle(option.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={selectedOptions.includes(option.id)}
                            onChange={() => handleOptionToggle(option.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              {option.id === "property_walkthrough" && (
                                <Eye size={16} className="text-blue-600" />
                              )}
                              {option.id === "agent_walkthrough_video" && (
                                <Video size={16} className="text-blue-600" />
                              )}
                              {option.id === "seller_concessions_90_10" && (
                                <FileText size={16} className="text-blue-600" />
                              )}
                              {option.id === "additional_features" && (
                                <Mail size={16} className="text-blue-600" />
                              )}
                              <h4 className="font-semibold text-gray-900">
                                {option.name}
                              </h4>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {option.category}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {option.description}
                            </p>
                            {option.id === "seller_concessions_90_10" && (
                              <p className="text-xs text-gray-500 mt-2 italic">
                                *Any agreed-upon concession split will be
                                disbursed through escrow only upon full closing
                                and confirmation of funding, subject to all
                                terms being satisfied and title transfer being
                                complete.
                              </p>
                            )}
                            {option.id === "additional_features" && (
                              <p className="text-xs text-gray-500 mt-2 italic">
                                *Custom requests will be forwarded to our agents
                                for manual processing. You will be contacted
                                within 24 hours to discuss your specific needs.
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-lg font-bold text-gray-900">
                            {option.price === 0
                              ? "Quote"
                              : formatPrice(option.price)}
                          </div>
                          {option.price === 0 && (
                            <p className="text-xs text-gray-500">
                              Upon request
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign size={20} className="mr-2 text-green-600" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Representation Fee</span>
                    <span className="font-semibold">
                      {formatPrice(FIXED_REPRESENTATION_FEE)}
                    </span>
                  </div>

                  {selectedOptions.map((optionId) => {
                    const option = aLaCarteOptions.find(
                      (opt) => opt.id === optionId
                    );
                    if (!option) return null;

                    return (
                      <div
                        key={optionId}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-gray-600">{option.name}</span>
                        <span className="font-semibold">
                          {option.price === 0
                            ? "Quote"
                            : formatPrice(option.price)}
                        </span>
                      </div>
                    );
                  })}

                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-green-600">
                        {formatPrice(calculateTotal())}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={isProcessing || selectedOptions.length === 0}
                  className="w-full bg-green-600 hover:bg-green-700 text-lg font-semibold py-3 mt-6"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} className="mr-2" />
                      Pay {formatPrice(calculateTotal())}
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  Secure payment processing powered by industry-standard
                  encryption
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
