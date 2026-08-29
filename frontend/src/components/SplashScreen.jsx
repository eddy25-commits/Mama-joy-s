import { useEffect, useState } from "react";
import { markSplashSeen } from "../utils/splash";
import "./SplashScreen.css";

const DISPLAY_MS = 1400;
const FADE_MS = 500;

export default function SplashScreen({ onFinish }) {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadingOut(true), DISPLAY_MS);
    const finishTimer = setTimeout(() => {
      markSplashSeen();
      onFinish?.();
    }, DISPLAY_MS + FADE_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className={`splash-screen ${fadingOut ? "is-fading" : ""}`} role="status" aria-label="Loading">
      <img src="/splash-logo.jpg" alt="Mama Joy's Cosmetics and Collections" className="splash-logo" />
    </div>
  );
}
