'use client';

import { useEffect, useState } from 'react';

type Step = {
    id: number;
    locationName: string;
    latitude: number;
    longitude: number;
};

export default function NavButton() {
    const [steps, setSteps] = useState<Step[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const handleSetSteps = (e: Event) => {
            const customEvent = e as CustomEvent<Step[]>;
            setSteps(customEvent.detail);
            setCurrentIndex(0);
        };
        window.addEventListener('setSteps', handleSetSteps);
        return () => window.removeEventListener('setSteps', handleSetSteps);
    }, []);

    const handleNextStep = () => {
        if (steps.length === 0) return;
        if (currentIndex + 1 >= steps.length) {
            console.log('All steps completed!');
            return;
        }
        const currentStep = steps[currentIndex + 1];
        const event = new CustomEvent('focusOnStep', { detail: currentStep });
        window.dispatchEvent(event);
        setCurrentIndex(prev => prev + 1);
    };

    return (
        steps.length > 0 && (
            <div
                className={`
                    absolute right-4 bottom-[300px]
                    flex flex-col md:flex-row justify-center items-center
                    z-50
                `}
            >
                <button
                    aria-label="Next Step"
                    type="button"
                    onClick={handleNextStep}
                    className={`
                        w-14 h-14 flex items-center justify-center rounded-full
                        bg-black
                        shadow-xl hover:shadow-2xl transition
                        relative
                        outline-none active:scale-95
                    `}
                >
                    <span
                        className={`
                            flex items-center justify-center gap-1
                            absolute inset-0
                        `}
                    >
                        {/* Arrow 1 */}
                        <span
                            className={`
                                w-3 h-3
                                bg-no-repeat bg-center bg-contain
                                animate-bounceAlpha
                            `}
                            style={{
                                backgroundImage:
                                    "url('data:image/svg+xml;utf8,<svg id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><style>.st0{fill:%23fff}</style><path class=\"st0\" d=\"M319.1 217c20.2 20.2 19.9 53.2-.6 73.7s-53.5 20.8-73.7.6l-190-190c-20.1-20.2-19.8-53.2.7-73.7S109 6.8 129.1 27l190 190z\"/><path class=\"st0\" d=\"M319.1 290.5c20.2-20.2 19.9-53.2-.6-73.7s-53.5-20.8-73.7-.6l-190 190c-20.2 20.2-19.9 53.2.6 73.7s53.5 20.8 73.7.6l190-190z\"/></svg>')",
                            }}
                        ></span>
                        {/* Arrow 2 */}
                        <span
                            className={`
                                w-3 h-3
                                bg-no-repeat bg-center bg-contain
                                animate-bounceAlpha delay-200
                            `}
                            style={{
                                backgroundImage:
                                    "url('data:image/svg+xml;utf8,<svg id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><style>.st0{fill:%23fff}</style><path class=\"st0\" d=\"M319.1 217c20.2 20.2 19.9 53.2-.6 73.7s-53.5 20.8-73.7.6l-190-190c-20.1-20.2-19.8-53.2.7-73.7S109 6.8 129.1 27l190 190z\"/><path class=\"st0\" d=\"M319.1 290.5c20.2-20.2 19.9-53.2-.6-73.7s-53.5-20.8-73.7-.6l-190 190c-20.2 20.2-19.9 53.2.6 73.7s53.5 20.8 73.7.6l190-190z\"/></svg>')",
                            }}
                        ></span>
                    </span>
                    <style jsx>{`
                        @keyframes bounceAlpha {
                            0% {opacity: 1; transform: translateX(0px) scale(1);}
                            25%{opacity: 0; transform:translateX(10px) scale(0.9);}
                            26%{opacity: 0; transform:translateX(-10px) scale(0.9);}
                            55% {opacity: 1; transform: translateX(0px) scale(1);}
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
        )
    );
}
