import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Property } from "@/data/properties";
import { PropertyService } from "@/services/propertyService";
import { Offer, offerService } from "@/services/offerService";
import { useAuth } from "@/hooks/useAuth";
import {
  CheckCircle,
  Home,
  DollarSign,
  Calendar,
  FileText,
  ArrowRight,
  Loader2,
  AlertCircle,
  TrendingUp,
  Clock,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function OfferConfirmation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get offer from navigation state or load from API
  const offerFromState = location.state?.offer as Offer | undefined;

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setError("Property ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Load property
        const propertyData = await PropertyService.getPropertyById(id);
        if (!propertyData) {
          setError("Property not found");
          setLoading(false);
          return;
        }
        setProperty(propertyData);

        // Use offer from state or try to load most recent offer
        if (offerFromState) {
          setOffer(offerFromState);
        } else {
          // If no offer in state, try to get the most recent offer for this property
          // This handles page refresh scenarios
          try {
            const offers = await offerService.getOffers();
            const propertyOffer = offers
              .filter((o) => o.property_id === id)
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )[0];

            if (propertyOffer) {
              setOffer(propertyOffer);
            }
          } catch (err) {
            console.error("Error loading offer:", err);
            // Not critical, we'll just show a generic confirmation
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load confirmation data");
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadData();
    }
  }, [id, offerFromState, authLoading]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: Offer["status"]) => {
    const statusConfig = {
      submitted: {
        label: "Submitted",
        variant: "default" as const,
        color: "bg-blue-100 text-blue-800",
      },
      accepted: {
        label: "Accepted",
        variant: "default" as const,
        color: "bg-green-100 text-green-800",
      },
      rejected: {
        label: "Rejected",
        variant: "destructive" as const,
        color: "bg-red-100 text-red-800",
      },
      withdrawn: {
        label: "Withdrawn",
        variant: "secondary" as const,
        color: "bg-gray-100 text-gray-800",
      },
      draft: {
        label: "Draft",
        variant: "secondary" as const,
        color: "bg-gray-100 text-gray-800",
      },
    };

    const config = statusConfig[status] || statusConfig.submitted;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading confirmation...</p>
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
              onClick={() => navigate("/dashboard")}
              className="flex items-center"
            >
              <ArrowRight className="h-4 w-4 rotate-180 mr-2" />
              Dashboard
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">
              Offer Confirmation
            </h1>
            <div className="w-20" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <Card className="mb-6 bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-12 w-12 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Offer Submitted Successfully!
                </h2>
                <p className="text-gray-700">
                  Your offer has been received and is now being reviewed by the
                  listing agent. You will be notified once there's an update on
                  your offer status.
                </p>
                {offer && (
                  <div className="mt-4">{getStatusBadge(offer.status)}</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

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

        {/* Offer Details */}
        {offer && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Your Offer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">Offer Amount</Label>
                  <p className="text-2xl font-bold text-green-600">
                    {formatPrice(offer.offer_amount)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">
                    Financing Type
                  </Label>
                  <p className="text-lg font-semibold text-gray-900 capitalize">
                    {offer.financing_type || "Not specified"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Offer Status</Label>
                  <div className="mt-1">{getStatusBadge(offer.status)}</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">
                    Submitted Date
                  </Label>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(offer.created_at)}
                  </p>
                </div>
              </div>

              {offer.agent_response && (
                <div className="pt-4 border-t">
                  <Label className="text-sm text-gray-500">
                    Agent Response
                  </Label>
                  <p className="text-gray-700 mt-1">{offer.agent_response}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              What Happens Next?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Offer Review</h4>
                  <p className="text-gray-600">
                    The listing agent will review your offer, typically within
                    24-48 hours.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Status Update</h4>
                  <p className="text-gray-600">
                    You'll receive a notification when the agent responds to
                    your offer (accepted, rejected, or counter-offer).
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Next Steps</h4>
                  <p className="text-gray-600">
                    If your offer is accepted, your assigned buyer's agent will
                    guide you through the closing process.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {offer && (
            <Button
              onClick={() => navigate(`/dashboard/offers/${offer.id}`)}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              View Offer Details
            </Button>
          )}
          <Button
            onClick={() => navigate("/dashboard")}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            <FileText className="h-4 w-4 mr-2" />
            View Dashboard
          </Button>
          <Button
            onClick={() => navigate(`/property/${property.id}`)}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            <Home className="h-4 w-4 mr-2" />
            View Property
          </Button>
        </div>
      </main>
    </div>
  );
}
