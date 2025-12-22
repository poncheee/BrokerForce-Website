// Dashboard service - API integration

const baseUrl = import.meta.env.VITE_AUTH_SERVER_URL || "http://localhost:3001";

export interface DashboardStats {
  favorites: number;
  purchases: {
    total: string;
    completed: string;
    pending: string;
    signed: string;
    total_amount: string;
  };
  offers: {
    total: string;
    submitted: string;
    accepted: string;
    rejected: string;
  };
  documents: number;
  payments: {
    total: string;
    total_amount: string;
  };
}

export interface DashboardData {
  stats: DashboardStats;
  recentPurchases: any[];
}

class DashboardService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${baseUrl}/api/dashboard${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Request failed" }));
      throw new Error(error.error || "Request failed");
    }

    return response.json();
  }

  async getDashboard(): Promise<DashboardData> {
    return this.request("/");
  }
}

export const dashboardService = new DashboardService();
