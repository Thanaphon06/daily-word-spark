import { useNavigate } from "react-router-dom";
import { isTodayComplete, getTotalLearnedCount } from "@/lib/storage";
import { BookOpen, Sparkles, Trophy } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const completed = isTodayComplete();
  const totalLearned = getTotalLearnedCount();

  const today = new Date().toLocaleDateString("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen flex flex-col items-center px-6 pt-12 pb-24">
      <div className="w-full max-w-sm space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-accent">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">เรียนทุกวัน เก่งขึ้นทุกวัน</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">คำศัพท์วันนี้</h1>
          <p className="text-sm text-muted-foreground">{today}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-2xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-primary">
              {completed ? "10" : "0"}/10
            </div>
            <p className="text-xs text-muted-foreground mt-1">คำศัพท์วันนี้</p>
          </div>
          <div className="bg-card rounded-2xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-accent flex items-center justify-center gap-1">
              <Trophy className="w-6 h-6" />
              {totalLearned}
            </div>
            <p className="text-xs text-muted-foreground mt-1">คำทั้งหมด</p>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={() => {
            if (completed) {
              navigate("/learned");
            } else {
              navigate("/learn");
            }
          }}
          className="w-full bg-primary text-primary-foreground rounded-2xl py-4 text-lg font-semibold shadow-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          <BookOpen className="w-6 h-6" />
          {completed ? "ดูคำที่เรียนแล้ว" : "เริ่มเรียน"}
        </button>

        {completed && (
          <p className="text-center text-sm text-success font-medium">
            ✅ เรียนครบแล้ววันนี้ เก่งมาก!
          </p>
        )}




  

    {/* เพิ่มส่วนข้อมูลติดต่อเล็กๆ ตรงนี้ */}
    <div className="fixed bottom-24 right-6 text-[10px] text-slate-400 text-right">
        <p>พบเจอปัญหา หรือ อยากเลี้ยงกาแฟ</p>
        <p>ติดต่อได้ที่นี้: support@example.com</p>
          
    </div>
  </div>
</div>

      
    
  );
}
