import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { paymentService, Payment } from "@/services/paymentService";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowLeft,
  CreditCard,
  DollarSign,
  Calendar,
  Filter,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Download,
  Receipt,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

type PaymentStatus = "all" | "completed" | "pending" | "failed" | "refunded";

export default function DashboardPayments() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<PaymentStatus>("all");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    const loadPayments = async () => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        setError(null);
        const paymentsData = await paymentService.getPayments();
        setPayments(paymentsData);
      } catch (err) {
        console.error("Error loading payments:", err);
        setError("Failed to load payments");
        toast({
          title: "Error",
          description: "Failed to load your payment history. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadPayments();
    }
  }, [isAuthenticated]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: Payment["status"]) => {
    const statusConfig = {
      completed: {
        label: "Completed",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
      },
      pending: {
        label: "Pending",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
      },
      failed: {
        label: "Failed",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
      },
      refunded: {
        label: "Refunded",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: RefreshCw,
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} border flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const handleDownloadReceipt = (payment: Payment) => {
    // In production, this would generate/download a PDF receipt
    toast({
      title: "Receipt Download",
      description: `Receipt for transaction ${
        payment.transaction_id || payment.id
      } would be downloaded here.`,
    });
  };

  const filteredPayments = payments.filter((payment) => {
    if (statusFilter === "all") return true;
    return payment.status === statusFilter;
  });

  const statusCounts = {
    all: payments.length,
    completed: payments.filter((p) => p.status === "completed").length,
    pending: payments.filter((p) => p.status === "pending").length,
    failed: payments.filter((p) => p.status === "failed").length,
    refunded: payments.filter((p) => p.status === "refunded").length,
  };

  const totalAmount = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your payment history...</p>
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
                <CreditCard className="h-6 w-6 text-green-600 mr-2" />
                <h1 className="text-xl font-bold text-gray-900">
                  Payment History
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Card */}
        {payments.length > 0 && (
          <Card className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatPrice(totalAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {payments.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed Payments</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {statusCounts.completed}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
              variant={statusFilter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("completed")}
            >
              Completed ({statusCounts.completed})
            </Button>
            <Button
              variant={statusFilter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("pending")}
            >
              Pending ({statusCounts.pending})
            </Button>
            <Button
              variant={statusFilter === "failed" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("failed")}
            >
              Failed ({statusCounts.failed})
            </Button>
            <Button
              variant={statusFilter === "refunded" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("refunded")}
            >
              Refunded ({statusCounts.refunded})
            </Button>
          </div>
        </div>

        {/* Payments List */}
        {filteredPayments.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Payments Found
                </h3>
                <p className="text-gray-600 mb-6">
                  {statusFilter === "all"
                    ? "You don't have any payment history yet. Payments will appear here after you complete a purchase."
                    : `You don't have any ${statusFilter} payments.`}
                </p>
                <Button onClick={() => navigate("/")}>Browse Properties</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <Card
                key={payment.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <DollarSign className="h-5 w-5 text-green-600" />
                            <span className="text-2xl font-bold text-gray-900">
                              {formatPrice(
                                parseFloat(payment.amount.toString())
                              )}
                            </span>
                            {getStatusBadge(payment.status)}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            {payment.transaction_id && (
                              <div>
                                <span className="font-mono">
                                  TXN: {payment.transaction_id}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{formatDate(payment.created_at)}</span>
                            </div>
                            {payment.payment_method && (
                              <div className="flex items-center">
                                <CreditCard className="h-4 w-4 mr-1" />
                                <span>{payment.payment_method}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      {payment.status === "completed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadReceipt(payment)}
                        >
                          <Receipt className="h-4 w-4 mr-2" />
                          Receipt
                        </Button>
                      )}
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
