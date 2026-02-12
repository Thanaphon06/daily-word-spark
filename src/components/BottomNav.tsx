import { Home, BookOpen } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { path: "/", icon: Home, label: "หน้าหลัก" },
  { path: "/learned", icon: BookOpen, label: "คำที่เรียนแล้ว" },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

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
      </div>
    </nav>
  );
}
