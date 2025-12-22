import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Property } from "@/data/properties";
import { PropertyService } from "@/services/propertyService";
import { useAuth } from "@/hooks/useAuth";
import {
  CheckCircle,
  Home,
  MapPin,
  Calendar,
  Mail,
  Phone,
  FileText,
  Download,
  ArrowRight,
  User,
  CreditCard,
  Clock,
  AlertCircle,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function PaymentConfirmation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock transaction data (in real app, this would come from payment processor)
  const transactionData = {
    transactionId: "TXN-" + Date.now(),
    paymentDate: new Date().toLocaleDateString(),
    paymentTime: new Date().toLocaleTimeString(),
    totalAmount: 448, // $299 + $149 (example with video walkthrough)
    paymentMethod: "Credit Card ending in 4242",
    status: "completed",
  };

  const selectedServices = [
    { name: "Buyer Representation Service", price: 299, included: true },
    { name: "Agent Video Walkthrough", price: 149, included: true },
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

  const handleDownloadReceipt = () => {
    // In a real app, this would generate and download a PDF receipt
    toast({
      title: "Receipt Downloaded",
      description: "Your payment receipt has been downloaded successfully.",
    });
  };

  const handleContactAgent = () => {
    // In a real app, this would open contact form or initiate call
    toast({
      title: "Contacting Agent",
      description:
        "You will be contacted by your assigned agent within 24 hours.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading confirmation...</p>
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
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              <span className="text-2xl font-bold text-gray-900">
                Payment Confirmed
              </span>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle size={16} className="mr-1" />
              Completed
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600">
            Your representation agreement has been processed and your agent will
            contact you soon.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home size={20} className="mr-2 text-blue-600" />
                Property Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Property Type</p>
                    <p className="font-semibold capitalize">{property.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Square Feet</p>
                    <p className="font-semibold">
                      {property.sqft.toLocaleString()} sqft
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bedrooms</p>
                    <p className="font-semibold">{property.beds}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bathrooms</p>
                    <p className="font-semibold">{property.baths}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500">List Price</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatPrice(property.price)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard size={20} className="mr-2 text-blue-600" />
                Transaction Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Transaction ID</p>
                    <p className="font-mono text-sm">
                      {transactionData.transactionId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Date</p>
                    <p className="font-semibold">
                      {transactionData.paymentDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Time</p>
                    <p className="font-semibold">
                      {transactionData.paymentTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-semibold">
                      {transactionData.paymentMethod}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500">Total Paid</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatPrice(transactionData.totalAmount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services Purchased */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText size={20} className="mr-2 text-blue-600" />
              Services Purchased
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedServices.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <CheckCircle size={20} className="text-green-600 mr-3" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {service.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Included in your package
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatPrice(service.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock size={20} className="mr-2 text-blue-600" />
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
                  <h4 className="font-semibold text-gray-900">
                    Select Financing Option
                  </h4>
                  <p className="text-gray-600">
                    Choose how you'd like to finance this purchase (cash, loan,
                    or apply for loan)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Submit Your Offer
                  </h4>
                  <p className="text-gray-600">
                    Complete the offer agreement form with your offer amount and
                    terms
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Agent Review</h4>
                  <p className="text-gray-600">
                    Your agent will review your offer and contact you with next
                    steps
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Primary Action Button - Prominent */}
        <div className="mt-8">
          <Button
            onClick={() => navigate(`/property/${property.id}/financing`)}
            className="w-full bg-green-600 hover:bg-green-700 text-lg font-semibold py-6"
            size="lg"
          >
            Continue to Financing Selection
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          <p className="text-sm text-gray-600 text-center mt-2">
            Select your financing option and submit an offer
          </p>
        </div>

        {/* Secondary Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Button
            onClick={handleDownloadReceipt}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            <Download size={20} className="mr-2" />
            Download Receipt
          </Button>

          <Button
            onClick={handleContactAgent}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            <Mail size={20} className="mr-2" />
            Contact Agent
          </Button>

          <Button
            onClick={() => navigate(`/property/${property.id}`)}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            <ArrowRight size={20} className="mr-2 rotate-180" />
            Back to Property
          </Button>
        </div>

        {/* Contact Information */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">
                Need Immediate Assistance?
              </h3>
              <p className="text-gray-600 mb-4">
                Our support team is available 24/7 to help with any questions
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex items-center justify-center">
                  <Phone size={16} className="mr-2 text-blue-600" />
                  <span className="text-sm">(555) 123-4567</span>
                </div>
                <div className="flex items-center justify-center">
                  <Mail size={16} className="mr-2 text-blue-600" />
                  <span className="text-sm">support@brokerforce.ai</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
