import { authService } from "./authService";

export interface Payment {
  id: string;
  user_id: string;
  purchase_request_id: string | null;
  transaction_id: string | null;
  amount: number;
  payment_method: string | null;
  status: "pending" | "completed" | "failed" | "refunded";
  payment_data: any | null;
  created_at: string;
}

class PaymentService {
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

  async getPayments(): Promise<Payment[]> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/api/payments`);
    return response.payments || [];
  }

  async getPaymentById(paymentId: string): Promise<Payment> {
    const response = await this.fetchWithAuth(
      `${this.baseUrl}/api/payments/${paymentId}`
    );
    return response.payment;
  }
}

export const paymentService = new PaymentService();
