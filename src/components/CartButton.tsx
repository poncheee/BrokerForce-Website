import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { favoritesService } from "@/services/favoritesService";
import { useAuth } from "@/hooks/useAuth";

export default function CartButton() {
  const [likedCount, setLikedCount] = useState(0);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Update liked count from API (authenticated) or localStorage (unauthenticated)
  const updateLikedCount = async () => {
    try {
      const favorites = await favoritesService.getFavorites(isAuthenticated);
      setLikedCount(favorites.length);
    } catch (error) {
      console.error("Error loading favorites count:", error);
      setLikedCount(0);
    }
  };

  // Update count on component mount and when liked houses change
  useEffect(() => {
    updateLikedCount();

    // Listen for custom event when liked houses change
    const handleLikedHousesChanged = () => {
      updateLikedCount();
    };

    window.addEventListener("likedHousesChanged", handleLikedHousesChanged);
    return () => {
      window.removeEventListener(
        "likedHousesChanged",
        handleLikedHousesChanged
      );
    };
  }, [isAuthenticated]);

  const handleClick = () => {
    navigate("/favorites");
  };

  return (
    <button
      onClick={handleClick}
      className="relative flex items-center justify-center gap-2 px-3 h-12 bg-red-500 hover:bg-red-600 border border-red-600 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      aria-label={`${likedCount} liked houses`}
    >
      <Heart className="w-6 h-6 text-white fill-white" />
      {likedCount > 0 && (
        <span className="text-white font-semibold text-sm">
          {likedCount}
        </span>
      )}
    </button>
  );
}
