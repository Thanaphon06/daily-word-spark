import { wordDatabase, Word } from "@/data/words";

const STORAGE_KEY = "vocabDaily";

interface AppState {
  dailySets: Record<string, number[]>;
  completedDates: string[];
  learnedWordIds: number[];
  theme?: 'light' | 'dark'; 
}



function getState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { dailySets: {}, completedDates: [], learnedWordIds: [] };
}

function setState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getTodayKey(): string {
  return new Date().toLocaleDateString('en-CA');
}

export function getTodayWords(): Word[] {
  const state = getState();
  const today = getTodayKey();

  if (state.dailySets[today]) {
    return state.dailySets[today]
      .map((id) => wordDatabase.find((w) => w.id === id)!)
      .filter(Boolean);
  }

  // Get recently used word IDs (last 7 days)
  const recentIds = new Set<number>();
  const sortedDates = Object.keys(state.dailySets).sort().reverse().slice(0, 7);
  sortedDates.forEach((d) => state.dailySets[d].forEach((id) => recentIds.add(id)));

  // Pick 10 words not recently used
  const available = wordDatabase.filter((w) => !recentIds.has(w.id));
  const pool = available.length >= 10 ? available : wordDatabase;
  
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, 10);
  
  state.dailySets[today] = picked.map((w) => w.id);
  setState(state);

  return picked;
}

export function markTodayComplete() {
  const state = getState();
  const today = getTodayKey();
  if (!state.completedDates.includes(today)) {
    state.completedDates.push(today);
  }
  const todayIds = state.dailySets[today] || [];
  todayIds.forEach((id) => {
    if (!state.learnedWordIds.includes(id)) {
      state.learnedWordIds.push(id);
    }
  });
  setState(state);
}

export function isTodayComplete(): boolean {
  const state = getState();
  return state.completedDates.includes(getTodayKey());
}

export function getTodayProgress(): number {
  return isTodayComplete() ? 10 : 0;
}

export function getLearnedWords(): Word[] {
  const state = getState();
  return state.learnedWordIds
    .map((id) => wordDatabase.find((w) => w.id === id)!)
    .filter(Boolean);
}

export function getTotalLearnedCount(): number {
  return getState().learnedWordIds.length;
}

// 2. เพิ่มฟังก์ชันสำหรับ Theme ด้านล่างสุดของไฟล์
export function getStoredTheme(): 'light' | 'dark' {
  const state = getState();
  return state.theme || 'light';
}

export function setStoredTheme(theme: 'light' | 'dark') {
  const state = getState();
  state.theme = theme;
  setState(state);
}