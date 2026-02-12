import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLearnedWords } from "@/lib/storage";
import { SwipeCard } from "@/components/SwipeCard";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

export default function CardDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const words = useMemo(() => getLearnedWords(), []);

  const startIdx = words.findIndex((w) => w.id === Number(id));
  const [currentIndex, setCurrentIndex] = useState(Math.max(0, startIdx));

  if (words.length === 0) {
    navigate("/learned", { replace: true });
    return null;
  }

  const word = words[currentIndex];
  if (!word) return null;

  const goNext = () => {
    if (currentIndex < words.length - 1) setCurrentIndex((i) => i + 1);
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  return (
    <div className="min-h-screen flex flex-col px-4 pt-4 pb-8">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/learned")}
          className="p-2 rounded-full hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <span className="text-sm font-semibold text-foreground">
          {currentIndex + 1} / {words.length}
        </span>
        <div className="w-9" />
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center">
        <SwipeCard
          key={word.id}
          word={word}
          showTranslationDefault={true}
          onSwipeLeft={goNext}
          onSwipeRight={goPrev}
        />
      </div>

      {/* Nav buttons */}
      <div className="flex justify-center gap-8 mt-6">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="p-3 rounded-full bg-muted text-muted-foreground disabled:opacity-30 hover:bg-secondary transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={goNext}
          disabled={currentIndex === words.length - 1}
          className="p-3 rounded-full bg-primary text-primary-foreground disabled:opacity-30 hover:opacity-90 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-4">
        ← ปัดซ้าย/ขวาเพื่อเปลี่ยนคำ →
      </p>
    </div>
  );
}
