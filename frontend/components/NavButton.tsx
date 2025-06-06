'use client';

import { ChakraProvider, extendTheme, Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const theme = extendTheme({});

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
      const customEvent = e as CustomEvent;
      setSteps(customEvent.detail);
      setCurrentIndex(0);
    };

    window.addEventListener('setSteps', handleSetSteps);
    return () => {
      window.removeEventListener('setSteps', handleSetSteps);
    };
  }, []);

  const handleNextStep = () => {
    if (steps.length === 0) return;
    if (currentIndex >= steps.length){
      console.log('All steps completed!');
      return;
    }

    const currentStep = steps[currentIndex+1];
    const event = new CustomEvent('focusOnStep', { detail: currentStep });
    window.dispatchEvent(event);

    setCurrentIndex((prev) => (prev + 1));
  };

  return (
      <ChakraProvider resetCSS={false} theme={theme}>
        <div
            className={`
            absolute bottom-8 right-4
            flex flex-col md:flex-row justify-center items-center
            md:space-x-6
            bg-white/80 dark:bg-black/30 backdrop-blur-xl
            rounded-2xl px-4 py-2 shadow-md ring-1 ring-black/10
            group
            transition-transform duration-200
            hover:scale-105

          `}
            style={{
              WebkitBackdropFilter: 'blur(6px)',
              backdropFilter: 'blur(6px)',
            }}
        >
          <Button
              variant="ghost"
              sx={{
                fontWeight: "bold",
                bg: "transparent",
                color: "black",
                transition: "all 0.2s",
                _hover: {
                  bg: "white/80",
                  color: "black",
                },
                _focus: {
                  bg: "white/80",
                  boxShadow: "outline",
                },
                borderRadius: "1em",
                px: "1.5em",
                py: "1.1em"
              }}
              onClick={handleNextStep}
          >
            Next Step
          </Button>
        </div>
      </ChakraProvider>
  );
}
