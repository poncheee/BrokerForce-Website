// src/services/purchaseService.ts

import { Property } from "@/data/properties";
import { authService } from "./authService";

export interface PurchaseRequest {
  id: string;
  property_id: string;
  user_id: string;
  status:
    | "pending"
    | "representation_signed"
    | "payment_completed"
    | "agent_assigned"
    | "completed"
    | "cancelled";
  representation_data?: RepresentationData;
  payment_data?: PaymentData;
  selected_services?: string[];
  total_amount?: number;
  offer_data?: any;
  created_at: string;
  updated_at: string;
  // Frontend convenience fields (converted from snake_case)
  propertyId?: string;
  userId?: string;
  representationData?: RepresentationData;
  paymentData?: PaymentData;
  selectedServices?: string[];
  totalAmount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RepresentationData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  hasAgent: boolean;
  currentAgentName?: string;
  currentAgentCompany?: string;
  financingPreApproved: boolean;
  financingLender?: string;
  preApprovalAmount?: string;
  downPaymentAmount?: string;
  preferredClosingDate?: string;
  additionalNotes?: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
}

export interface PaymentData {
  transactionId: string;
  paymentMethod: string;
  totalAmount: number;
  fixedFee: number;
  selectedServices: string[];
  serviceCosts: { [key: string]: number };
  paymentDate: string;
  status: "pending" | "completed" | "failed" | "refunded";
}

export interface ServiceOption {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export class PurchaseService {
  private static getBaseUrl(): string {
    return import.meta.env.VITE_AUTH_SERVER_URL || "http://localhost:3001";
  }

  // Service options with pricing
  static readonly SERVICE_OPTIONS: ServiceOption[] = [
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

  static readonly FIXED_REPRESENTATION_FEE = 299;

  private static async fetchWithAuth(url: string, options?: RequestInit) {
    const headers = {
      "Content-Type": "application/json",
      ...options?.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // Important for session cookies
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || errorData.message || `API error: ${response.status}`
      );
    }

    return response.json();
  }

  private static normalizePurchaseRequest(purchase: any): PurchaseRequest {
    // Convert snake_case from DB to camelCase for frontend, while keeping both
    return {
      ...purchase,
      propertyId: purchase.property_id,
      userId: purchase.user_id,
      representationData: purchase.representation_data
        ? JSON.parse(purchase.representation_data)
        : undefined,
      paymentData: purchase.payment_data
        ? JSON.parse(purchase.payment_data)
        : undefined,
      selectedServices: purchase.selected_services || [],
      totalAmount: purchase.total_amount
        ? parseFloat(purchase.total_amount.toString())
        : undefined,
      createdAt: purchase.created_at,
      updatedAt: purchase.updated_at,
    };
  }

  // Create a new purchase request
  static async createPurchaseRequest(
    propertyId: string,
    userId: string
  ): Promise<PurchaseRequest> {
    const response = await this.fetchWithAuth(
      `${this.getBaseUrl()}/api/purchases`,
      {
        method: "POST",
        body: JSON.stringify({ propertyId }),
      }
    );

    return this.normalizePurchaseRequest(response.purchase);
  }

  // Submit representation form
  static async submitRepresentationForm(
    purchaseId: string,
    representationData: RepresentationData
  ): Promise<PurchaseRequest> {
    const response = await this.fetchWithAuth(
      `${this.getBaseUrl()}/api/purchases/${purchaseId}`,
      {
        method: "PUT",
        body: JSON.stringify({
          representationData,
          status: "representation_signed",
        }),
      }
    );

    return this.normalizePurchaseRequest(response.purchase);
  }

