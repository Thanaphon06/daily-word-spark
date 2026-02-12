import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTodayWords, isTodayComplete } from "@/lib/storage";
import { SwipeCard } from "@/components/SwipeCard";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Word } from "@/data/words";

export default function Learn() {
  const navigate = useNavigate();
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isTodayComplete()) {
      navigate("/congrats", { replace: true });
      return;
    }
    setWords(getTodayWords());
  }, [navigate]);

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      // Last card done
      navigate("/congrats");
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  if (words.length === 0) return null;

  return (
    <div className="min-h-screen flex flex-col px-4 pt-4 pb-8">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-full hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <span className="text-sm font-semibold text-foreground">
          {currentIndex + 1} / {words.length}
        </span>
        <div className="w-9" />
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-sm mx-auto h-2 bg-muted rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
        />
      </div>

      {/* Card area */}
      <div className="flex-1 flex items-center justify-center">
        <SwipeCard
          key={words[currentIndex].id}
          word={words[currentIndex]}
          onSwipeLeft={handleNext}
          onSwipeRight={handlePrev}
        />
      </div>

      {/* Navigation arrows */}
      <div className="flex justify-center gap-8 mt-6">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-3 rounded-full bg-muted text-muted-foreground disabled:opacity-30 hover:bg-secondary transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="p-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-4">
        ← ปัดซ้ายไปคำถัดไป | ปัดขวาย้อนกลับ →
      </p>
    </div>
  );
}
