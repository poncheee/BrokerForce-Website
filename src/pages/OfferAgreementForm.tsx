import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Property } from "@/data/properties";
import { PropertyService } from "@/services/propertyService";
import { offerService, CreateOfferData } from "@/services/offerService";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowLeft,
  ArrowRight,
  Home,
  DollarSign,
  Calendar,
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

type FinancingType = "cash" | "loan" | "apply_for_loan";

interface OfferFormData {
  offerAmount: string;
  closingDate: string;
  contingencies: string;
  financingType: FinancingType;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
}

export default function OfferAgreementForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get financing type from navigation state
  const financingTypeFromState = location.state?.financingType as
    | FinancingType
    | undefined;

  const [formData, setFormData] = useState<OfferFormData>({
    offerAmount: "",
    closingDate: "",
    contingencies: "",
    financingType: financingTypeFromState || "cash",
    agreeToTerms: false,
    agreeToPrivacy: false,
  });

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
          // Pre-fill offer amount with property price (as starting point)
          setFormData((prev) => ({
            ...prev,
            offerAmount: propertyData.price.toString(),
          }));
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
        description: "Please sign in to submit an offer.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Redirect if financing type not selected
  useEffect(() => {
    if (!financingTypeFromState && !loading && !authLoading) {
      toast({
        title: "Financing Selection Required",
        description: "Please select a financing option first.",
        variant: "destructive",
      });
      navigate(`/property/${id}/financing`);
    }
  }, [financingTypeFromState, loading, authLoading, navigate, id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (
    field: keyof OfferFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreeToTerms || !formData.agreeToPrivacy) {
      toast({
        title: "Agreement Required",
        description:
          "Please agree to the terms and privacy policy to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.offerAmount || parseFloat(formData.offerAmount) <= 0) {
      toast({
        title: "Invalid Offer Amount",
        description: "Please enter a valid offer amount.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.closingDate) {
      toast({
        title: "Closing Date Required",
        description: "Please select a desired closing date.",
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
      if (!property || !user) {
        throw new Error("Missing property or user information");
      }

      // Create offer via API
      const offerData: CreateOfferData = {
        propertyId: property.id,
        offerAmount: parseFloat(formData.offerAmount),
        financingType: formData.financingType,
        closingDate: formData.closingDate,
        contingencies: formData.contingencies || undefined,
        // purchaseRequestId will be optional - we can link it later if needed
      };

      const createdOffer = await offerService.createOffer(offerData);

      toast({
        title: "Offer Submitted Successfully",
        description:
          "Your offer has been submitted and is being reviewed. You will be redirected to confirmation.",
      });

      // Navigate to offer confirmation with offer data
      navigate(`/property/${property.id}/offer/confirmation`, {
        state: { offer: createdOffer, offerData },
      });
    } catch (error) {
      console.error("Error submitting offer:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to submit the offer";
      toast({
        title: "Submission Failed",
        description: errorMessage + ". Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate minimum date (today + 30 days)
  const minClosingDate = new Date();
  minClosingDate.setDate(minClosingDate.getDate() + 30);
  const minDateString = minClosingDate.toISOString().split("T")[0];

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
              onClick={() => navigate(`/property/${property.id}/financing`)}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">
              Submit Your Offer
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

        {/* Offer Form */}
        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Offer Agreement</CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Please fill out the offer details below. All information will be
                used to create your formal offer.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Offer Amount */}
              <div className="space-y-2">
                <Label htmlFor="offerAmount" className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Offer Amount *
                </Label>
                <Input
                  id="offerAmount"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.offerAmount}
                  onChange={(e) =>
                    handleInputChange("offerAmount", e.target.value)
                  }
                  placeholder="Enter your offer amount"
                  required
                  className="text-lg"
                />
                <p className="text-xs text-gray-500">
                  Suggested: {formatPrice(property.price)}
                </p>
              </div>

              {/* Closing Date */}
              <div className="space-y-2">
                <Label htmlFor="closingDate" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Desired Closing Date *
                </Label>
                <Input
                  id="closingDate"
                  type="date"
                  min={minDateString}
                  value={formData.closingDate}
                  onChange={(e) =>
                    handleInputChange("closingDate", e.target.value)
                  }
                  required
                />
                <p className="text-xs text-gray-500">
                  Minimum closing date:{" "}
                  {new Date(minDateString).toLocaleDateString()}
                </p>
              </div>

              {/* Financing Type (Display Only) */}
              <div className="space-y-2">
                <Label>Financing Type</Label>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <p className="font-medium capitalize">
                    {formData.financingType === "cash" && "Cash Payment"}
                    {formData.financingType === "loan" && "I Have a Loan"}
                    {formData.financingType === "apply_for_loan" &&
                      "Apply for a Loan"}
                  </p>
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-sm"
                    onClick={() =>
                      navigate(`/property/${property.id}/financing`)
                    }
                  >
                    Change financing option
                  </Button>
                </div>
              </div>

              {/* Contingencies */}
              <div className="space-y-2">
                <Label htmlFor="contingencies">
                  <FileText className="h-4 w-4 mr-1 inline" />
                  Contingencies (Optional)
                </Label>
                <Textarea
                  id="contingencies"
                  value={formData.contingencies}
                  onChange={(e) =>
                    handleInputChange("contingencies", e.target.value)
                  }
                  placeholder="E.g., Inspection contingency, appraisal contingency, financing contingency, etc."
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">
                  Specify any conditions that must be met for the sale to
                  proceed.
                </p>
              </div>

              {/* eSignature Placeholder */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-yellow-800 mb-1">
                      Electronic Signature Required
                    </p>
                    <p className="text-xs text-yellow-700">
                      In production, this form will integrate with DocuSign or
                      HelloSign for secure electronic signature. For now,
                      checking the boxes below will serve as your agreement.
                    </p>
                  </div>
                </div>
              </div>

              {/* Agreement Checkboxes */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) =>
                      handleInputChange("agreeToTerms", checked === true)
                    }
                    className="mt-1"
                  />
                  <Label
                    htmlFor="agreeToTerms"
                    className="text-sm leading-relaxed cursor-pointer"
                  >
                    I agree to the{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      Terms of Service
                    </a>{" "}
                    and understand that this is a legally binding offer to
                    purchase the property.
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreeToPrivacy"
                    checked={formData.agreeToPrivacy}
                    onCheckedChange={(checked) =>
                      handleInputChange("agreeToPrivacy", checked === true)
                    }
                    className="mt-1"
                  />
                  <Label
                    htmlFor="agreeToPrivacy"
                    className="text-sm leading-relaxed cursor-pointer"
                  >
                    I agree to the{" "}
                    <a
                      href="/privacy"
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      Privacy Policy
                    </a>{" "}
                    and consent to the processing of my personal information for
                    this transaction.
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/property/${property.id}/financing`)}
              disabled={isSubmitting}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[150px]"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Offer
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
