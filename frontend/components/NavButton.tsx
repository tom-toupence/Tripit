'use client';

import { useEffect, useState } from 'react';
import NotificationToast from './NotificationToast';

type Step = {
  id: number;
  locationName: string;
  latitude: number;
  longitude: number;
};

export default function NavButton() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    const handleSetSteps = (e: Event) => {
      const customEvent = e as CustomEvent<Step[]>;
      setIsMounted(true);
      setSteps(customEvent.detail);
      setCurrentIndex(0);
      setShowToast(false);
    };
    window.addEventListener('setSteps', handleSetSteps);
    return () => window.removeEventListener('setSteps', handleSetSteps);
  }, []);

  useEffect(() => {
    if (showToast) {
      const timeout = setTimeout(() => {
        setShowToast(false);
      }, 3000); // Affiché 3 secondes
      return () => clearTimeout(timeout);
    }
  }, [showToast]);

  const handleNextStep = () => {
    if (steps.length === 0) return;
    const nextStep = steps[currentIndex + 1];
    const event = new CustomEvent('focusOnStep', { detail: nextStep });
    window.dispatchEvent(event);
    setCurrentIndex(prev => prev + 1);
    if (currentIndex + 1 >= steps.length - 1) {
      setShowToast(true);
      setIsMounted(false);
      return;
    }
  };

  return (
    <>
      {steps.length > 0 && isMounted && (
        <div className="absolute right-4 bottom-[300px] flex flex-col md:flex-row justify-center items-center z-50">
          <button
            aria-label="Next Step"
            type="button"
            onClick={handleNextStep}
            className="group relative inline-flex h-[calc(48px+8px)] items-center justify-center rounded-full bg-white py-1 pl-6 pr-14 font-medium text-black shadow-xl hover:shadow-2xl transition outline-none active:scale-95"
          >
            <span className="z-10 pr-2 text-green-700 dark:text-green-300">Prochaine étape</span>
            <div className="absolute right-1 inline-flex h-12 w-12 items-center justify-end rounded-full bg-gray-200 transition-[width] group-hover:w-[calc(100%-8px)] overflow-hidden">
              <span
                className="w-3 h-3 bg-no-repeat bg-center bg-contain animate-bounceAlpha absolute right-3"
                style={{
                    backgroundImage:
                    "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><style>.st0{fill:%2315803d}</style><path class=\"st0\" d=\"M319.1 217c20.2 20.2 19.9 53.2-.6 73.7s-53.5 20.8-73.7.6l-190-190c-20.1-20.2-19.8-53.2.7-73.7S109 6.8 129.1 27l190 190z\"/><path class=\"st0\" d=\"M319.1 290.5c20.2-20.2 19.9-53.2-.6-73.7s-53.5-20.8-73.7-.6l-190 190c-20.2 20.2-19.9 53.2.6 73.7s53.5 20.8 73.7.6l190-190z\"/></svg>')",
                }}
                ></span>
                <span
                className="w-3 h-3 bg-no-repeat bg-center bg-contain animate-bounceAlpha delay-200 absolute right-5"
                style={{
                    backgroundImage:
                    "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><style>.st0{fill:%2315803d}</style><path class=\"st0\" d=\"M319.1 217c20.2 20.2 19.9 53.2-.6 73.7s-53.5 20.8-73.7.6l-190-190c-20.1-20.2-19.8-53.2.7-73.7S109 6.8 129.1 27l190 190z\"/><path class=\"st0\" d=\"M319.1 290.5c20.2-20.2 19.9-53.2-.6-73.7s-53.5-20.8-73.7-.6l-190 190c-20.2 20.2-19.9 53.2.6 73.7s53.5 20.8 73.7.6l190-190z\"/></svg>')",
                }}
            ></span>
            </div>

            <style jsx>{`
              @keyframes bounceAlpha {
                0% { opacity: 1; transform: translateX(0) scale(1); }
                25% { opacity: 0; transform: translateX(10px) scale(0.9); }
                26% { opacity: 0; transform: translateX(-10px) scale(0.9); }
                55% { opacity: 1; transform: translateX(0) scale(1); }
              }
              .animate-bounceAlpha {
                animation-name: bounceAlpha;
                animation-duration: 1.4s;
                animation-iteration-count: infinite;
                animation-timing-function: linear;
              }
              .delay-200 { animation-delay: 0.2s !important; }
            `}</style>
          </button>
        </div>
      )}
      {/* Toast toujours monté, animée par opacité */}
      <div
        className={`fixed bottom-5 right-4 z-50 w-[450px] transition-opacity duration-1000 ease-in-out left-1/2 transform -translate-x-1/2
          ${showToast ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        <NotificationToast
            message="Toutes les étapes ont été parcourues !"
            type="success"
            isVisible={showToast}
            onClose={() => setShowToast(false)}
            />
      </div>
    </>
  );
}
