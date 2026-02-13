import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { markTodayComplete } from "@/lib/storage";
import { PartyPopper, BookOpen, Home } from "lucide-react";

export default function Congrats() {
  const navigate = useNavigate();

  useEffect(() => {
    markTodayComplete();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 pb-12">
      <div className="text-center space-y-6 max-w-sm">
        <div className="text-6xl mb-2">🎉</div>
        <PartyPopper className="w-12 h-12 text-accent mx-auto" />
        <h1 className="text-2xl font-bold text-foreground">
          ยินดีด้วย!
        </h1>
        <p className="text-lg text-muted-foreground">
          วันนี้คุณเก่งขึ้นมาก 💪
        </p>
        <p className="text-sm text-muted-foreground">
          เรียนครบ 10 คำแล้ว พรุ่งนี้มาเรียนใหม่นะ!
        </p>

        <div className="space-y-3 pt-4">
          <button
            onClick={() => navigate("/learned")}
            className="w-full bg-primary text-primary-foreground rounded-2xl py-3.5 font-semibold flex items-center justify-center gap-2 shadow-lg hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <BookOpen className="w-5 h-5" />
            ดูคำที่เรียนแล้ว
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-muted text-foreground rounded-2xl py-3.5 font-semibold flex items-center justify-center gap-2 hover:bg-secondary active:scale-[0.98] transition-all"
          >
            <Home className="w-5 h-5" />
            กลับหน้าหลัก
          </button>
        </div>
      </div>
    </div>
  );
}
