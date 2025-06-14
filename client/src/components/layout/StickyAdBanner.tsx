import * as React from "react";

interface StickyAdBannerProps {
  position: "top" | "bottom";
  imageUrl?: string; // Optional image URL for the ad
  buttonText?: string;
}

const StickyAdBanner: React.FC<StickyAdBannerProps> = ({
  position,
  imageUrl,
  buttonText,
}) => {
  return (
    <div
      className={`${
        position === "top" ? "top-0" : "sticky bottom-0"
      } transform md:translate-x-[24%] z-40 flex items-center sm:justify-center md:justify-between shadow-lg max-w-[1330px] h-auto w-full max-h-[90px]`}
    >
      <img
        src={imageUrl}
        alt="Ad Banner"
        className="object-cover md:w-[95%] "
      />
      {position === "bottom" && (
        <a
          href="#"
          className="opacity-80 bg-red-500 hover:bg-red-600 text-white font-semibold py-0.5 px-2 rounded text-sm shadow absolute right-0 top-0 md:mr-16 sm:mr-0"
        >
          {buttonText}
          <button className="text-white hover:text-yellow-200 text-xl leading-none">
            &times;
          </button>
        </a>
      )}
    </div>
  );
};

export default StickyAdBanner;
