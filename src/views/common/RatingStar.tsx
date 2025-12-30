import React from "react";

interface RatingProps {
  rating: number;
}

const RatingStar: React.FC<RatingProps> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <span>
      {[...Array(fullStars)].map((_, idx) => (
        <i
          key={`full-${idx}`}
          className="fa-solid fa-star fs-1 text-warning"
        ></i>
      ))}
      {hasHalfStar && (
        <i
          className="fa-solid fa-star-half-stroke fs-1 text-warning"
          key="half"
        />
      )}
      {[...Array(emptyStars)].map((_, idx) => (
        <i
          key={`empty-${idx}`}
          className="fa-regular fa-star fs-1 text-warning"
        />
      ))}
    </span>
  );
};

export default RatingStar;
