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
    w-full h-auto 
    
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
            srcSet={`${imageUrl}?w=320 320w, ${imageUrl}?w=640 640w`}
            sizes="(max-width: 640px) 320px, 640px"
            alt="Banner Quảng Cáo"
            className="object-cover md:w-full"
            loading="lazy" // Tải lười hình ảnh
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
