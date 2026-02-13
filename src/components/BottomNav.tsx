import { Home, BookOpen,Moon, Sun } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getStoredTheme, setStoredTheme } from "@/lib/storage";
const tabs = [
  { path: "/", icon: Home, label: "หน้าหลัก" },
  { path: "/learned", icon: BookOpen, label: "คำที่เรียนแล้ว" },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  // 3. เพิ่ม Logic สำหรับสลับโหมด
  const [isDark, setIsDark] = useState(() => {
    const saved = getStoredTheme();
    // สั่งให้เปลี่ยน class ทันทีตั้งแต่เริ่มโหลด
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      return true;
    }
    return false;
  });

  useEffect(() => {
    // เช็คค่าเริ่มต้น
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove('dark');
      setStoredTheme('light'); // บันทึกว่าใช้ Light
      setIsDark(false);
    } else {
      html.classList.add('dark');
      setStoredTheme('dark'); // บันทึกว่าใช้ Dark
      setIsDark(true);
    }
  };

  // Hide on learn/congrats pages
  if (["/learn", "/congrats"].includes(location.pathname) || location.pathname.startsWith("/card/")) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-bottom z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-1 px-6 py-2 transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}

        {/* 4. เพิ่มปุ่มสลับโหมดตรงนี้ */}
        <button
          onClick={toggleTheme}
          className="flex flex-col items-center gap-1 px-6 py-2 transition-colors text-muted-foreground hover:text-primary"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="text-xs font-medium">{isDark ? "โหมดสว่าง" : "โหมดมืด"}</span>
        </button>

    
      </div>
    </nav>
  );
}
