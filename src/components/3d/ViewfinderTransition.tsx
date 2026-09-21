import React, { useEffect, useRef, useState } from 'react';

interface ViewfinderTransitionProps {
  progress: number; // 0 to 1
}

export const ViewfinderTransition: React.FC<ViewfinderTransitionProps> = ({ progress }) => {
  const [isFlashing, setIsFlashing] = useState(false);
  const [flashKey, setFlashKey] = useState(0);
  const hasFiredRef = useRef(false);

  useEffect(() => {
    // 1. Trigger the flash once when scrolling down past the threshold (0.74)
    if (progress >= 0.74 && !hasFiredRef.current) {
      hasFiredRef.current = true;
      setFlashKey((k) => k + 1); // Reset animation key
      setIsFlashing(true);

      // Autonomous timer: flash fades out and cleans up after 450ms, completely independent of scroll!
      const timer = setTimeout(() => {
        setIsFlashing(false);
      }, 450);

      return () => clearTimeout(timer);
    }

    // 2. Re-arm the trigger only when the user scrolls back up past 0.50
    if (progress < 0.50) {
      hasFiredRef.current = false;
    }
  }, [progress]);

  if (!isFlashing) return null;

  return (
    <div 
      key={flashKey}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
    >
      {/* Autonomous Camera Shutter Flash (Does not follow scroll) */}
      <div className="absolute inset-0 bg-white/95 animate-camera-flash" />

      {/* Subtle warm optical strobe ring */}
      <div 
        className="absolute inset-0 bg-cinema-amber/20 mix-blend-screen animate-camera-flash" 
        style={{ animationDuration: '0.35s' }}
      />
    </div>
  );
};
