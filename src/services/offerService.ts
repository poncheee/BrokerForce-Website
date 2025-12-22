import { authService } from "./authService";

export interface Offer {
  id: string;
  purchase_request_id: string | null;
  user_id: string;
  property_id: string;
  offer_amount: number;
  status: "draft" | "submitted" | "accepted" | "rejected" | "withdrawn";
  financing_type: "cash" | "loan" | "apply_for_loan" | null;
  signed_document_url: string | null;
  agent_response: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateOfferData {
  purchaseRequestId?: string;
  propertyId: string;
  offerAmount: number;
  financingType: "cash" | "loan" | "apply_for_loan";
  closingDate?: string;
  contingencies?: string;
}

class OfferService {
  private baseUrl = authService.getBaseUrl();

  private async fetchWithAuth(url: string, options?: RequestInit) {
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

  async getOffers(): Promise<Offer[]> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/api/offers`);
    return response.offers || [];
  }

  async getOfferById(offerId: string): Promise<Offer> {
    const response = await this.fetchWithAuth(
      `${this.baseUrl}/api/offers/${offerId}`
    );
    return response.offer;
  }

  async createOffer(offerData: CreateOfferData): Promise<Offer> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/api/offers`, {
      method: "POST",
      body: JSON.stringify({
        purchaseRequestId: offerData.purchaseRequestId,
        propertyId: offerData.propertyId,
        offerAmount: offerData.offerAmount,
        financingType: offerData.financingType,
      }),
    });
    return response.offer;
  }

  async updateOfferStatus(
    offerId: string,
    status: Offer["status"]
  ): Promise<Offer> {
    const response = await this.fetchWithAuth(
      `${this.baseUrl}/api/offers/${offerId}`,
      {
        method: "PUT",
        body: JSON.stringify({ status }),
      }
    );
    return response.offer;
  }
}

export const offerService = new OfferService();
