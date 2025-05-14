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
      <div className="absolute bottom-4 right-4">
        <Button colorScheme="blue" onClick={handleNextStep}>Next Step</Button>
      </div>
    </ChakraProvider>
  );
}
