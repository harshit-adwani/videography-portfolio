import React, { useEffect, useRef, useState } from 'react';
import { ANIMATION_CONFIG } from '../../config/animationConfig';

interface ViewfinderTransitionProps {
  progress: number; // 0 to 1
}

export const ViewfinderTransition: React.FC<ViewfinderTransitionProps> = ({ progress }) => {
  const [isBlackout, setIsBlackout] = useState(false);
  const [transitionKey, setTransitionKey] = useState(0);
  const hasFiredRef = useRef(false);

  const { timeline, transition } = ANIMATION_CONFIG;

  // If user loads page already scrolled past the threshold, do not trigger blackout on refresh
  useEffect(() => {
    if (progress >= timeline.breakthroughProgress) {
      hasFiredRef.current = true;
    }
  }, [timeline.breakthroughProgress]);

  useEffect(() => {
    // 1. Trigger the black fade out right before entering the optical viewfinder
    if (progress >= timeline.breakthroughProgress && !hasFiredRef.current) {
      hasFiredRef.current = true;
      setTransitionKey((k) => k + 1);
      setIsBlackout(true);

      // Autonomous timer: fade to black, peak blackout hold, then fade in from black into archive
      const timer = setTimeout(() => {
        setIsBlackout(false);
      }, transition.blackoutDurationMs);

      return () => clearTimeout(timer);
    }

    // 2. Re-arm the transition only when the user scrolls back up past rearm threshold
    if (progress < timeline.rearmProgress) {
      hasFiredRef.current = false;
    }
  }, [progress, timeline.breakthroughProgress, timeline.rearmProgress, transition.blackoutDurationMs]);

  if (!isBlackout) return null;

  return (
    <>
      <div 
        key={`blackout-${transitionKey}`}
        className="fixed inset-0 pointer-events-none z-[60] overflow-hidden bg-black animate-cinematic-blackout"
        style={{ animationDuration: `${transition.blackoutDurationMs}ms` }}
      />
      {transition.enableFlash && (
        <div 
          key={`flash-${transitionKey}`}
          className="fixed inset-0 pointer-events-none z-[61] overflow-hidden bg-white animate-camera-flash"
          style={{ animationDuration: `${transition.flashDurationMs}ms` }}
        />
      )}
    </>
  );
};
