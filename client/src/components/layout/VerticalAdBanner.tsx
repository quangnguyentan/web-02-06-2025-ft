import * as React from "react";

interface VerticalAdBannerProps {
  position: "left" | "right";
  imageUrl?: string;
  altText?: string;
  adLink?: string;
}

const VerticalAdBanner: React.FC<VerticalAdBannerProps> = ({
  position,
  imageUrl,
  altText = "Advertisement",
  adLink = "#",
}) => {
  const defaultImageUrl = "";

  return (
    <div
      className={`hidden lg:block fixed top-1/2 -translate-y-1/2 ${
        position === "left" ? "left-32" : "right-36 "
      } z-50 w-40`}
    >
      <a
        href={adLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block shadow-lg rounded-lg overflow-hidden"
      >
        <img
          src={imageUrl || defaultImageUrl}
          alt={altText}
          className="w-full h-auto object-contain"
          onError={(e) => (e.currentTarget.src = defaultImageUrl)} // Fallback if primary image fails
        />
      </a>
    </div>
  );
};

export default VerticalAdBanner;
