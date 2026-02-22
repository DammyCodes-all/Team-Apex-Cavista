import { useState, useEffect, useRef } from "react";

export function useTypewriter(
  fullText: string,
  isActive: boolean,
  charDelay: number = 12,
): { displayedText: string; isComplete: boolean } {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    // Reset when text or active state changes
    if (!isActive || !fullText) {
      setDisplayedText(isActive ? "" : fullText);
      setIsComplete(!isActive);
      indexRef.current = 0;
      return;
    }

    setDisplayedText("");
    setIsComplete(false);
    indexRef.current = 0;

    const interval = setInterval(() => {
      indexRef.current += 1;

      if (indexRef.current >= fullText.length) {
        setDisplayedText(fullText);
        setIsComplete(true);
        clearInterval(interval);
      } else {
        setDisplayedText(fullText.slice(0, indexRef.current));
      }
    }, charDelay);

    return () => clearInterval(interval);
  }, [fullText, isActive, charDelay]);

  return { displayedText, isComplete };
}
