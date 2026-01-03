import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Property } from "@/data/properties";
import { favoritesService } from "@/services/favoritesService";
import { useAuth } from "@/hooks/useAuth";

interface LikeButtonProps {
  property: Property;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function LikeButton({
  property,
  size = "md",
  className = "",
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Get size classes
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  // Check if property is liked on component mount (works for both authenticated and unauthenticated)
  useEffect(() => {
    favoritesService
      .isFavorite(property.id, isAuthenticated)
      .then(setIsLiked)
      .catch(() => setIsLiked(false));
  }, [property.id, isAuthenticated]);

  const toggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling to parent card
    setIsLoading(true);
    try {
      if (isLiked) {
        await favoritesService.removeFavorite(property.id, isAuthenticated);
        setIsLiked(false);
      } else {
        await favoritesService.addFavorite(property.id, property, isAuthenticated);
        setIsLiked(true);
      }
      // Dispatch custom event to update cart count
      window.dispatchEvent(new CustomEvent("likedHousesChanged"));
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleLike}
      className={`${className} transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-full`}
      aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={`${sizeClasses[size]} ${
          isLiked
            ? "fill-red-500 text-red-500"
            : "text-gray-400 hover:text-red-400"
        } transition-colors duration-200`}
      />
    </button>
  );
}
