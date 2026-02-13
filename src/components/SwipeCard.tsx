import { useState, useEffect } from "react";
import { Word } from "@/data/words";
import { Eye, EyeOff } from "lucide-react";

interface SwipeCardProps {
  word: Word;
  externalOffset?: number;
  isExternalSwiping?: boolean;
  showTranslationDefault?: boolean;
}

export function SwipeCard({ 
  word, 
  externalOffset = 0, 
  isExternalSwiping = false, 
  showTranslationDefault = false 
}: SwipeCardProps) {
  const [showTranslation, setShowTranslation] = useState(showTranslationDefault);

  useEffect(() => {
    setShowTranslation(showTranslationDefault);
  }, [word, showTranslationDefault]);

  return (
    <div
      className="bg-card rounded-2xl shadow-lg p-8 mx-auto max-w-sm w-full relative overflow-hidden"
      style={{
        transform: `translateX(${externalOffset}px) rotate(${externalOffset * 0.05}deg)`,
        transition: isExternalSwiping ? "none" : "transform 0.3s ease-out, opacity 0.3s",
        opacity: Math.max(0, 1 - Math.abs(externalOffset) / 500),
        pointerEvents: 'auto',
        userSelect: 'none'
      }}
    >
      <div className="text-center space-y-6">
        {/* คืนค่า Font: font-bold, ไม่เอียง (no italic), ไม่ตัวใหญ่หมด (no uppercase) */}
        <p className="text-4xl font-bold text-foreground tracking-tight">
          {word.english}
        </p>

        <div className="h-28 flex items-center justify-center">
          {showTranslation ? (
            <div className="space-y-3 animate-fade-in">
              <p className="text-2xl text-primary font-medium">{word.thai}</p>
              {word.example && (
                <p className="text-sm text-muted-foreground italic px-4">
                  "{word.example}"
                </p>
              )}
            </div>
          ) : (
            <div className="h-16" />
          )}
        </div>

        <button
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onClick={() => setShowTranslation(!showTranslation)}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-full bg-muted"
        >
          {showTranslation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showTranslation ? "ซ่อนคำแปล" : "แสดงคำแปล"}
        </button>
      </div>
    </div>
  );
}