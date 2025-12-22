import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Property } from "@/data/properties";
import { PropertyService } from "@/services/propertyService";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Home,
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

type FinancingType = "cash" | "loan" | "apply_for_loan";

export default function FinancingSelection() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFinancing, setSelectedFinancing] = useState<
    FinancingType | ""
  >("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to continue with your purchase.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleContinue = async () => {
    if (!selectedFinancing) {
      toast({
        title: "Selection Required",
        description: "Please select a financing option to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!property || !user) {
      toast({
        title: "Error",
        description: "Missing property or user information.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Store financing selection (will be used in offer form)
      // For now, we'll pass it via navigation state
      // In production, this would be saved to the purchase request

      // Navigate to offer agreement form
      navigate(`/property/${property.id}/offer`, {
        state: { financingType: selectedFinancing },
      });
    } catch (error) {
      console.error("Error proceeding to offer:", error);
      toast({
        title: "Error",
        description: "Failed to proceed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
              <p className="text-gray-600 mb-4">
                {error || "Property not found"}
              </p>
              <Button onClick={() => navigate("/")}>Go to Home</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={() => navigate(`/property/${property.id}/confirmation`)}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">
              Select Financing Option
            </h1>
            <div className="w-20" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Property Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Home className="h-5 w-5 mr-2" />
              Property Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {property.address}
              </h3>
              <p className="text-gray-600">
                {property.city}, {property.state} {property.zipCode}
              </p>
              <p className="text-xl font-bold text-blue-600">
                {formatPrice(property.price)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Financing Options */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>How would you like to finance this purchase?</CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Select your preferred financing method. You can change this later
              if needed.
            </p>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedFinancing}
              onValueChange={(value) =>
                setSelectedFinancing(value as FinancingType)
              }
              className="space-y-4"
            >
              {/* Cash Option */}
              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="cash" id="cash" className="mt-1" />
                <Label htmlFor="cash" className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                      <div>
                        <div className="font-semibold text-gray-900">
                          Cash Payment
                        </div>
                        <div className="text-sm text-gray-600">
                          Paying with cash or funds already available
                        </div>
                      </div>
                    </div>
                    {selectedFinancing === "cash" && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                </Label>
              </div>

              {/* Loan Option */}
              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="loan" id="loan" className="mt-1" />
                <Label htmlFor="loan" className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
                      <div>
                        <div className="font-semibold text-gray-900">
                          I Have a Loan
                        </div>
                        <div className="text-sm text-gray-600">
                          I already have mortgage pre-approval or financing
                          arranged
                        </div>
                      </div>
                    </div>
                    {selectedFinancing === "loan" && (
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                </Label>
              </div>

              {/* Apply for Loan Option */}
              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem
                  value="apply_for_loan"
                  id="apply_for_loan"
                  className="mt-1"
                />
                <Label
                  htmlFor="apply_for_loan"
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-purple-600 mr-2" />
                      <div>
                        <div className="font-semibold text-gray-900">
                          Apply for a Loan
                        </div>
                        <div className="text-sm text-gray-600">
                          I need to apply for mortgage financing (not in MVP
                          scope)
                        </div>
                      </div>
                    </div>
                    {selectedFinancing === "apply_for_loan" && (
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                    )}
                  </div>
                </Label>
              </div>
            </RadioGroup>

            {selectedFinancing === "apply_for_loan" && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">Note:</p>
                    <p>
                      Loan application is not included in the MVP. If you select
                      this option, you will be able to proceed with the offer,
                      but loan application will need to be handled separately.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate(`/property/${property.id}/confirmation`)}
            disabled={isSubmitting}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!selectedFinancing || isSubmitting}
            className="min-w-[150px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Continue to Offer
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
