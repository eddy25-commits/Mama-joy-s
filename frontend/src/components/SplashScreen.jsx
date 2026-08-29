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
      <div className="splash-content">
        <span className="splash-logo-ring">
          <img src="/logo.png" alt="MJ Cosmetics and Collections" className="splash-logo-mark" />
        </span>
        <span className="splash-logo-name">MJ</span>
        <span className="splash-logo-sub">Cosmetics &amp; Collections</span>
        <span className="splash-slogan">
          Quality beauty essentials for the woman who knows her worth.
        </span>
      </div>
    </div>
  );
}