import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { offerService, Offer } from "@/services/offerService";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Calendar,
  Filter,
  Loader2,
  AlertCircle,
  FileText,
  Home,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

type OfferStatus =
  | "all"
  | "submitted"
  | "accepted"
  | "rejected"
  | "withdrawn"
  | "draft";

export default function DashboardOffers() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<OfferStatus>("all");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    const loadOffers = async () => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        setError(null);
        const offersData = await offerService.getOffers();
        setOffers(offersData);
      } catch (err) {
        console.error("Error loading offers:", err);
        setError("Failed to load offers");
        toast({
          title: "Error",
          description: "Failed to load your offers. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadOffers();
    }
  }, [isAuthenticated]);

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
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: Offer["status"]) => {
    const statusConfig = {
      submitted: {
        label: "Submitted",
        color: "bg-blue-100 text-blue-800 border-blue-200",
      },
      accepted: {
        label: "Accepted",
        color: "bg-green-100 text-green-800 border-green-200",
      },
      rejected: {
        label: "Rejected",
        color: "bg-red-100 text-red-800 border-red-200",
      },
      withdrawn: {
        label: "Withdrawn",
        color: "bg-gray-100 text-gray-800 border-gray-200",
      },
      draft: {
        label: "Draft",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
    };

    const config = statusConfig[status] || statusConfig.submitted;
    return <Badge className={`${config.color} border`}>{config.label}</Badge>;
  };

  const filteredOffers = offers.filter((offer) => {
    if (statusFilter === "all") return true;
    return offer.status === statusFilter;
  });

  const statusCounts = {
    all: offers.length,
    submitted: offers.filter((o) => o.status === "submitted").length,
    accepted: offers.filter((o) => o.status === "accepted").length,
    rejected: offers.filter((o) => o.status === "rejected").length,
    withdrawn: offers.filter((o) => o.status === "withdrawn").length,
    draft: offers.filter((o) => o.status === "draft").length,
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your offers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => navigate("/dashboard")}>
                Back to Dashboard
              </Button>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 text-blue-600 mr-2" />
                <h1 className="text-xl font-bold text-gray-900">My Offers</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              All ({statusCounts.all})
            </Button>
            <Button
              variant={statusFilter === "submitted" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("submitted")}
            >
              Submitted ({statusCounts.submitted})
            </Button>
            <Button
              variant={statusFilter === "accepted" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("accepted")}
            >
              Accepted ({statusCounts.accepted})
            </Button>
            <Button
              variant={statusFilter === "rejected" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("rejected")}
            >
              Rejected ({statusCounts.rejected})
            </Button>
            <Button
              variant={statusFilter === "withdrawn" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("withdrawn")}
            >
              Withdrawn ({statusCounts.withdrawn})
            </Button>
            <Button
              variant={statusFilter === "draft" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("draft")}
            >
              Draft ({statusCounts.draft})
            </Button>
          </div>
        </div>

        {/* Offers List */}
        {filteredOffers.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Offers Found
                </h3>
                <p className="text-gray-600 mb-6">
                  {statusFilter === "all"
                    ? "You haven't submitted any offers yet. Start by browsing properties and submitting an offer."
                    : `You don't have any ${statusFilter} offers.`}
                </p>
                <Button onClick={() => navigate("/")}>Browse Properties</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOffers.map((offer) => (
              <Card
                key={offer.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/dashboard/offers/${offer.id}`)}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Home className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-900">
                              Property ID: {offer.property_id}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              <span className="text-lg font-bold text-green-600">
                                {formatPrice(offer.offer_amount)}
                              </span>
                            </div>
                            {offer.financing_type && (
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-1" />
                                <span className="capitalize">
                                  {offer.financing_type.replace("_", " ")}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{formatDate(offer.created_at)}</span>
                            </div>
                          </div>
                        </div>
                        <div>{getStatusBadge(offer.status)}</div>
                      </div>

                      {offer.agent_response && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm font-semibold text-blue-900 mb-1">
                            Agent Response:
                          </p>
                          <p className="text-sm text-blue-800">
                            {offer.agent_response}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/offers/${offer.id}`);
                        }}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/property/${offer.property_id}`);
                        }}
                      >
                        View Property
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
