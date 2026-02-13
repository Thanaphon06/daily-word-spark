import { useState, useMemo ,useEffect,useRef} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLearnedWords } from "@/lib/storage";
import { SwipeCard } from "@/components/SwipeCard";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

export default function CardDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const words = useMemo(() => getLearnedWords(), []);

    // State สำหรับจัดการการปัดทั้งหน้าจอ
  const [offset, setOffset] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const startX = useRef(0);

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
          externalOffset={offset}      // ส่งค่าระยะลากจากทั้งหน้าจอ
          isExternalSwiping={swiping} // บอกสถานะว่ากำลังลากอยู่หรือไม่
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
         ← ปัดซ้ายไปต่อ | ปัดขวาย้อนกลับ →
      </p>
    </div>
  );
}
