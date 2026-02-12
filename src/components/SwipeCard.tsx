import { useState, useRef } from "react";
import { Word } from "@/data/words";
import { Eye, EyeOff } from "lucide-react";

interface SwipeCardProps {
  word: Word;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  showTranslationDefault?: boolean;
}

export function SwipeCard({ word, onSwipeLeft, onSwipeRight, showTranslationDefault = false }: SwipeCardProps) {
  const [showTranslation, setShowTranslation] = useState(showTranslationDefault);
  const [offset, setOffset] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const isHorizontal = useRef<boolean | null>(null);

  const handleStart = (clientX: number, clientY: number) => {
    startX.current = clientX;
    startY.current = clientY;
    isHorizontal.current = null;
    setSwiping(true);
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!swiping) return;
    const dx = clientX - startX.current;
    const dy = clientY - startY.current;
    
    if (isHorizontal.current === null) {
      if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
        isHorizontal.current = Math.abs(dx) > Math.abs(dy);
      }
      return;
    }
    
    if (isHorizontal.current) {
      setOffset(dx);
    }
  };

  const handleEnd = () => {
    if (!swiping) return;
    setSwiping(false);
    
    if (offset < -80 && onSwipeLeft) {
      setOffset(-400);
      setTimeout(() => {
        onSwipeLeft();
        setOffset(0);
        setShowTranslation(showTranslationDefault);
      }, 200);
    } else if (offset > 80 && onSwipeRight) {
      setOffset(400);
      setTimeout(() => {
        onSwipeRight();
        setOffset(0);
        setShowTranslation(showTranslationDefault);
      }, 200);
    } else {
      setOffset(0);
    }
  };

  return (
    <div
      className="select-none touch-pan-y"
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleEnd}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={() => { if (swiping) handleEnd(); }}
    >
      <div
        className="bg-card rounded-2xl shadow-lg p-8 mx-auto max-w-sm w-full transition-transform"
        style={{
          transform: `translateX(${offset}px) rotate(${offset * 0.05}deg)`,
          transition: swiping ? "none" : "transform 0.3s ease-out",
          opacity: Math.max(0, 1 - Math.abs(offset) / 500),
        }}
      >
        <div className="text-center space-y-6">
          <p className="text-4xl font-bold text-foreground tracking-tight">
            {word.english}
          </p>

          {showTranslation ? (
            <div className="space-y-3 animate-fade-in">
              <p className="text-2xl text-primary font-medium">{word.thai}</p>
              {word.example && (
                <p className="text-sm text-muted-foreground italic">"{word.example}"</p>
              )}
            </div>
          ) : (
            <div className="h-16" />
          )}

          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-full bg-muted"
          >
            {showTranslation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showTranslation ? "ซ่อนคำแปล" : "แสดงคำแปล"}
          </button>
        </div>
      </div>
    </div>
  );
}
