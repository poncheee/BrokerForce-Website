// src/services/purchaseService.ts

import { Property } from "@/data/properties";

export interface PurchaseRequest {
  id: string;
  propertyId: string;
  userId: string;
  status:
    | "pending"
    | "representation_signed"
    | "payment_completed"
    | "agent_assigned"
    | "completed"
    | "cancelled";
  representationData?: RepresentationData;
  paymentData?: PaymentData;
  selectedServices?: string[];
  totalAmount?: number;
  createdAt: string;
  updatedAt: string;
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
  private static baseUrl =
    import.meta.env.VITE_API_URL || "http://localhost:3001";
  private static storageKey = "brokerforce_purchases";

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

  // Create a new purchase request
  static async createPurchaseRequest(
    propertyId: string,
    userId: string
  ): Promise<PurchaseRequest> {
    const purchaseRequest: PurchaseRequest = {
      id: `purchase-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      propertyId,
      userId,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In a real app, this would save to backend
    // For now, we'll store in localStorage
    const existingPurchases = this.getStoredPurchases();
    existingPurchases.push(purchaseRequest);
    this.savePurchasesToStorage(existingPurchases);

    console.log("Created purchase request:", purchaseRequest);
    return purchaseRequest;
  }

  // Submit representation form
  static async submitRepresentationForm(
    purchaseId: string,
    representationData: RepresentationData
  ): Promise<PurchaseRequest> {
    const purchases = this.getStoredPurchases();
    const purchaseIndex = purchases.findIndex((p) => p.id === purchaseId);

    if (purchaseIndex === -1) {
      throw new Error("Purchase request not found");
    }

    purchases[purchaseIndex].representationData = representationData;
    purchases[purchaseIndex].status = "representation_signed";
    purchases[purchaseIndex].updatedAt = new Date().toISOString();

    this.savePurchasesToStorage(purchases);

    // In a real app, this would integrate with eSignature service
    console.log("Representation form submitted:", representationData);

    return purchases[purchaseIndex];
  }

  // Process payment
  static async processPayment(
    purchaseId: string,
    selectedServices: string[],
    paymentMethod: string
  ): Promise<PurchaseRequest> {
    const purchases = this.getStoredPurchases();
    const purchaseIndex = purchases.findIndex((p) => p.id === purchaseId);

    if (purchaseIndex === -1) {
      throw new Error("Purchase request not found");
    }

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

    purchases[purchaseIndex].paymentData = paymentData;
    purchases[purchaseIndex].selectedServices = selectedServices;
    purchases[purchaseIndex].totalAmount = totalAmount;
    purchases[purchaseIndex].status = "payment_completed";
    purchases[purchaseIndex].updatedAt = new Date().toISOString();

    this.savePurchasesToStorage(purchases);

    // In a real app, this would integrate with payment processor (Stripe, PayPal, etc.)
    console.log("Payment processed:", paymentData);

    return purchases[purchaseIndex];
  }

  // Get purchase request by ID
  static getPurchaseRequest(purchaseId: string): PurchaseRequest | null {
    const purchases = this.getStoredPurchases();
    return purchases.find((p) => p.id === purchaseId) || null;
  }

  // Get all purchases for a user
  static getUserPurchases(userId: string): PurchaseRequest[] {
    const purchases = this.getStoredPurchases();
    return purchases.filter((p) => p.userId === userId);
  }

  // Get all purchases for a property
  static getPropertyPurchases(propertyId: string): PurchaseRequest[] {
    const purchases = this.getStoredPurchases();
    return purchases.filter((p) => p.propertyId === propertyId);
  }

  // Update purchase status
  static async updatePurchaseStatus(
    purchaseId: string,
    status: PurchaseRequest["status"]
  ): Promise<PurchaseRequest> {
    const purchases = this.getStoredPurchases();
    const purchaseIndex = purchases.findIndex((p) => p.id === purchaseId);

    if (purchaseIndex === -1) {
      throw new Error("Purchase request not found");
    }

    purchases[purchaseIndex].status = status;
    purchases[purchaseIndex].updatedAt = new Date().toISOString();

    this.savePurchasesToStorage(purchases);

    console.log("Purchase status updated:", { purchaseId, status });

    return purchases[purchaseIndex];
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
  static getPurchaseStats(): {
    totalPurchases: number;
    completedPurchases: number;
    pendingPurchases: number;
    totalRevenue: number;
  } {
    const purchases = this.getStoredPurchases();

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
        .reduce((sum, p) => sum + (p.totalAmount || 0), 0),
    };
  }

  // Private helper methods
  private static getStoredPurchases(): PurchaseRequest[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading purchases from storage:", error);
      return [];
    }
  }

  private static savePurchasesToStorage(purchases: PurchaseRequest[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(purchases));
    } catch (error) {
      console.error("Error saving purchases to storage:", error);
    }
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
