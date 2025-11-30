import { StarIcon } from "lucide-react";

function StarRatingComponent({ rating, handleRatingChange }) {
  const isInteractive = typeof handleRatingChange === "function";

  return [1, 2, 3, 4, 5].map((star) => {
    const isActive = star <= rating;
    const icon = (
      <StarIcon
        className={`w-5 h-5 ${
          isActive ? "text-yellow-500 fill-yellow-400" : "text-muted-foreground"
        }`}
      />
    );

    if (!isInteractive) {
      return (
        <span key={star} className="inline-flex">
          {icon}
        </span>
      );
    }

    return (
      <button
        type="button"
        key={star}
        onClick={() => handleRatingChange(star)}
        className="p-0 bg-transparent border-none inline-flex"
      >
        {icon}
      </button>
    );
  });
}

export default StarRatingComponent;
