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
  const [hiddenBanner, setHiddenBanner] = React.useState(false);
  return (
    <div
      className={`
    ${position === "top" ? "top-0" : "absolute bottom-0"}
    z-40
    flex items-center
    justify-between
    shadow-lg
    w-full h-auto max-h-[90px]
    
    sm:justify-center
    md:justify-between

    lg:max-w-[1024px]
    xl:max-w-[1200px]
    2xl:max-w-[1440px]

    lg:translate-x-0
    xl:translate-x-[calc((100vw-1200px)/2)]
    2xl:translate-x-[calc((100vw-1440px)/2)]
  `}
    >
      {!hiddenBanner && (
        <>
          <img
            src={imageUrl}
            alt="Ad Banner"
            className="object-cover md:w-full"
          />
          {position === "bottom" && (
            <div
              onClick={() => setHiddenBanner(true)}
              className="opacity-80 bg-red-500 hover:bg-red-600 text-white font-semibold py-0.5 px-2 rounded text-sm shadow absolute right-0 top-0 cursor-pointer"
            >
              {buttonText}
              <button className="text-white hover:text-yellow-200 text-xl leading-none">
                &times;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StickyAdBanner;
