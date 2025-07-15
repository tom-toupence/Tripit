import React from "react";

interface Photo {
  url: string;
  description: string;
}

interface StepCarouselProps {
  voyageName: string;
  stepName: string;
  date: string;
  adresse: string;
  description: string;
  photos: Photo[];
  isModal: boolean;
  onLearnMore?: () => void;
  onClose: () => void;
}

function formatDate(iso: string) {
  // Support yyyy-mm-dd ou yyyy/mm/dd
  const [y, m, d] = iso.split(/[-/]/);
  return `${d}/${m}/${y.slice(2)}`;
}

const StepCarousel: React.FC<StepCarouselProps> = ({
  voyageName,
  stepName,
  date,
  adresse,
  description,
  photos,
  isModal,
  onLearnMore,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [flippedIndices, setFlippedIndices] = React.useState<
    Record<number, boolean>
  >({});

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const toggleFlip = (index: number) => {
    setFlippedIndices((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="flex bg-white rounded-lg shadow-md overflow-hidden h-full relative">
      {/* Close button */}
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 z-50"
        onClick={onClose}
        aria-label="Fermer"
      >
        <span style={{ fontSize: 24, lineHeight: 1 }}>✕</span>
      </button>

      {/* Left panel */}
      <div className="w-1/2 p-6 space-y-4">
        <h2 className="text-xl font-semibold flex items-center flex-wrap gap-2">
          {voyageName}
          <span className="font-normal text-sm text-gray-500">
            ({formatDate(date)})
          </span>
        </h2>
        <h3 className="text-lg font-medium text-gray-700">{stepName}</h3>
        <p className="text-sm text-gray-500">{adresse}</p>
        {isModal && !onLearnMore && (
          <p className="text-base text-gray-600">
            {" "}
            Description de l'étape : {description}
          </p>
        )}

        {!isModal && onLearnMore && (
          <button
            className="mt-4 px-4 py-2 bg-white text-green-700 hover:underline"
            onClick={onLearnMore}
          >
            En savoir plus
          </button>
        )}
      </div>

      {/* Right carousel panel */}
      <div className="w-1/2 relative">
        {photos.map((photo, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? "opacity-100 z-20" : "opacity-0 z-10"
            }`}
          >
            <div
              className="relative w-full h-full perspective cursor-pointer"
              onClick={() => toggleFlip(index)}
            >
              <div
                className={`relative w-full h-full duration-700 transform-style preserve-3d ${
                  flippedIndices[index] ? "rotateY-180" : ""
                }`}
              >
                {/* Front: image */}
                <img
                  src={photo.url}
                  alt={photo.description}
                  className="absolute w-full h-full object-cover backface-hidden rounded-lg"
                />

                {/* Back: description */}
                <div className="absolute w-full h-full flex items-center justify-center p-4 text-center backface-hidden rotateY-180 bg-white rounded-lg">
                  <p className="text-gray-800">{photo.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Controls */}
        {photos.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 focus:outline-none"
            >
              <svg
                className="w-5 h-5 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 focus:outline-none"
            >
              <svg
                className="w-5 h-5 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Indicators */}
        {photos.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {photos.map((_, idx) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full focus:outline-none ${
                  idx === currentIndex ? "bg-gray-800" : "bg-gray-400"
                }`}
                onClick={() => setCurrentIndex(idx)}
              ></button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StepCarousel;
