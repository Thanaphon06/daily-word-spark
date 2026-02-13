import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLearnedWords } from "@/lib/storage";
import { ChevronRight, ChevronLeft } from "lucide-react";

// เพิ่มฟังก์ชันดึงข้อมูลจาก localStorage
function getDailySets(): Record<string, number[]> {
  try {
    const raw = localStorage.getItem("vocabDaily");
    if (raw) {
      const state = JSON.parse(raw);
      return state.dailySets || {};
    }
  } catch {}
  return {};
}

export default function Learned() {
  const navigate = useNavigate();
  const allWords = getLearnedWords();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Format date to YYYY-MM-DD for comparison
  const formatDateKey = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // Get daily sets data
  const dailySets = getDailySets();

  // Filter words by selected date
  const selectedDateKey = formatDateKey(selectedDate);
  const wordIdsForDate = dailySets[selectedDateKey] || [];
  const wordsForSelectedDate = allWords.filter((w) => 
    wordIdsForDate.includes(w.id)
  );

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const changeMonth = (offset) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + offset);
    setCurrentMonth(newMonth);
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date) => {
    if (!date) return false;
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const hasWords = (date) => {
    if (!date) return false;
    const dateKey = formatDateKey(date);
    return dailySets[dateKey] && dailySets[dateKey].length > 0;
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
                      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  const dayNames = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

  return (
    <div className="min-h-screen pb-24 px-4 pt-8">
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-xl font-bold text-foreground">
          คำที่เรียนแล้ว
        </h1>

        {/* Calendar */}
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <h2 className="text-base font-semibold text-foreground">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear() + 543}
            </h2>
            <button
              onClick={() => changeMonth(1)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground p-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => (
              <button
                key={index}
                onClick={() => date && setSelectedDate(date)}
                disabled={!date}
                className={`
                  aspect-square p-1 rounded-lg text-xs font-medium transition-all
                  ${!date ? 'invisible' : ''}
                  ${isSelected(date) ? 'bg-primary text-primary-foreground shadow-md' : ''}
                  ${isToday(date) && !isSelected(date) ? 'bg-muted text-foreground' : ''}
                  ${!isSelected(date) && !isToday(date) ? 'hover:bg-muted text-foreground' : ''}
                  ${hasWords(date) ? 'font-bold' : ''}
                `}
              >
                {date && (
                  <div className="flex flex-col items-center justify-center h-full">
                    <span>{date.getDate()}</span>
                    {hasWords(date) && (
                      <div className="w-1 h-1 bg-current rounded-full mt-0.5"></div>
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Selected date display */}
        <div className="text-sm text-muted-foreground text-center">
          {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear() + 543}
        </div>

        {/* Word list */}
        {wordsForSelectedDate.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Nothing
          </div>
        ) : (
          <div className="space-y-2">
            {wordsForSelectedDate.map((word) => (
              <button
                key={word.id}
                onClick={() => navigate(`/card/${word.id}`)}
                className="w-full bg-card rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md active:scale-[0.99] transition-all text-left border border-border"
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