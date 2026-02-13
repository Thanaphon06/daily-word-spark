import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getTodayWords, isTodayComplete } from "@/lib/storage";
import { SwipeCard } from "@/components/SwipeCard";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Word } from "@/data/words";

export default function Learn() {
  const navigate = useNavigate();
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // State สำหรับจัดการการปัดทั้งหน้าจอ
  const [offset, setOffset] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const startX = useRef(0);

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
      navigate("/congrats");
    }
    setOffset(0); // รีเซ็ตตำแหน่งเมื่อเปลี่ยนคำ
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
    setOffset(0); // รีเซ็ตตำแหน่งเมื่อเปลี่ยนคำ
  };

  // Event Handlers สำหรับตรวจจับการปัดทั้งหน้าจอ
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    // ป้องกันการทำงานซ้ำซ้อนถ้ากดโดนปุ่ม
    if ((e.target as HTMLElement).closest('button')) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    startX.current = clientX;
    setSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!swiping) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const dx = clientX - startX.current;
    setOffset(dx);
  };

  const handleTouchEnd = () => {
    if (!swiping) return;
    setSwiping(false);

    const threshold = 100; // ระยะที่ถือว่าต้องการปัดจริง
    if (offset < -threshold) {
      handleNext();
    } else if (offset > threshold) {
      handlePrev();
    } else {
      setOffset(0); // ถ้าปัดไม่ถึงระยะ ให้เด้งกลับ
    }
  };

  if (words.length === 0) return null;

  return (
    <div 
      className="min-h-screen flex flex-col px-4 pt-4 pb-8 touch-none select-none" 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onMouseLeave={() => swiping && handleTouchEnd()}
    >
      {/* Top bar - ใส่ z-10 เพื่อให้กดปุ่มย้อนกลับได้เสมอ */}
      <div className="flex items-center justify-between mb-6 z-10 relative">
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-full hover:bg-muted transition-colors pointer-events-auto"
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

      {/* Card area - ส่วนที่แสดงการ์ดเพียงใบเดียวที่เคลื่อนไหวตามหน้าจอ */}
      <div className="flex-1 flex items-center justify-center relative">
        <SwipeCard
          key={words[currentIndex].id}
          word={words[currentIndex]}
          externalOffset={offset}      // ส่งค่าระยะลากจากทั้งหน้าจอ
          isExternalSwiping={swiping} // บอกสถานะว่ากำลังลากอยู่หรือไม่
        />
      </div>

      {/* Navigation arrows - ใส่ z-10 เพื่อให้กดปุ่มได้แม้จะอยู่บน layer ปัด */}
      <div className="flex justify-center gap-8 mt-6 z-10 relative">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-3 rounded-full bg-muted text-muted-foreground disabled:opacity-30 hover:bg-secondary transition-colors pointer-events-auto"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="p-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-colors pointer-events-auto"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-4 italic">
        ← ปัดซ้ายไปต่อ | ปัดขวาย้อนกลับ →
      </p>
    </div>
  );
}