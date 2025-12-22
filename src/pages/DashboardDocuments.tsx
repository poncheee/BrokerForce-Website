import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { documentService, Document } from "@/services/documentService";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowLeft,
  FileText,
  Download,
  Calendar,
  Filter,
  Loader2,
  AlertCircle,
  CheckCircle,
  FileCheck,
  Home,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

type DocumentType = "all" | "representation_form" | "offer_agreement";

export default function DashboardDocuments() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<DocumentType>("all");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    const loadDocuments = async () => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        setError(null);
        const documentsData = await documentService.getDocuments();
        setDocuments(documentsData);
      } catch (err) {
        console.error("Error loading documents:", err);
        setError("Failed to load documents");
        toast({
          title: "Error",
          description: "Failed to load your documents. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadDocuments();
    }
  }, [isAuthenticated]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDocumentTypeLabel = (type: Document["document_type"]) => {
    const labels = {
      representation_form: "Buyer Representation Agreement",
      offer_agreement: "Offer Agreement",
    };
    return labels[type] || type;
  };

  const getDocumentTypeBadge = (type: Document["document_type"]) => {
    const colors = {
      representation_form: "bg-blue-100 text-blue-800 border-blue-200",
      offer_agreement: "bg-green-100 text-green-800 border-green-200",
    };
    return (
      <Badge
        className={`${colors[type] || "bg-gray-100 text-gray-800"} border`}
      >
        {getDocumentTypeLabel(type)}
      </Badge>
    );
  };

  const handleDownload = (document: Document) => {
    if (document.document_url) {
      window.open(document.document_url, "_blank");
    } else {
      toast({
        title: "Document Not Available",
        description: "This document is not yet available for download.",
        variant: "destructive",
      });
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    if (typeFilter === "all") return true;
    return doc.document_type === typeFilter;
  });

  const typeCounts = {
    all: documents.length,
    representation_form: documents.filter(
      (d) => d.document_type === "representation_form"
    ).length,
    offer_agreement: documents.filter(
      (d) => d.document_type === "offer_agreement"
    ).length,
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your documents...</p>
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
                <FileText className="h-6 w-6 text-purple-600 mr-2" />
                <h1 className="text-xl font-bold text-gray-900">
                  My Documents
                </h1>
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
              variant={typeFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setTypeFilter("all")}
            >
              All ({typeCounts.all})
            </Button>
            <Button
              variant={
                typeFilter === "representation_form" ? "default" : "outline"
              }
              size="sm"
              onClick={() => setTypeFilter("representation_form")}
            >
              Representation ({typeCounts.representation_form})
            </Button>
            <Button
              variant={typeFilter === "offer_agreement" ? "default" : "outline"}
              size="sm"
              onClick={() => setTypeFilter("offer_agreement")}
            >
              Offer Agreement ({typeCounts.offer_agreement})
            </Button>
          </div>
        </div>

        {/* Documents List */}
        {filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Documents Found
                </h3>
                <p className="text-gray-600 mb-6">
                  {typeFilter === "all"
                    ? "You don't have any signed documents yet. Documents will appear here after you complete the purchase process and sign agreements."
                    : `You don't have any ${getDocumentTypeLabel(
                        typeFilter as Document["document_type"]
                      )} documents.`}
                </p>
                <Button onClick={() => navigate("/")}>Browse Properties</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredDocuments.map((document) => (
              <Card
                key={document.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          {document.signed_at ? (
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                          ) : (
                            <FileCheck className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          )}
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              {getDocumentTypeBadge(document.document_type)}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>
                                  Created: {formatDate(document.created_at)}
                                </span>
                              </div>
                              {document.signed_at && (
                                <div className="flex items-center">
                                  <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                                  <span className="text-green-600">
                                    Signed: {formatDate(document.signed_at)}
                                  </span>
                                </div>
                              )}
                              {document.purchase_request_id && (
                                <div className="flex items-center">
                                  <Home className="h-4 w-4 mr-1" />
                                  <span>Purchase Request</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      {document.document_url && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleDownload(document)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                      {!document.document_url && (
                        <Button variant="outline" size="sm" disabled>
                          <FileText className="h-4 w-4 mr-2" />
                          Processing
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
