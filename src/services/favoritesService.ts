// Favorites service - API integration with localStorage fallback
import { Property } from "@/data/properties";

const baseUrl = import.meta.env.VITE_AUTH_SERVER_URL || "http://localhost:3001";
const LOCAL_STORAGE_KEY = "brokerforce_favorites";

export interface Favorite {
  id: number;
  property_id: string;
  property_data: Property | null;
  created_at: string;
}

class FavoritesService {
  // localStorage helpers
  private getLocalFavorites(): Property[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private setLocalFavorites(favorites: Property[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Error saving favorites to localStorage:", error);
    }
  }

  private addLocalFavorite(property: Property): void {
    const favorites = this.getLocalFavorites();
    if (!favorites.find((p) => p.id === property.id)) {
      favorites.push(property);
      this.setLocalFavorites(favorites);
    }
  }

  private removeLocalFavorite(propertyId: string): void {
    const favorites = this.getLocalFavorites();
    const filtered = favorites.filter((p) => p.id !== propertyId);
    this.setLocalFavorites(filtered);
  }

  private isLocalFavorite(propertyId: string): boolean {
    const favorites = this.getLocalFavorites();
    return favorites.some((p) => p.id === propertyId);
  }

  // API request helper
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

  // Get favorites (API for authenticated, localStorage for unauthenticated)
  async getFavorites(isAuthenticated: boolean): Promise<Favorite[]> {
    if (isAuthenticated) {
      const data = await this.request("/");
      return data.favorites || [];
    } else {
      // Return localStorage favorites in the same format as API
      const localFavorites = this.getLocalFavorites();
      return localFavorites.map((property, index) => ({
        id: index + 1,
        property_id: property.id,
        property_data: property,
        created_at: new Date().toISOString(),
      }));
    }
  }

  // Add favorite (API for authenticated, localStorage for unauthenticated)
  async addFavorite(
    propertyId: string,
    propertyData?: Property,
    isAuthenticated: boolean = false
  ): Promise<Favorite | null> {
    if (isAuthenticated) {
      const data = await this.request("/", {
        method: "POST",
        body: JSON.stringify({ propertyId, propertyData }),
      });
      return data.favorite;
    } else {
      if (propertyData) {
        this.addLocalFavorite(propertyData);
        return {
          id: Date.now(),
          property_id: propertyId,
          property_data: propertyData,
          created_at: new Date().toISOString(),
        };
      }
      return null;
    }
  }

  // Remove favorite (API for authenticated, localStorage for unauthenticated)
  async removeFavorite(
    propertyId: string,
    isAuthenticated: boolean = false
  ): Promise<void> {
    if (isAuthenticated) {
      await this.request(`/${propertyId}`, {
        method: "DELETE",
      });
    } else {
      this.removeLocalFavorite(propertyId);
    }
  }

  // Check if favorite (API for authenticated, localStorage for unauthenticated)
  async isFavorite(
    propertyId: string,
    isAuthenticated: boolean = false
  ): Promise<boolean> {
    if (isAuthenticated) {
      const data = await this.request(`/check/${propertyId}`);
      return data.isFavorite;
    } else {
      return this.isLocalFavorite(propertyId);
    }
  }

  // Sync localStorage favorites to API when user signs in
  async syncLocalFavoritesToAPI(): Promise<void> {
    const localFavorites = this.getLocalFavorites();
    if (localFavorites.length === 0) return;

    try {
      // Add each local favorite to the API
      for (const property of localFavorites) {
        try {
          await this.request("/", {
            method: "POST",
            body: JSON.stringify({
              propertyId: property.id,
              propertyData: property,
            }),
          });
        } catch (error) {
          // If property already exists in API, that's fine, continue
          console.log("Property might already be in favorites:", property.id);
        }
      }

      // Clear localStorage after successful sync
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      console.log(`Synced ${localFavorites.length} favorites to account`);
    } catch (error) {
      console.error("Error syncing favorites:", error);
      // Don't clear localStorage if sync fails
    }
  }

  // Get localStorage favorites (for migration/sync)
  getLocalFavoritesList(): Property[] {
    return this.getLocalFavorites();
  }
}

export const favoritesService = new FavoritesService();
