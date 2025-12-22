// Favorites service - API integration
import { Property } from "@/data/properties";

const baseUrl = import.meta.env.VITE_AUTH_SERVER_URL || "http://localhost:3001";

export interface Favorite {
  id: number;
  property_id: string;
  property_data: Property | null;
  created_at: string;
}

class FavoritesService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${baseUrl}/api/favorites${endpoint}`, {
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

  async getFavorites(): Promise<Favorite[]> {
    const data = await this.request("/");
    return data.favorites || [];
  }

  async addFavorite(
    propertyId: string,
    propertyData?: Property
  ): Promise<Favorite | null> {
    const data = await this.request("/", {
      method: "POST",
      body: JSON.stringify({ propertyId, propertyData }),
    });
    return data.favorite;
  }

  async removeFavorite(propertyId: string): Promise<void> {
    await this.request(`/${propertyId}`, {
      method: "DELETE",
    });
  }

  async isFavorite(propertyId: string): Promise<boolean> {
    const data = await this.request(`/check/${propertyId}`);
    return data.isFavorite;
  }
}

export const favoritesService = new FavoritesService();
