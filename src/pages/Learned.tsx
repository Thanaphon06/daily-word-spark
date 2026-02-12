import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLearnedWords } from "@/lib/storage";
import { Search, ChevronRight } from "lucide-react";

export default function Learned() {
  const navigate = useNavigate();
  const words = getLearnedWords();
  const [search, setSearch] = useState("");

  const filtered = words.filter(
    (w) =>
      w.english.toLowerCase().includes(search.toLowerCase()) ||
      w.thai.includes(search)
  );

  return (
    <div className="min-h-screen pb-24 px-4 pt-8">
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-xl font-bold text-foreground">
          คำที่เรียนแล้ว ({words.length} คำ)
        </h1>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="ค้นหาคำศัพท์..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card rounded-xl pl-10 pr-4 py-3 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>

        {/* Word list */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {words.length === 0
              ? "ยังไม่มีคำที่เรียน เริ่มเรียนเลย!"
              : "ไม่พบคำที่ค้นหา"}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((word, idx) => (
              <button
                key={word.id}
                onClick={() => navigate(`/card/${word.id}`)}
                className="w-full bg-card rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md active:scale-[0.99] transition-all text-left"
              >
                <div>
                  <p className="font-semibold text-foreground">{word.english}</p>
                  <p className="text-sm text-muted-foreground">{word.thai}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