  // Process payment
  static async processPayment(
    purchaseId: string,
    selectedServices: string[],
    paymentMethod: string
  ): Promise<PurchaseRequest> {
    // Calculate costs
    const serviceCosts: { [key: string]: number } = {};
    let totalServiceCost = 0;

    selectedServices.forEach((serviceId) => {
      const service = this.SERVICE_OPTIONS.find((s) => s.id === serviceId);
      if (service) {
        serviceCosts[serviceId] = service.price;
        totalServiceCost += service.price;
      }
    });

    const totalAmount = this.FIXED_REPRESENTATION_FEE + totalServiceCost;

    // Create payment data
    const paymentData: PaymentData = {
      transactionId: `TXN-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      paymentMethod,
      totalAmount,
      fixedFee: this.FIXED_REPRESENTATION_FEE,
      selectedServices,
      serviceCosts,
      paymentDate: new Date().toISOString(),
      status: "completed", // In real app, this would be determined by payment processor
    };

    const response = await this.fetchWithAuth(
      `${this.getBaseUrl()}/api/purchases/${purchaseId}`,
      {
        method: "PUT",
        body: JSON.stringify({
          paymentData,
          selectedServices,
          totalAmount,
          status: "payment_completed",
        }),
      }
    );

    return this.normalizePurchaseRequest(response.purchase);
  }

  // Get purchase request by ID
  static async getPurchaseRequest(
    purchaseId: string
  ): Promise<PurchaseRequest | null> {
    try {
      const response = await this.fetchWithAuth(
        `${this.getBaseUrl()}/api/purchases/${purchaseId}`
      );
      return this.normalizePurchaseRequest(response.purchase);
    } catch (error) {
      console.error("Error fetching purchase:", error);
      return null;
    }
  }

  // Get all purchases for a user
  static async getUserPurchases(userId: string): Promise<PurchaseRequest[]> {
    try {
      const response = await this.fetchWithAuth(
        `${this.getBaseUrl()}/api/purchases`
      );
      return (response.purchases || []).map((p: any) =>
        this.normalizePurchaseRequest(p)
      );
    } catch (error) {
      console.error("Error fetching purchases:", error);
      return [];
    }
  }

  // Get all purchases for a property (filtered from user purchases)
  static async getPropertyPurchases(
    propertyId: string
  ): Promise<PurchaseRequest[]> {
    const purchases = await this.getUserPurchases("");
    return purchases.filter(
      (p) => p.propertyId === propertyId || p.property_id === propertyId
    );
  }

  // Update purchase status
  static async updatePurchaseStatus(
    purchaseId: string,
    status: PurchaseRequest["status"]
  ): Promise<PurchaseRequest> {
    const response = await this.fetchWithAuth(
      `${this.getBaseUrl()}/api/purchases/${purchaseId}`,
      {
        method: "PUT",
        body: JSON.stringify({ status }),
      }
    );

    return this.normalizePurchaseRequest(response.purchase);
  }

  // Cancel purchase
  static async cancelPurchase(
    purchaseId: string,
    reason?: string
  ): Promise<PurchaseRequest> {
    return this.updatePurchaseStatus(purchaseId, "cancelled");
  }

  // Get service option by ID
  static getServiceOption(serviceId: string): ServiceOption | null {
    return this.SERVICE_OPTIONS.find((s) => s.id === serviceId) || null;
  }

  // Calculate total cost for selected services
  static calculateTotalCost(selectedServices: string[]): number {
    let total = this.FIXED_REPRESENTATION_FEE;

    selectedServices.forEach((serviceId) => {
      const service = this.getServiceOption(serviceId);
      if (service) {
        total += service.price;
      }
    });

    return total;
  }

  // Get purchase statistics
  static async getPurchaseStats(): Promise<{
    totalPurchases: number;
    completedPurchases: number;
    pendingPurchases: number;
    totalRevenue: number;
  }> {
    const purchases = await this.getUserPurchases("");

    return {
      totalPurchases: purchases.length,
      completedPurchases: purchases.filter((p) => p.status === "completed")
        .length,
      pendingPurchases: purchases.filter((p) =>
        ["pending", "representation_signed", "payment_completed"].includes(
          p.status
        )
      ).length,
      totalRevenue: purchases
        .filter((p) => p.status === "completed")
        .reduce((sum, p) => sum + (p.totalAmount || p.total_amount || 0), 0),
    };
  }

  // Integration with external services (for future implementation)
  static async sendAgentNotification(
    purchaseId: string,
    message: string
  ): Promise<void> {
    // In a real app, this would send notification to assigned agent
    console.log("Agent notification:", { purchaseId, message });
  }

  static async sendCustomerEmail(
    userId: string,
    template: string,
    data: any
  ): Promise<void> {
    // In a real app, this would send email to customer
    console.log("Customer email:", { userId, template, data });
  }

  static async generateReceipt(purchaseId: string): Promise<string> {
    // In a real app, this would generate PDF receipt
    const purchase = this.getPurchaseRequest(purchaseId);
    if (!purchase) {
      throw new Error("Purchase not found");
    }

    // Return mock receipt URL
    return `https://brokerforce.ai/receipts/${purchaseId}.pdf`;
  }

  static async scheduleService(
    purchaseId: string,
    serviceId: string,
    scheduledDate: string
  ): Promise<void> {
    // In a real app, this would schedule service with agent
    console.log("Service scheduled:", { purchaseId, serviceId, scheduledDate });
  }
}

export const purchaseService = new PurchaseService();
